from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field
from dataclasses import dataclass

@dataclass
class PrimaryCareGroup:
    doctor_id: str
    nurse_id: str

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