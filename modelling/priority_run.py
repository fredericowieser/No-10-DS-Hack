import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split

def train_and_evaluate_priority_model(
    dataset_path="generated_datasets/priority_training.csv",
):
    """
    Trains, evaluates, and saves an XGBoost classifier to predict request priority.

    Args:
        dataset_path (str): Path to the engineered numerical dataset.
    """
    print("🚀 Starting model training process for priority prediction...")

    # --- 1. Load Data ---
    try:
        df = pd.read_csv(dataset_path)
        print("✅ Data loaded successfully.")
    except FileNotFoundError as e:
        print(f"❌ Error: {e}. Please ensure the necessary files are in the directory.")
        return

    # --- 2. Prepare Data for Modeling ---
    target_col = 'priority' # The new target variable
    if target_col not in df.columns:
        print(f"❌ Error: Target column '{target_col}' not found in the dataset.")
        return
        
    X = df.drop(columns=[target_col])
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Split data into {len(X_train)} training samples and {len(X_test)} testing samples.")

    # --- 3. Train XGBoost Model ---
    print("\nTraining XGBoost Classifier for priority...")
    model = xgb.XGBClassifier(
        objective='multi:softmax',
        num_class=len(y.unique()),
        use_label_encoder=False,
        eval_metric='mlogloss',
        n_estimators=200,
        learning_rate=0.1,
        max_depth=5,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    print("✅ Model training complete.")

    # --- 4. Evaluate the Model ---
    print("\nEvaluating model performance...")
    y_pred = model.predict(X_test)

    return model

def predict(model: xgb.XGBClassifier, covariates: pd.DataFrame):
    y_pred = model.predict(covariates)
    return y_pred
