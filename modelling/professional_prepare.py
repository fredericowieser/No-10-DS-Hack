import pandas as pd
import numpy as np
from datetime import datetime
import json

prio_feature_columns = [
    "sex_female",
    "age",
    "has_cardiovascular_disease",
    "has_digestive_disease",
    "has_musculoskeletal_disease",
    "has_respiratory_disease",
    "comorbidity_count",
    "patient_is_on_cancer_pathway",
    "urgency_keyword_count",
    "total_requests",
]

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["date_of_birth"] = pd.to_datetime(df["date_of_birth"], errors="coerce")
    today = datetime.now()
    age = today.year - df["date_of_birth"].dt.year
    birthday_not_passed = (
        (today.month < df["date_of_birth"].dt.month) |
        ((today.month == df["date_of_birth"].dt.month) & (today.day < df["date_of_birth"].dt.day))
    )
    df["age"] = age - birthday_not_passed.astype(int)

    # Request timing features
    df['date_referral_received'] = pd.to_datetime(df['date_referral_received'], errors="coerce")
    df['request_month'] = df['date_referral_received'].dt.month
    df['request_day_of_week'] = df['date_referral_received'].dt.dayofweek

    # Text features from notes
    notes_series = df['new_referral_notes'].fillna('').astype(str)
    df['note_length'] = notes_series.str.len()
    urgency_keywords = ['urgent', 'severe', 'worsening', 'immediate', 'asap', 'concerning']
    df['urgency_keyword_count'] = notes_series.str.lower().str.count('|'.join(urgency_keywords))

    df = df.rename(
        columns=lambda col: col.strip().lower().replace(" ", "_")
    )

    # Fill comorbidity columns
    comorb_cols = [c for c in df.columns if c.startswith("has_")]
    df[comorb_cols] = df[comorb_cols].fillna(0)
    df[['comorbidity_count', 'total_requests']] = df[['comorbidity_count', 'total_requests']].fillna(0)
    if 'patient_is_on_cancer_pathway' in df.columns:
        df['patient_is_on_cancer_pathway'] = df['patient_is_on_cancer_pathway'].fillna(0).astype(int)

    categorical_cols = ['sex']
    df = pd.get_dummies(df, columns=[c for c in categorical_cols if c in df.columns])
    
    if "care_professional_type" in df.columns:
        return df[prio_feature_columns + ["care_professional_type"]]

    return df[prio_feature_columns]

def create_dataset_for_professional_type(
    # File paths for all datasets
    gp_request_path="datasets/gp_request.csv",
    patients_path="datasets/patients.csv",
    comorbidities_path="datasets/comorbidities.csv",
    output_path="datasets/professional_training.csv",
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
        print("All datasets loaded successfully.")
    except FileNotFoundError as e:
        print(f"Error loading files: {e}. Please ensure all CSV files are in the correct directory.")
        return None
    
    patients = patients[["person_id", "date_of_birth", "sex"]].rename(
        columns={"person_id": "patient_id"}
    )

    comorbidities = comorbidities.rename(
        columns=lambda col: col.strip().lower().replace(" ", "_")
    )

    # Comorbidities — prepare two tables: counts and one-hot pivot
    comorbidity_counts = (
        comorbidities.groupby("patient_id")
        .size()
        .reset_index(name="comorbidity_count")
    )

    comorb_pivot = (
        comorbidities.assign(value=1)
        .pivot_table(index="patient_id", columns="condition_category", values="value", fill_value=0)
        .add_prefix("has_")
        .reset_index()
    )

    # Request counts
    request_counts = (
        gp_request.groupby("patient_id")
        .size()
        .reset_index(name="total_requests")
    )

    # -----------------------------
    # 3. Merge all datasets first
    # -----------------------------
    print("Merging all data sources...")

    df = gp_request.merge(patients, left_on="patient_id", right_on="person_id", how="left")
    df = df.merge(comorbidity_counts, on="patient_id", how="left")
    df = df.merge(comorb_pivot, on="patient_id", how="left")
    df = df.merge(request_counts, on="patient_id", how="left")
    # --- 2. Create the New Binary Target Variable ---

    # --- 3. Feature Engineering (Same as before) --
    def assign_professional(appointment_type):
        if pd.isna(appointment_type):
            return None
        if 'GP' in str(appointment_type):
            return 'GP'
        if 'Nurse' in str(appointment_type):
            return 'Nurse'
        return None

    print("Engineering features...")

    df['care_professional_type'] = df['requested_appointment_type'].apply(assign_professional)

    df = engineer_features(df)
    
    # Define the new target column
    target_col = 'care_professional_type'
    
    # Remove rows where the target could not be determined
    df.dropna(subset=[target_col], inplace=True)
    print(f"Created binary target '{target_col}'. Kept {len(df)} valid records.")

    df[target_col], labels = pd.factorize(df[target_col])
    
    label_mapping = {i: label for i, label in enumerate(labels)}
    with open('professional_type_label_mapping.json', 'w') as f:
        json.dump(label_mapping, f)
    print(f"Target variable '{target_col}' encoded. Mapping saved to professional_type_label_mapping.json")

    numerical_df = df.select_dtypes(include=(np.number, np.bool))

    # --- 6. Save the Dataset ---
    numerical_df.to_csv(output_path, index=False)
    print(f"\n✅ Successfully created and saved the dataset to {output_path}")
    print(f"Final dataset shape: {numerical_df.shape}")
    
    return numerical_df

if __name__ == "__main__":
    create_dataset_for_professional_type()