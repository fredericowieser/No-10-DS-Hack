import pandas as pd
import numpy as np
import json
from datetime import datetime

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
    urgency_keywords = ['urgent', 'severe', 'worsening', 'immediate', 'asap', 'concerning', 'hypertension']
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
    
    if "priority" in df.columns:
        return df[prio_feature_columns + ["priority"]]

    return df[prio_feature_columns]

def create_enhanced_numerical_dataset_for_priority(
    gp_request_path="datasets/gp_request.csv",
    patients_path="datasets/patients.csv",
    comorbidities_path="datasets/comorbidities.csv",
    output_path="generated_datasets/priority_training.csv",
):
    """
    Loads, merges, and engineers features to create a numerical dataset
    with 'priority' as the target variable.
    """

    print("Starting dataset creation process for priority prediction...")

    try:
        gp_request = pd.read_csv(gp_request_path)
        patients = pd.read_csv(patients_path)
        comorbidities = pd.read_csv(comorbidities_path)
        print("All datasets loaded successfully.")
    except FileNotFoundError as e:
        print(f"Error loading files: {e}")
        return None

    # -----------------------------
    # 2. Prepare each dataset (light preprocessing only)
    # -----------------------------
    # Patients — keep only ID, DOB, sex
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

    df = gp_request.merge(patients, on="patient_id", how="left")
    df = df.merge(comorbidity_counts, on="patient_id", how="left")
    df = df.merge(comorb_pivot, on="patient_id", how="left")
    df = df.merge(request_counts, on="patient_id", how="left")

    # -----------------------------
    # 4. Feature engineering (do AFTER merging)
    # -----------------------------
    print("Engineering features...")

    df = engineer_features(df)

    target_col = "priority"
    df.dropna(subset=[target_col, 'age'], inplace=True)

    # Encode target
    df[target_col], labels = pd.factorize(df[target_col])
    label_mapping = {i: label for i, label in enumerate(labels)}
    with open('priority_label_mapping.json', 'w') as f:
        json.dump(label_mapping, f)
    print(f"Target variable '{target_col}' encoded. Mapping saved to priority_label_mapping.json")

    # Keep only numerical and boolean
    training_df = df.select_dtypes(include=(np.number, np.bool))

    training_df.to_csv(output_path, index=False)
    print(f"\n✅ Successfully created and saved the dataset to {output_path}")
    print(f"Final dataset shape: {training_df.shape}")

    return training_df