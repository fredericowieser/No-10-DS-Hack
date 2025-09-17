from pydantic_ai import Agent

from pydantic import BaseModel, Field, ConfigDict
import pandas as pd
from typing import Callable, Literal
from functools import partial
from datetime import datetime
from cancer_symptom_context import CANCER_SYMPTOMS_CONTEXT
from patient import Patient

def get_nearest_pharmacies(patient_id: str):
    df = pd.read_csv("datasets/patients_nearest_pharmacies.csv")
    try:
        df = df[(df["person_id"] == patient_id) & (df["fclass"] == "pharmacy")]
        print(f"Your nearest pharmacy is {df.iloc[0]['name']}")
    except Exception as e:
        pass

class PharmacyCondition(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    condition: str = Field(
        description="The name of the condition"
    )

    requirement_matcher: Callable[[pd.DataFrame], bool] | None = Field(
        default=None,
        description="A callable to match."
    )

class NurseCondition(BaseModel):
    condition: str = Field(
        description="The name of the condition",
    )

def matcher(min_age: int, max_age: int | None, sexes_allowed: Literal["male", "female", "both"], input_df: pd.DataFrame):
    age = input_df["age"]
    sex = input_df["sex"]

    if age < min_age or (max_age and age > max_age):
        return False

    if not sexes_allowed == "both":
        return sex == sexes_allowed

impetigo = PharmacyCondition(
    condition="impetigo",
    requirement_matcher=partial(matcher, min_age=1, max_age=None, sexes_allowed="both"),
)

infected_insect_bites = PharmacyCondition(
    condition="infected insect bites",
    requirement_matcher=partial(matcher, min_age=1, max_age=None, sexes_allowed="both"),
)

earache = PharmacyCondition(
    condition="earache",
    requirement_matcher=partial(matcher, min_age=1, max_age=17, sexes_allowed="both"),
)

sore_throat = PharmacyCondition(
    condition="sore throat",
    requirement_matcher=partial(matcher, min_age=5, max_age=None, sexes_allowed="both"),
)

sinusitis = PharmacyCondition(
    condition="sinusitis",
    requirement_matcher=partial(matcher, min_age=12, max_age=None, sexes_allowed="both"),
)

urinary_tract_infections = PharmacyCondition(
    condition="urinary tract infection",
    requirement_matcher=partial(matcher, min_age=15, max_age=64, sexes_allowed="female"),
)

shingles = PharmacyCondition(
    condition="shingles",
    requirement_matcher=partial(matcher, min_age=18, max_age=None, sexes_allowed="both"),
)

long_term_condition_management = NurseCondition(
    condition="Chronic condition care for asthma, diabetes, COPD",
)

vaccinations = NurseCondition(
    condition="Immunisations, including flu and travel vaccinations",
)

screenings = NurseCondition(
    condition="Cervical screening (smear tests) and health checks",
)

minor_injuries = NurseCondition(
    condition="Dressing wounds, removing stitches, minor injuries",
)

blood_tests = NurseCondition(
    condition="Taking blood samples (phlebotomy), performing electrocardiograms (ECGs) and taking other lab samples",
)

routine = NurseCondition(
    condition="A routine appointment for an existing condition such as hypertension or diabetes that has showed no worsening.",
)

other_free_conditions = [
    "hay fever",
    # "coughs, colds, and nasal congestion",
    # "diarrhoea and constipation",
    # "minor cuts, scrapes, and burns",
    # "indigestion and heartburn",
    # "skin conditions like mild eczema, athlete's foot, acne, and nappy rash",
    # "head lice, warts, and verrucas",
    # "conjunctivitis and dry or sore eyes",
    # "mouth ulcers and cold sores",
    # "sprains, strains and minor pain",
]

class PharmacyConditionOutput(BaseModel):
    condition: Literal["impetigo", "infected insect bites", "earache", "sore throat", "sinusitis", "urinary tract infection", "shingles", "hay fever", "None"] | None = Field(
        "The condition the patient has that matches one of the predefined PHARMACY-SUITABLE CONDITIONS, or None if the symptoms given is not pharmacy-appropriate and require further investigation, or if you are unsure. We should err on the side of caution here."
    )


all_pharmacy_conditions = [impetigo, infected_insect_bites, earache, sore_throat, sinusitis, urinary_tract_infections, shingles] + [PharmacyCondition(condition=x) for x in other_free_conditions]
pharmacy_conditions_dict = {condition.condition: condition for condition in all_pharmacy_conditions}

all_nurse_conditions = [long_term_condition_management, vaccinations, screenings, minor_injuries, blood_tests, routine]
nurse_conditions_dict = {condition.condition: condition for condition in all_nurse_conditions}

class NurseConditionOutput(BaseModel):
    condition: str | None = Field(
        description=f"One of {', '.join(condition.condition for condition in all_nurse_conditions)} if the treatment applies to the issue, else return None"
    )


INPUT_DATA = {
    "free_text": "sneezing during summer",
    "patient_info": {
        "age": 20,
        "sex": "female",
    },
    "patient_id": "oT8E8MACMMNXTRj0",
}

gp_request = pd.read_csv("./datasets/gp_request.csv")
patient = pd.read_csv("./datasets/patients.csv")

all = gp_request.merge(patient, left_on="patient_id", right_on="person_id")

ALL_REQUESTS = all[["sex", "new_referral_notes"]].to_dict(orient="records")

def run_pharmacy_agent(patient: Patient):
    agent = Agent(
        model="claude-3-haiku-20240307",
        system_prompt="You are a medical assistant to determine whether the given symptoms from a patient may be solved by a pharmacist. If you determine no treatment suffices, return None.",
        output_type=PharmacyConditionOutput,
    )

    result = agent.run_sync(
        patient.issue,
    )

    can_use_pharmacist = False
    output_condition = None

    if result.output.condition:
        if condition := pharmacy_conditions_dict.get(result.output.condition):
            output_condition = condition.condition
            # if not condition.requirement_matcher or condition.requirement_matcher(input_df=INPUT_DATA["patient_info"]):
            if not condition.requirement_matcher or condition.requirement_matcher(input_df={"age": patient.age, "sex": patient.sex}):
                can_use_pharmacist = True

    if can_use_pharmacist:
        print(f"You are able to visit a pharmacist for {output_condition}, loading nearest pharmacies...")
        get_nearest_pharmacies(INPUT_DATA["patient_id"])

    return "pharmacist" if can_use_pharmacist else None

def run_nurse_agent(patient: Patient):
    agent = Agent(
        model="claude-3-haiku-20240307",
        system_prompt=f"You are a medical assistant to determine whether the given symptoms and details from a patient may be solved by a nurse. You can choose from: {', '.join(condition.condition for condition in all_nurse_conditions)}. If any indications of worsening conditions are shown in the issue or patient history, you MUST return None. If you determine no treatment suffices, return None.",
        output_type=NurseConditionOutput,
    )

    result = agent.run_sync(
        {
            "history": patient.history,
            "issue": patient.issue,
            "age": patient.age,
            "sex": patient.sex,
            "existing_conditions": patient.comorbidities,
        }
    )

    can_use_nurse = False
    output_condition = None

    if result.output.condition and result.output.condition != "None":
        can_use_nurse = True

    if can_use_nurse:
        print(f"You are able to visit a nurse for {output_condition}")

    return "nurse" if can_use_nurse else None    

class PatientHistory(BaseModel):
    time_of_record: datetime | None = Field(
        default=None,
        description="The datetime corresponding to when the entry was made, if relevant.",
    )
    record_information: str = Field(
        description="Information about what the patient went through, and was potentially diagnosed with, and current medication.",
    )

class UrgencyOutput(BaseModel):
    urgency: Literal[0, 1, 2] = Field(
        description="A level of urgency. 0 maps to 'routine', where the patient is seen within 30 days. 1 maps to when the patient is seen within two weeks." \
        "2 maps to when the patient must be seen urgently.",
    )
    keywords: list[str] = Field(
        description="A list of relevant keywords (such as symptoms) used to inform your decision for the urgency of the case.",
    )
    relevant_patient_history: list[PatientHistory] | None = Field(
        default=None,
        description="A list of any relevant medical history entries that you find that inform your decision.",
    )

class ProfessionalOutput(BaseModel):
    professional: Literal["GP", "nurse"] = Field(
        description="Whether the GP should be seen by "
    )
    keywords: list[str] = Field(
        description="A list of relevant keywords (such as symptoms) used to inform your decision for the urgency of the case.",
    )
    relevant_patient_history: list[PatientHistory] | None = Field(
        default=None,
        description="A list of any relevant medical history entries that you find that inform your decision.",
    )

def run_urgency_agent(patient: Patient) -> UrgencyOutput:
    all_context = "\n".join([f"{k}: {v}" for k, v in urgency_mapping.items()]) + "\n" + CANCER_SYMPTOMS_CONTEXT + "\n"

    agent = Agent(
        model="claude-3-haiku-20240307",
        system_prompt=all_context + "You are a medical assistant trying to determine the level of urgency for a GP appointment request. Urgency should be extremely high if the issue given relates to existing health conditions and has worsened recently.",
        output_type=UrgencyOutput,
    )

    result = agent.run_sync(f"""

        history: {patient.history}
        issue: {patient.issue}
        sex: {patient.sex}
        health_profile: {patient.comorbidities}
        """
    )

    return result.output

# def run_bloods_agent(patient: Patient):
#     agent = Agent(
#         model="claude-3-haiku-20240307",
#         system_prompt="You are a medical professional. Detect whether the symptoms could be side-effects of anaemia.",
#         output_type=bool,
#     )

#     result = agent.run_sync(
#         patient.issue
#     )

#     return result.output

urgency_mapping = {
    "routine": "Routine appointment. This could be for existing conditions such as diabetes, asthma, heart disease, that have shown no sign of progression and worsening.",
    "urgent2WW": "Urgent, but a max wait of 2 weeks. This is actually typically for suspected cancer, so things like a lump might be indicative.",
    "urgent": "Urgent. Highest level of urgency. ",
}

def route_patient(patient) -> Literal["pharmacist", "nurse", "GP"]:
    if run_pharmacy_agent(patient):
        return "pharmacist", None
    
    # if run_bloods_agent(patient):
    #     return "nurse", None
    
    urgency = run_urgency_agent(patient)

    if run_nurse_agent(patient):
        return "nurse", urgency
    
    return "GP", urgency

if __name__ == "__main__":
    patients: list[Patient] = [
        Patient(
            family_id="1",
            id="1", # TODO: change to fixed one from Carmel
            issue="sneezing in summer",
            contact_preferences=None,
            date_of_birth=datetime(2000, 12, 17),
            sex="female",
            age=24,
        ),
        Patient(
            family_id="2",
            id="2",
            issue="High blood has worsened in last 10 days, running into shortness of breath.",
            contact_preferences="face-to-face",
            date_of_birth=datetime(1980, 1, 1),
            sex="male",
            history="Heart disease",
            has_cardiovascular_disease=1,
            age=45,
        ),
        Patient(
            family_id="3",
            id="3",
            issue="Need a flu vaccine.",
            contact_preferences="face-to-face",
            date_of_birth=datetime(1980, 1, 1),
            sex="male",
            age=18,
        ),
    ]

    for patient in patients:
        print(route_patient(patient))

# if __name__ == "__main__":
#     agent = Agent(
#         model="claude-3-haiku-20240307",
#         system_prompt="You are a medical assistant to determine whether the given symptoms from a patient may be solved by a pharmacist. If you determine no treatment suffices, return None.",
#         output_type=PharmacyConditionOutput,
#     )

#     total = len(ALL_REQUESTS)
#     could_use_pharmacist = 0
#     for request in ALL_REQUESTS:
#         # result = agent.run_sync(
#         #     INPUT_DATA["free_text"]
#         # )
#         result = agent.run_sync(
#             request["new_referral_notes"],
#         )

#         can_use_pharmacist = False
#         output_condition = None

#         if result.output.condition:
#             if condition := pharmacy_conditions_dict.get(result.output.condition):
#                 output_condition = condition.condition
#                 # if not condition.requirement_matcher or condition.requirement_matcher(input_df=INPUT_DATA["patient_info"]):
#                 if not condition.requirement_matcher or condition.requirement_matcher(input_df={"age": 20, "sex": request["sex"]}):
#                     can_use_pharmacist = True

#         if can_use_pharmacist:
#             could_use_pharmacist += 1
#             print(f"You are able to visit a pharmacist for {output_condition}, loading nearest pharmacies...")
#             get_nearest_pharmacies(INPUT_DATA["patient_id"])
    
#     print(could_use_pharmacist / total)