from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal, Tuple, Optional
from datetime import datetime
import sys
import os

# Add the current directory to the Python path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from modelling.patient import Patient

# Use mock routing for demonstration without requiring API keys
from pharmacy_route.mock_route import mock_route_patient as route_patient
USE_REAL_ROUTING = False

app = FastAPI(title="Medical Triaging API", version="1.0.0")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"],  # Vite and common dev ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientRequest(BaseModel):
    """Request model for patient data from frontend"""
    family_id: str = Field(description="Family identifier")
    id: str = Field(description="Patient identifier")
    issue: str = Field(description="Patient's medical issue/concern")
    contact_preferences: Literal["face-to-face", "virtual"] | None = None
    date_of_birth: str = Field(description="Date of birth in YYYY-MM-DD format")
    sex: Literal["male", "female"]
    history: str | None = Field(default=None, description="Patient's medical history")
    patient_is_on_cancer_pathway: bool = False
    total_requests: int = 1
    has_cardiovascular_disease: int = 0
    has_digestive_disease: int = 0
    has_musculoskeletal_disease: int = 0
    has_respiratory_disease: int = 0

class UrgencyInfo(BaseModel):
    """Model for urgency information"""
    urgency: Literal[0, 1, 2]
    keywords: list[str]
    relevant_patient_history: Optional[list] = None

class MatchingFactor(BaseModel):
    """Model for matching factors"""
    factor: str
    score: int
    max_score: int
    description: str

class ProviderMatch(BaseModel):
    """Model for provider matching information"""
    provider_name: str
    provider_type: Literal["pharmacist", "nurse", "GP"]
    availability: str
    contact_method: str
    matching_factors: list[MatchingFactor]
    overall_match_score: int
    appointment_time: str

class TriageResult(BaseModel):
    """Response model for triage results"""
    recommended_provider: Literal["pharmacist", "nurse", "GP"]
    urgency_info: Optional[UrgencyInfo] = None
    patient_age: int
    message: str
    provider_matches: Optional[list[ProviderMatch]] = None

