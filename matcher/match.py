from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime, timedelta
from dataclasses import dataclass
from pydantic_ai import Agent

class Timeslot(BaseModel):
    free: bool 
    time: datetime

class Appt(BaseModel):
    patient_id: str

class Caregiver(BaseModel):
    id: str
    contact_type: Literal["face-to-face", "virtual"] | None = Field(
        default=None,
        description="Doctor's contact type. None indicates both are available.",
    )
    timetable: list[Timeslot] # this must be ordered, maybe use a min heap
    patient_ids: set[str] = set()
    specialisms: str | None = None
    families: set[str] = set()
    completed_appts: list[Appt] = []

    def attempt_match(self, latest_date: datetime) -> Timeslot | None:
        for timeslot in self.timetable:
            if timeslot.time > latest_date:
                return None
        
            if timeslot.free:
                timeslot.free = False
                return timeslot
            
        return None

@dataclass
class PrimaryCareGroup:
    doctor_id: str
    nurse_id: str

columns = [
    "date_of_birth",
    "date_referral_received",
    "new_referral_notes",
    "has_cardiovascular_disease",
    "has_digestive_disease",
    "has_muscoskeletal_disease",
    "has_respiratory_disease",
    "comorbidity_count",
    "total_requests",
    "patient_is_on_cancer_pathway",
]

ALL_COMORBIDITIES = [
    'cardiovascular_disease',
    'digestive_disease',
    'musculoskeletal_disease',
    'respiratory_disease',
]

class Patient(BaseModel):
    family_id: str
    id: str # make this map to the pharmacy dataset
    contact_preferences: Literal["face-to-face", "virtual"] | None = Field(
        default=None,
        description="Patient's contact preference. None indicates no preference.",
    )
    primary_care_group: PrimaryCareGroup | None = None
    request: str
    date_of_birth: datetime
    patient_is_on_cancer_pathway: bool = False
    total_requests: int = 1
    has_cardiovascular_disease: int = 0
    has_digestive_disease: int = 0
    has_musculoskeletal_disease: int = 0
    has_respiratory_disease: int = 0
    issue: str | None = None
    sex: Literal["male", "female"]

    @property
    def comorbidities(self) -> list[str]:
        return [comorbidity for comorbidity in ALL_COMORBIDITIES if getattr(self, f"has_{comorbidity}")]

class GPPractice(BaseModel):
    id: str
    doctors: dict[str, Caregiver]
    nurses: dict[str, Caregiver]
    patients: set[str]

class Urgency(BaseModel):
    max_wait_days: int = Field(
        description="Max number of days the patient may wait for an appointment.",
    )
    required_caregiver: Literal["doctor", "nurse"] = Field(
        description="The kind of professional required for the appointment.",
    )
    urgency_level: int = Field(
        description="Level of urgency. Higher means more urgent.",
    )

routine = Urgency(max_wait_days=30, urgency_level=0)
urgent_2ww = Urgency(max_wait_days=14, urgency_level=1)
urgent = Urgency(max_wait_days=2, urgency_level=2)

def match(patient: Patient, gp_practice: GPPractice, required_caregiver: Literal["doctor", "nurse"], max_days_to_appt: int) -> Timeslot:
    # max_days_to_appt denotes the number of days we have to schedule the appointment
    # we also could factor in analytics about the GP practice

    final_date = datetime.today() + timedelta(days=max_days_to_appt)

    if not patient.id in gp_practice.patients:
        patient = sign_patient_up(patient, gp_practice)

    def get_professional_and_remaining() -> tuple[Caregiver, list[Caregiver]]:
        if required_caregiver == "doctor":
            main = gp_practice.doctors[patient.primary_care_group.doctor_id]
            others = [v for k, v in gp_practice.doctors.items() if k != patient.primary_care_group.doctor_id]
            return main, others
        else:
            main = gp_practice.nurses[patient.primary_care_group.nurse_id]
            others = [v for k, v in gp_practice.nurses.items() if k != patient.primary_care_group.nurse_id]
            return main, others

    main, others = get_professional_and_remaining()
    if timeslot := main.attempt_match(final_date):
        return timeslot
    
    others = rank_professionals(patient, others)
    for other in others:
        if timeslot := other.attempt_match(final_date):
            return timeslot
        
    raise ValueError("Could not book you in.")
    
