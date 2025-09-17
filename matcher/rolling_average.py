import pandas as pd

def compute_weekly_demand(gp_requests_df, date_col="date_referral_received", window=4):
    """
    Aggregates GP referrals by week and predicts demand using a rolling average.
    
    Args:
        gp_requests_df (pd.DataFrame): Input DataFrame with GP requests.
        date_col (str): Name of the column containing referral dates.
        window (int): Number of weeks for rolling average.
        
    Returns:
        pd.DataFrame: DataFrame with weekly demand and rolling average prediction.
    """
    # Ensure date column is datetime
    df = gp_requests_df.copy()
    df[date_col] = pd.to_datetime(df[date_col])
    
    # Set week and year
    df['year'] = df[date_col].dt.isocalendar().year
    df['week'] = df[date_col].dt.isocalendar().week
    
    # Group by year and week, count referrals
    weekly_counts = (
        df.groupby(['year', 'week'])
        .size()
        .reset_index(name='referral_count')
        .sort_values(['year', 'week'])
        .reset_index(drop=True)
    )
    
    # Compute rolling average demand
    weekly_counts['rolling_avg_demand'] = (
        weekly_counts['referral_count']
        .rolling(window=window, min_periods=1)
        .mean()
    )
    
    # Predict next week's demand (shift rolling average)
    weekly_counts['predicted_next_week_demand'] = weekly_counts['rolling_avg_demand'].shift(-1)
    
    return weekly_counts

# Example usage:
# result_df = compute_weekly_demand(gp_requests_df)
# print(result_df.head())
gp_requests_df = pd.read_csv("datasets/gp_request.csv")
print(compute_weekly_demand(gp_requests_df))