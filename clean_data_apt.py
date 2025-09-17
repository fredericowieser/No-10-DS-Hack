import pandas as pd
import numpy as np
from datetime import datetime
import json

def create_dataset_for_professional_type(
    # File paths for all datasets
    gp_request_path="data/GP Request.csv",
    patients_path="data/Patient.csv",
    comorbidities_path="data/Co-morbidities.csv",
    registrations_path="data/GP Registration.csv",
    clinics_path="data/GP Clinics.csv",
    ons_survey_path="data/ONS GP Survey.csv",
    output_path="enhanced_numerical_dataset_for_professional_type.csv"
):
    """
    Loads, merges, and engineers features to create a numerical dataset
    with a binary 'GP' vs 'Nurse' target.

    Args:
        gp_request_path (str): Path to the GP Request CSV.
        # ... other file paths
        output_path (str): Path to save the final merged CSV file.

    Returns:
        pd.DataFrame: The final merged and cleaned numerical DataFrame.
    """
    print("Starting dataset creation for GP vs. Nurse prediction...")

    # --- 1. Load All Datasets ---
    try:
        gp_request = pd.read_csv(gp_request_path)
        patients = pd.read_csv(patients_path)
        comorbidities = pd.read_csv(comorbidities_path)
        registrations = pd.read_csv(registrations_path)
        clinics = pd.read_csv(clinics_path)
        ons_survey = pd.read_csv(ons_survey_path)
        print("All datasets loaded successfully.")
    except FileNotFoundError as e:
        print(f"Error loading files: {e}. Please ensure all CSV files are in the correct directory.")
        return None
    
    # --- 2. Create the New Binary Target Variable ---
    
    # --- FIX: Use a helper function to avoid dtype conflicts ---
    def assign_professional(appointment_type):
        if pd.isna(appointment_type):
            return None
        if 'GP' in str(appointment_type):
            return 'GP'
        if 'Nurse' in str(appointment_type):
            return 'Nurse'
        return None

    gp_request['care_professional_type'] = gp_request['requested_appointment_type'].apply(assign_professional)
    
    # Define the new target column
    target_col = 'care_professional_type'
    
    # Remove rows where the target could not be determined
    gp_request.dropna(subset=[target_col], inplace=True)
    print(f"Created binary target '{target_col}'. Kept {len(gp_request)} valid records.")

    # --- 3. Feature Engineering (Same as before) ---
    print("Engineering features...")
    patients["date_of_birth"] = pd.to_datetime(patients["date_of_birth"])
    today = datetime.now()
    age = today.year - patients["date_of_birth"].dt.year
    birthday_not_passed = (today.month < patients["date_of_birth"].dt.month) | \
                          ((today.month == patients["date_of_birth"].dt.month) & \
                           (today.day < patients["date_of_birth"].dt.day))
    patients["age"] = age - birthday_not_passed.astype(int)
    patients_processed = patients[["person_id", "age", "sex"]].rename(columns={"person_id": "patient_id"})

    registrations = registrations[registrations["is_latest_registration"] == True]
    registrations["registration_start_date"] = pd.to_datetime(registrations["registration_start_date"])
    registrations["time_with_practice_days"] = (today - registrations["registration_start_date"]).dt.days
    registrations_processed = registrations[["patient_id", "time_with_practice_days", "High_Level_Health_Geography"]]
    
    comorbidity_counts = comorbidities.groupby("patient_id").size().reset_index(name="comorbidity_count")
    comorb_pivot = comorbidities.assign(value=1).pivot_table(
        index="patient_id", columns="Condition_Category", values="value", fill_value=0
    ).add_prefix("has_").reset_index()

    request_counts = gp_request.groupby("patient_id").size().reset_index(name="total_requests")

    ons_experience = ons_survey[ons_survey['Question_ID'] == 'GPP-013'].copy()
    score_mapping = {'Very good': 2, 'Fairly good': 1, 'Neither good nor poor': 0, 'Fairly poor': -1, 'Very poor': -2, 'Don’t know': 0}
    ons_experience['score'] = ons_experience['Response_option'].str.strip().map(score_mapping)
    ons_experience['weighted_score'] = ons_experience['score'] * ons_experience['untitled_column']
    ons_scores = (ons_experience.groupby('Demographic_breakdown')['weighted_score'].sum() / ons_experience.groupby('Demographic_breakdown')['untitled_column'].sum()).reset_index(name='ons_satisfaction_score')
    
    clinics['clinic_start_timestamp'] = pd.to_datetime(clinics['clinic_start_timestamp']).dt.tz_localize(None)
    future_clinics = clinics[clinics['clinic_start_timestamp'] > today].copy()
    availability = future_clinics.groupby('Clinic_Care_Professional')['total_vacant_slots_new'].sum()
    gp_availability = availability.get('GP', 0)
    nurse_availability = availability.get('Nurse', 0)

    gp_request['date_referral_received'] = pd.to_datetime(gp_request['date_referral_received'])
    gp_request['request_month'] = gp_request['date_referral_received'].dt.month
    gp_request['request_day_of_week'] = gp_request['date_referral_received'].dt.dayofweek
    notes_series = gp_request['new_referral_notes'].fillna('').astype(str)
    gp_request['note_length'] = notes_series.str.len()
    urgency_keywords = ['urgent', 'severe', 'worsening', 'immediate', 'asap', 'concerning']
    gp_request['urgency_keyword_count'] = notes_series.str.lower().str.count('|'.join(urgency_keywords))

    # --- 4. Merge All Datasets ---
    print("Merging all data sources...")
    df = gp_request.merge(patients_processed, on="patient_id", how="left")
    df = df.merge(registrations_processed, on="patient_id", how="left")
    df = df.merge(comorbidity_counts, on="patient_id", how="left")
    df = df.merge(comorb_pivot, on="patient_id", how="left")
    df = df.merge(request_counts, on="patient_id", how="left")
    df = df.merge(ons_scores, left_on='High_Level_Health_Geography', right_on='Demographic_breakdown', how='left')
    df['gp_availability'] = gp_availability
    df['nurse_availability'] = nurse_availability

    # --- 5. Final Processing and Encoding ---
    print("Cleaning and encoding final dataset...")
    df.dropna(subset=['age', 'time_with_practice_days'], inplace=True)
    comorbidity_cols = [col for col in df.columns if col.startswith('has_')]
    df[comorbidity_cols] = df[comorbidity_cols].fillna(0)
    df[['comorbidity_count', 'total_requests']] = df[['comorbidity_count', 'total_requests']].fillna(0)
    df['ons_satisfaction_score'] = df['ons_satisfaction_score'].fillna(df['ons_satisfaction_score'].mean())
    df['patient_is_on_cancer_pathway'] = df['patient_is_on_cancer_pathway'].fillna(0).astype(int)
    
    df[target_col], labels = pd.factorize(df[target_col])
    
    label_mapping = {i: label for i, label in enumerate(labels)}
    with open('professional_type_label_mapping.json', 'w') as f:
        json.dump(label_mapping, f)
    print(f"Target variable '{target_col}' encoded. Mapping saved to professional_type_label_mapping.json")

    # One-hot encode all relevant categorical features
    categorical_cols = ['sex', 'priority', 'rtt_pathway_status', 'requested_appointment_type']
    df = pd.get_dummies(df, columns=categorical_cols, dummy_na=False)

    numerical_df = df.select_dtypes(include=np.number)

    # --- 6. Save the Dataset ---
    numerical_df.to_csv(output_path, index=False)
    print(f"\n✅ Successfully created and saved the dataset to {output_path}")
    print(f"Final dataset shape: {numerical_df.shape}")
    
    return numerical_df

if __name__ == "__main__":
    create_dataset_for_professional_type()