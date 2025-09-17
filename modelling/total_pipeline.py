import pandas as pd
from datetime import datetime

from patient import Patient
from priority_prepare import engineer_features, create_enhanced_numerical_dataset_for_priority
from priority_run import train_and_evaluate_priority_model

from professional_prepare import create_dataset_for_professional_type
from professional_run import train_and_evaluate_professional_type_model

patients: list[Patient] = [
    Patient(
        family_id="1",
        id="1", # TODO: change to fixed one from Carmel
        issue="sneezing in summer",
        contact_preferences=None,
        date_of_birth=datetime(2000, 12, 17),
        sex="female",
    ),
    Patient(
        family_id="2",
        id="2",
        issue="urgent hypertension",
        contact_preferences="face-to-face",
        date_of_birth=datetime(1980, 1, 1),
        sex="male",
    ),
]

patient_columns = [
    "sex",
    "date_of_birth",
    "date_referral_received",
    "new_referral_notes",
    "has_cardiovascular_disease",
    "has_digestive_disease",
    "has_musculoskeletal_disease",
    "has_respiratory_disease",
    "comorbidity_count",
    "total_requests",
    "patient_is_on_cancer_pathway",
]


def run_whole_pipeline():
    # remaining_patients = [patient for patient in patients if not route_patient(patient)]
    remaining_patients = patients

    create_enhanced_numerical_dataset_for_priority()
    create_dataset_for_professional_type()

    df = pd.DataFrame.from_records([patient.model_dump() for patient in remaining_patients])
    df["date_referral_received"] = datetime.today()
    df["new_referral_notes"] = df["issue"]

    comorb_cols = [c for c in df.columns if c.startswith("has_")]
    df["comorbidity_count"] = df[comorb_cols].sum(axis=1)

    df = df[patient_columns]

    df_prio = engineer_features(df)
    model_prio = train_and_evaluate_priority_model()
    priorities = model_prio.predict(df_prio)

    df_prof = engineer_features(df)
    model_prof = train_and_evaluate_professional_type_model()
    caregivers = model_prof.predict(df_prof)

    print(priorities, caregivers)
    # match_all(patients, priorities, caregivers)

run_whole_pipeline()


