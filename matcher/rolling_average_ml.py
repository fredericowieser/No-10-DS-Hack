import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

def prepare_weekly_features(gp_requests_df, date_col="date_referral_created", n_lags=4):
    # Ensure date column is datetime
    df = gp_requests_df.copy()
    df[date_col] = pd.to_datetime(df[date_col])
    df['year'] = df[date_col].dt.isocalendar().year
    df['week'] = df[date_col].dt.isocalendar().week

    # Aggregate weekly counts
    weekly = (
        df.groupby(['year', 'week'])
        .size()
        .reset_index(name='referral_count')
        .sort_values(['year', 'week'])
        .reset_index(drop=True)
    )

    # Create lag features
    for lag in range(1, n_lags + 1):
        weekly[f'lag_{lag}'] = weekly['referral_count'].shift(lag)

    # The target is next week's demand
    weekly['target'] = weekly['referral_count'].shift(-1)

    # Drop rows with missing values (due to shifting)
    weekly = weekly.dropna().reset_index(drop=True)
    return weekly

def train_predict_weekly_demand(weekly_df):
    feature_cols = [col for col in weekly_df.columns if col.startswith('lag_')]
    X = weekly_df[feature_cols]
    y = weekly_df['target']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Predict
    y_pred = model.predict(X_test)

    # Evaluate
    rmse = mean_squared_error(y_test, y_pred, squared=False)
    print(f"Test RMSE: {rmse:.2f} referrals")

    # Optionally, predict next week
    next_week_features = weekly_df[feature_cols].iloc[[-1]]
    next_week_pred = model.predict(next_week_features)
    print(f"Predicted demand for next week: {next_week_pred[0]:.1f} referrals")

    return model

# Example usage:
# weekly_df = prepare_weekly_features(gp_requests_df)
# model = train_predict_weekly_demand(weekly_df)