def sign_patient_up(patient: Patient, gp_practice: GPPractice) -> Patient:
    # order potential professionals by 
    gp_practice.patients.add(patient.id)

    doctors = rank_professionals(patient=patient, issue=None, professionals=gp_practice.doctors)
    nurses = rank_professionals(patient=patient, issue=None, professionals=gp_practice.nurses)

    patient.primary_care_group = PrimaryCareGroup(
        doctors[0].id,
        nurses[0].id,
    )

    return patient

class PatientContext(BaseModel):
    patient_issue: str | None = Field(
        description="Optional, the issue the patient currently has and would like to book an appointment for right now.",
    )
    patient_history: list[str] | None = Field(
        description="A summary of the patient's history.",
    )
    caregiver_specialty: str = Field(
        description="A summary of the caregiver's specialty.",
    )

def assign_affinity_score(patient_issue: str | None, patient_history: str, caregiver_specialty: str) -> int:
    if not patient_issue and not patient_history and not caregiver_specialty:
        return 1
    
    agent = Agent(
        model="claude-3-haiku-20240307",
        instructions="You are a medical assistant. Give a score from 1-5 of how well the patient and caregiver are matched based on the patient's history, current issue, and caregiver's specialty. 1 means average.",
        output_type=int,
    )

    result = agent.run_sync(
        PatientContext(patient_issue=patient_issue, patient_history=patient_history, caregiver_specialty=caregiver_specialty)
    )

    return result.output

def assign_preference_score(patient: Patient, professional: Caregiver) -> int:
    if not patient.contact_preferences or not professional.contact_type:
        return 1
    
    match = patient.contact_preferences == professional.contact_type
    return 1 if match else 0

def assign_family_score(patient: Patient, professional: Caregiver) -> int:
    return 1 if patient.family_id in professional.families else 0

def assign_continuity_score(patient: Patient, professional: Caregiver) -> int:
    return sum(1 for appt in professional.completed_appts if appt.patient_id == patient.id)
    
def rank_professionals(patient: Patient, professionals: list[Caregiver]) -> list[Caregiver]:
    family_score = {professional.id: assign_family_score(patient, professional) for professional in professionals}
    affinity_score = {professional.id: assign_affinity_score(patient.issue, patient.comorbidities, professional.specialisms) for professional in professionals}
    preference_score = {professional.id: assign_preference_score(patient, professional) for professional in professionals}
    prev_visits_score = {professional.id: assign_continuity_score(patient, professional) for professional in professionals}

    return sorted(professionals, key=lambda professional: (family_score[professional.id], prev_visits_score[professional.id], preference_score[professional.id], affinity_score[professional.id]), reverse=True)

def reorder_patients(patients: list[Patient], urgencies: list[Urgency]) -> list[Patient]:
    sorted_pairs = sorted(
        zip(patients, urgencies),
        key=lambda pair: pair[1].urgency_level,
        reverse=True,
    )
    return [p for p, _ in sorted_pairs]

urgency_mappings = {
    0: routine,
    1: urgent_2ww,
    2: urgent,
}

caregiver_mappings = {
    0: "doctor",
    1: "nurse",
}

# This will be run with some interval every day
def match_all(patients: list[Patient], gp_practice: GPPractice, urgencies: list[int], required_caregivers: list[int]):
    # rank it by urgency and then match all in that order
    reordered_patients = reorder_patients(patients, urgencies)
    for patient, urgency, caregiver in zip(reordered_patients, urgencies, required_caregivers):
        required_caregiver = caregiver_mappings[caregiver]
        urgency = urgency_mappings[urgency]
        match(patient, gp_practice, required_caregiver, urgency.max_wait_days)