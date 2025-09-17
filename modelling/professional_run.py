import pandas as pd
import xgboost as xgb
import json
from sklearn.model_selection import train_test_split

def train_and_evaluate_professional_type_model(
    dataset_path="datasets/professional_training.csv",
):
    """
    Trains, evaluates, and saves an XGBoost classifier to predict GP vs. Nurse.

    Args:
        dataset_path (str): Path to the engineered numerical dataset.
        label_mapping_path (str): Path to the JSON file with label mappings.
        model_output_path (str): Path to save the trained model.
    """
    print("🚀 Starting model training process for GP vs. Nurse prediction...")

    # --- 1. Load Data ---
    try:
        df = pd.read_csv(dataset_path)
        print("✅ Data loaded successfully.")
    except FileNotFoundError as e:
        print(f"❌ Error: {e}. Please ensure the necessary files are in the directory.")
        return

    # --- 2. Prepare Data for Modeling ---
    target_col = 'care_professional_type'
    if target_col not in df.columns:
        print(f"❌ Error: Target column '{target_col}' not found in the dataset.")
        return
        
    X = df.drop(columns=[target_col])
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Split data into {len(X_train)} training samples and {len(X_test)} testing samples.")

    # --- 3. Train XGBoost Model for Binary Classification ---
    print("\nTraining XGBoost Classifier...")
    model = xgb.XGBClassifier(
        objective='binary:logistic', # Objective for binary classification
        use_label_encoder=False,
        eval_metric='logloss',       # Evaluation metric for binary classification
        n_estimators=200,
        learning_rate=0.1,
        max_depth=5,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    print("✅ Model training complete.")

    y_pred = model.predict(X_test)

    return model