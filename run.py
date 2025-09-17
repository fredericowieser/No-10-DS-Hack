import pandas as pd
import numpy as np
from anthropic import Anthropic
from datetime import datetime

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.pipeline import Pipeline


gp_request = pd.read_csv("datasets/gp_request.csv")
comorbidities = pd.read_csv("datasets/comorbidities.csv")
patients = pd.read_csv("datasets/patients.csv")

ROWS_LIMIT = 10

def process_patient_data():
    patients["date_of_birth"] = pd.to_datetime(patients["date_of_birth"])

    today = pd.to_datetime("today")
    patients["age"] = (today.year - patients["date_of_birth"].dt.year) - (
        (today.month, today.day) < (patients["date_of_birth"].dt.month, patients["date_of_birth"].dt.day)
    )


def generate_comorbidity_column() -> pd.DataFrame:
    # Create a one-hot table of comorbidities per patient
    comorb_pivot = (comorbidities
                    .assign(value=1)
                    .pivot_table(index="patient_id",
                                 columns="Condition_Category",
                                 values="value",
                                 fill_value=0)
                    .add_prefix("has_")
                    .reset_index())
    
    df = gp_request.merge(comorb_pivot, on="patient_id", how="left")
    df = df.merge(patients, right_on="person_id", left_on="patient_id", how="left")
    
    df.fillna(0, inplace=True)
    
    return df


def generate_llm_columns() -> pd.DataFrame:
    combined_table = generate_comorbidity_column()
    
    combined_table = combined_table[:ROWS_LIMIT]

    return combined_table


# process_patient_data()
df = generate_llm_columns()

request_columns = ["patient_is_on_cancer_pathway", "rtt_pathway_status"]
morbidities_columns = [f"has_{comorbidity}" for comorbidity in comorbidities["Condition_Category"].unique()]
patient_columns = ["sex"] #, "age"]

feature_columns =  request_columns + morbidities_columns + patient_columns
outcome = "priority" # Routine, Urgent 2WW, Urgent

# Replace with your actual columns
X = df[feature_columns]  # Features
y = df[outcome]                  # Labels

numeric_features = []
categorical_features = feature_columns

numeric_transformer = StandardScaler()
categorical_transformer = OneHotEncoder(handle_unknown="ignore")

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, numeric_features),
        ("cat", categorical_transformer, categorical_features)
    ]
)

pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(max_iter=1000))
])

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,       # 20% for testing
    random_state=42,     # for reproducibility
)

pipeline.fit(X_train, y_train)

y_pred = pipeline.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))



