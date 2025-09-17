from typing import Literal, Tuple, Optional
import sys
import os

# Add parent directory to path to import Patient
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from modelling.patient import Patient


class MockUrgencyOutput:
    def __init__(self, urgency: Literal[0, 1, 2], keywords: list[str]):
        self.urgency = urgency
        self.keywords = keywords
        self.relevant_patient_history = None


def mock_route_patient(patient: Patient) -> Tuple[Literal["pharmacist", "nurse", "GP"], Optional[MockUrgencyOutput]]:
    """
    Mock version of route_patient for testing without requiring API keys
    """
    issue = patient.issue.lower() if patient.issue else ""

    # Simple keyword-based routing for demonstration
    pharmacy_keywords = ["hay fever", "sneezing", "allergies", "cold", "headache", "sore throat"]
    nurse_keywords = ["vaccine", "vaccination", "blood test", "blood pressure", "diabetes", "routine"]
    urgent_keywords = ["chest pain", "difficulty breathing", "severe", "urgent", "emergency", "blood"]

    # Check for pharmacy conditions
    if any(keyword in issue for keyword in pharmacy_keywords):
        return "pharmacist", None

    # Check for nurse conditions
    if any(keyword in issue for keyword in nurse_keywords):
        urgency = MockUrgencyOutput(0, ["routine care"])
        return "nurse", urgency

    # Check for urgent conditions
    if any(keyword in issue for keyword in urgent_keywords):
        urgency = MockUrgencyOutput(2, ["urgent", "severe symptoms"])
        return "GP", urgency

    # Default to GP with routine priority
    urgency = MockUrgencyOutput(0, ["general consultation"])
    return "GP", urgency