def generate_provider_matches(patient_data: PatientRequest, recommended_provider: str, urgency_level: int = 0) -> list[ProviderMatch]:
    """Generate realistic provider matches based on patient preferences and provider availability"""

    # Get patient preferences
    preferred_contact = patient_data.contact_preferences or "face-to-face"

    # Generate different matches based on provider type
    if recommended_provider == "pharmacist":
        return [
            ProviderMatch(
                provider_name="Boots Pharmacy (High Street)",
                provider_type="pharmacist",
                availability="Walk-in available",
                contact_method="face-to-face",
                matching_factors=[
                    MatchingFactor(factor="Contact Preference", score=2 if preferred_contact == "face-to-face" else 1, max_score=2, description=f"Patient prefers {preferred_contact}, pharmacy offers face-to-face"),
                    MatchingFactor(factor="Availability", score=2, max_score=2, description="Immediate walk-in availability"),
                    MatchingFactor(factor="Specialty Match", score=2, max_score=2, description="Pharmacy service perfect for this condition"),
                    MatchingFactor(factor="Location", score=2, max_score=2, description="Convenient city centre location")
                ],
                overall_match_score=8,
                appointment_time="Available now - walk-in"
            ),
            ProviderMatch(
                provider_name="Superdrug Pharmacy (Shopping Centre)",
                provider_type="pharmacist",
                availability="Walk-in available",
                contact_method="face-to-face",
                matching_factors=[
                    MatchingFactor(factor="Contact Preference", score=2 if preferred_contact == "face-to-face" else 1, max_score=2, description=f"Patient prefers {preferred_contact}, pharmacy offers face-to-face"),
                    MatchingFactor(factor="Availability", score=2, max_score=2, description="Walk-in availability until 7pm"),
                    MatchingFactor(factor="Specialty Match", score=2, max_score=2, description="Pharmacy service suitable for this condition"),
                    MatchingFactor(factor="Location", score=1, max_score=2, description="Shopping centre location")
                ],
                overall_match_score=7,
                appointment_time="Available now - walk-in"
            ),
            ProviderMatch(
                provider_name="Patel's Pharmacy (Local)",
                provider_type="pharmacist",
                availability="Walk-in available",
                contact_method="face-to-face",
                matching_factors=[
                    MatchingFactor(factor="Contact Preference", score=2 if preferred_contact == "face-to-face" else 1, max_score=2, description=f"Patient prefers {preferred_contact}, pharmacy offers face-to-face"),
                    MatchingFactor(factor="Availability", score=2, max_score=2, description="Walk-in availability until 6:30pm"),
                    MatchingFactor(factor="Specialty Match", score=2, max_score=2, description="Local pharmacist with expertise"),
                    MatchingFactor(factor="Location", score=2, max_score=2, description="Local community pharmacy")
                ],
                overall_match_score=8,
                appointment_time="Available now - walk-in"
            )
        ]

    elif recommended_provider == "nurse":
        urgency_text = "within 2 weeks" if urgency_level == 1 else "within 30 days"
        return [
            ProviderMatch(
                provider_name="Practice Nurse Sarah Williams",
                provider_type="nurse",
                availability=f"Next available: Tomorrow 2:30 PM",
                contact_method=preferred_contact,
                matching_factors=[
                    MatchingFactor(factor="Contact Preference", score=2, max_score=2, description=f"Nurse offers {preferred_contact} appointments as preferred"),
                    MatchingFactor(factor="Availability", score=2, max_score=2, description=f"Can accommodate urgent appointment {urgency_text}"),
                    MatchingFactor(factor="Specialty Match", score=2, max_score=2, description="Specialist in routine monitoring and care"),
                    MatchingFactor(factor="Continuity", score=1, max_score=2, description="New patient to this nurse")
                ],
                overall_match_score=7,
                appointment_time="Tomorrow 2:30 PM"
            ),
            ProviderMatch(
                provider_name="Practice Nurse Michael Thompson",
                provider_type="nurse",
                availability=f"Next available: Thursday 10:00 AM",
                contact_method=preferred_contact,
                matching_factors=[
                    MatchingFactor(factor="Contact Preference", score=2, max_score=2, description=f"Nurse offers {preferred_contact} appointments as preferred"),
                    MatchingFactor(factor="Availability", score=1, max_score=2, description=f"Available {urgency_text}"),
                    MatchingFactor(factor="Specialty Match", score=2, max_score=2, description="Experienced in diabetes and chronic condition management"),
                    MatchingFactor(factor="Continuity", score=1, max_score=2, description="New patient to this nurse")
                ],
                overall_match_score=6,
                appointment_time="Thursday 10:00 AM"
            )
        ]

    else:  # GP
        urgency_appointments = {
            0: ("Next Monday 9:15 AM", "Routine appointment within 30 days"),
            1: ("Tomorrow 4:30 PM", "Priority appointment within 2 weeks"),
            2: ("Today 5:45 PM", "Urgent same-day appointment")
        }

        next_appt, urgency_desc = urgency_appointments.get(urgency_level, urgency_appointments[0])

        return [
            ProviderMatch(
                provider_name="Dr. Emma Richards",
                provider_type="GP",
                availability=f"Next available: {next_appt}",
                contact_method=preferred_contact,
                matching_factors=[
                    MatchingFactor(factor="Contact Preference", score=2, max_score=2, description=f"GP offers {preferred_contact} consultations as preferred"),
                    MatchingFactor(factor="Availability", score=2 if urgency_level >= 1 else 1, max_score=2, description=urgency_desc),
                    MatchingFactor(factor="Specialty Match", score=2, max_score=2, description="General practitioner suitable for this condition"),
                    MatchingFactor(factor="Continuity", score=1, max_score=2, description="Your registered GP practice")
                ],
                overall_match_score=7 if urgency_level >= 1 else 6,
                appointment_time=next_appt
            ),
            ProviderMatch(
                provider_name="Dr. James Mitchell",
                provider_type="GP",
                availability="Next available: Tuesday 11:30 AM",
                contact_method=preferred_contact,
                matching_factors=[
                    MatchingFactor(factor="Contact Preference", score=2, max_score=2, description=f"GP offers {preferred_contact} consultations as preferred"),
                    MatchingFactor(factor="Availability", score=1, max_score=2, description="Available within timeframe"),
                    MatchingFactor(factor="Specialty Match", score=1, max_score=2, description="General practitioner"),
                    MatchingFactor(factor="Continuity", score=1, max_score=2, description="Practice GP, but not your usual doctor")
                ],
                overall_match_score=5,
                appointment_time="Tuesday 11:30 AM"
            )
        ]

    return []

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Medical Triaging API is running", "status": "healthy"}

