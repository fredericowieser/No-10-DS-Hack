import { PatientTriageRequest, TriageResult } from '@/types/triage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class TriageAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'TriageAPIError';
  }
}

export const triageApi = {
  async triagePatient(patientData: PatientTriageRequest): Promise<TriageResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/triage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new TriageAPIError(
          errorData.detail || `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      if (error instanceof TriageAPIError) {
        throw error;
      }
      throw new TriageAPIError(`Failed to connect to triage service: ${error}`);
    }
  },

  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new TriageAPIError(`Health check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new TriageAPIError(`Health check failed: ${error}`);
    }
  },
};