import pandas as pd
import numpy as np
import xgboost as xgb
import matplotlib.pyplot as plt
import seaborn as sns
import json
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

def train_and_evaluate_priority_model(
    dataset_path="enhanced_numerical_dataset_for_priority.csv",
    label_mapping_path="priority_label_mapping.json",
    model_output_path="priority_triage_model.joblib"
):
    """
    Trains, evaluates, and saves an XGBoost classifier to predict request priority.

    Args:
        dataset_path (str): Path to the engineered numerical dataset.
        label_mapping_path (str): Path to the JSON file with priority label mappings.
        model_output_path (str): Path to save the trained model.
    """
    print("🚀 Starting model training process for priority prediction...")

    # --- 1. Load Data ---
    try:
        df = pd.read_csv(dataset_path)
        with open(label_mapping_path, 'r') as f:
            label_mapping = json.load(f)
        label_mapping = {int(k): v for k, v in label_mapping.items()}
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
    class_names = [label_mapping[i] for i in sorted(label_mapping.keys())]

    print(f"\n📊 Overall Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("\n📋 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=class_names))

    print("📈 Generating Confusion Matrix for priority...")
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
    plt.title('Confusion Matrix for Priority Prediction')
    plt.ylabel('Actual Priority')
    plt.xlabel('Predicted Priority')
    plt.tight_layout()
    plt.savefig('priority_confusion_matrix.png')
    print("Saved confusion matrix to priority_confusion_matrix.png")

    # --- 5. Feature Importance ---
    print("\n📈 Generating Feature Importance Plot...")
    feature_importances = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False).head(20)

    plt.figure(figsize=(12, 8))
    sns.barplot(x='importance', y='feature', data=feature_importances)
    plt.title('Top 20 Feature Importances for Priority Prediction')
    plt.tight_layout()
    plt.savefig('priority_feature_importance.png')
    print("Saved feature importance plot to priority_feature_importance.png")

    # --- 6. Save the Trained Model ---
    print(f"\n💾 Saving trained model to {model_output_path}...")
    joblib.dump(model, model_output_path)
    print(f"✅ Model successfully saved.")
    
    print("\n🎉 Process complete!")


if __name__ == "__main__":
    train_and_evaluate_priority_model()