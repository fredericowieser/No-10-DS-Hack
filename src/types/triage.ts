export interface PatientTriageRequest {
  family_id: string;
  id: string;
  issue: string;
  contact_preferences: 'face-to-face' | 'virtual' | null;
  date_of_birth: string; // YYYY-MM-DD format
  sex: 'male' | 'female';
  history?: string;
  patient_is_on_cancer_pathway?: boolean;
  total_requests?: number;
  has_cardiovascular_disease?: number;
  has_digestive_disease?: number;
  has_musculoskeletal_disease?: number;
  has_respiratory_disease?: number;
}

export interface UrgencyInfo {
  urgency: 0 | 1 | 2; // 0=routine (30 days), 1=2 weeks, 2=urgent
  keywords: string[];
  relevant_patient_history?: any[];
}

export interface MatchingFactor {
  factor: string;
  score: number;
  max_score: number;
  description: string;
}

export interface ProviderMatch {
  provider_name: string;
  provider_type: 'pharmacist' | 'nurse' | 'GP';
  availability: string;
  contact_method: string;
  matching_factors: MatchingFactor[];
  overall_match_score: number;
  appointment_time: string;
}

export interface TriageResult {
  recommended_provider: 'pharmacist' | 'nurse' | 'GP';
  urgency_info?: UrgencyInfo;
  patient_age: number;
  message: string;
  provider_matches?: ProviderMatch[];
}

export interface PatientData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  contactPreferences: {
    textMessage: boolean;
    phoneCall: boolean;
  };
  sex: 'male' | 'female';
}

export interface MedicalData {
  problem: string;
  duration: string;
  treatments: string;
  concerns: string;
  helpNeeded: string;
  contactTimes: string;
}