@app.post("/triage", response_model=TriageResult)
async def triage_patient(patient_data: PatientRequest):
    """
    Triage a patient and return recommendation for care provider
    """
    try:
        # Convert date string to datetime object
        date_of_birth = datetime.strptime(patient_data.date_of_birth, "%Y-%m-%d")

        # Create Patient object
        patient = Patient(
            family_id=patient_data.family_id,
            id=patient_data.id,
            issue=patient_data.issue,
            contact_preferences=patient_data.contact_preferences,
            date_of_birth=date_of_birth,
            sex=patient_data.sex,
            history=patient_data.history,
            patient_is_on_cancer_pathway=patient_data.patient_is_on_cancer_pathway,
            total_requests=patient_data.total_requests,
            has_cardiovascular_disease=patient_data.has_cardiovascular_disease,
            has_digestive_disease=patient_data.has_digestive_disease,
            has_musculoskeletal_disease=patient_data.has_musculoskeletal_disease,
            has_respiratory_disease=patient_data.has_respiratory_disease,
        )

        # Route the patient using the existing function
        result = route_patient(patient)

        # Parse the result - it returns a tuple like ("pharmacist", None) or ("GP", urgency_info)
        if isinstance(result, tuple) and len(result) == 2:
            recommended_provider, urgency_info = result
        else:
            # Handle case where only provider is returned
            recommended_provider = result
            urgency_info = None

        # Convert urgency info to our model if it exists
        urgency_data = None
        if urgency_info:
            urgency_data = UrgencyInfo(
                urgency=urgency_info.urgency,
                keywords=urgency_info.keywords,
                relevant_patient_history=urgency_info.relevant_patient_history
            )

        # Generate appropriate message
        if recommended_provider == "pharmacist":
            message = f"Patient can be treated by a pharmacist for their condition: {patient_data.issue}"
        elif recommended_provider == "nurse":
            message = f"Patient should see a nurse for their condition: {patient_data.issue}"
        else:  # GP
            urgency_text = ""
            if urgency_data:
                if urgency_data.urgency == 0:
                    urgency_text = " (routine appointment within 30 days)"
                elif urgency_data.urgency == 1:
                    urgency_text = " (appointment within 2 weeks)"
                elif urgency_data.urgency == 2:
                    urgency_text = " (urgent appointment needed)"
            message = f"Patient should see a GP for their condition: {patient_data.issue}{urgency_text}"

        # Generate provider matches based on recommendations and patient preferences
        urgency_level = urgency_data.urgency if urgency_data else 0
        provider_matches = generate_provider_matches(patient_data, recommended_provider, urgency_level)

        return TriageResult(
            recommended_provider=recommended_provider,
            urgency_info=urgency_data,
            patient_age=patient.age,
            message=message,
            provider_matches=provider_matches
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing patient data: {str(e)}")

@app.get("/health")
async def health_check():
    """Extended health check with system info"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Medical Triaging API"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)