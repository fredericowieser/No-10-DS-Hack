import pandas as pd
from pydantic_ai import Agent
from pydantic import BaseModel, Field

df = pd.read_csv("datasets/gp_request.csv")

def assign_professional(appointment_type):
    if pd.isna(appointment_type):
        return None
    if 'GP' in str(appointment_type):
        return 'GP'
    if 'Nurse' in str(appointment_type):
        return 'Nurse'
    return None

df['care_professional_type'] = df['requested_appointment_type'].apply(assign_professional)
df = df[["new_referral_notes", "care_professional_type"]]

df_nurse = df[df["care_professional_type"] == "Nurse"]
df_gp = df[df["care_professional_type"] == "GP"]

professional_type = "GP"

my_dict = {
    "GP": df_gp,
    "Nurse": df_nurse,
}

class Keywords(BaseModel):
    gp_keywords: list[str] = Field(
        description="Keywords we can use for identifying GP records.",
    )
    nurse_keywords: list[str] = Field(
        description="Keywords we can use for identifying nurse records.",
    )

agent = Agent(
    model="claude-3-5-haiku-20241022",
    system_prompt=f"You are given medical records. Identify keywords that are in common with many of the entries that might be used in a classification task for each kind of professional. Make sure the keywords do not overlap.",
    output_type=Keywords,
)

result = agent.run_sync(
    str(df[:1000].to_dict(orient="records")),
)

print(result.output)