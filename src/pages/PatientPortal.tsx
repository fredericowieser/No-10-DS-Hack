import React, { useState } from 'react';
import PatientIdentificationForm from '@/components/PatientIdentificationForm';
import EmergencyWarning from '@/components/EmergencyWarning';
import PatientDetailsForm from '@/components/PatientDetailsForm';
import MedicalRequestForm from '@/components/MedicalRequestForm';
import TriageResults from '@/components/TriageResults';
import ThankYouPage from '@/components/ThankYouPage';
import DemoScenarioSelector, { DemoScenario } from '@/components/DemoScenarioSelector';
import { triageApi, TriageAPIError } from '@/services/triageApi';
import { PatientData, MedicalData, TriageResult } from '@/types/triage';

type PatientPortalStep = 'identification' | 'emergency' | 'details' | 'medical' | 'triage' | 'confirmation';

const PatientPortal = () => {
  // Default data (hay fever scenario)
  const defaultPatientData: PatientData = {
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1985-03-15',
    phoneNumber: '07912 345 678',
    sex: 'female',
    contactPreferences: { textMessage: true, phoneCall: false }
  };

  const defaultMedicalData: MedicalData = {
    problem: 'I have been sneezing frequently and have watery eyes. This mainly happens when I\'m outside, especially in the garden or park. I think it might be hay fever.',
    duration: 'This has been going on for about 3 weeks now, since the weather got warmer. It seems to be getting slightly worse on sunny days.',
    treatments: 'I tried taking some basic antihistamines from the supermarket which helped a little bit, but the symptoms come back after a few hours.',
    concerns: 'I\'m worried this might affect my work presentations as I keep sneezing during meetings. Also concerned it might get worse during peak pollen season.',
    helpNeeded: 'I would like advice on better treatment options and whether there are stronger medications that could help control my symptoms.',
    contactTimes: 'Best to contact me after 5 PM on weekdays or any time at weekends.'
  };

  const [currentStep, setCurrentStep] = useState<PatientPortalStep>('identification');
  const [selectedPatient, setSelectedPatient] = useState<'me' | 'someone-else' | null>('me');
  const [patientData, setPatientData] = useState<PatientData | null>(defaultPatientData);
  const [medicalData, setMedicalData] = useState<MedicalData | null>(defaultMedicalData);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isTriaging, setIsTriaging] = useState(false);
  const [triageError, setTriageError] = useState<string | null>(null);
  const [showScenarioSelector, setShowScenarioSelector] = useState(false);

  const handleNext = () => {
    switch (currentStep) {
      case 'identification':
        setCurrentStep('emergency');
        break;
      case 'emergency':
        setCurrentStep('details');
        break;
      case 'details':
        setCurrentStep('medical');
        break;
      case 'medical':
        setCurrentStep('triage');
        break;
      case 'triage':
        setCurrentStep('confirmation');
        break;
    }
  };

  const handleTriagePatient = async () => {
    console.log('Starting triage with:', { patientData, medicalData });
    console.log('Current state:', { isTriaging, triageError, triageResult });

    if (!patientData || !medicalData) {
      console.error('Missing data:', { patientData, medicalData });
      setTriageError('Missing patient or medical data');
      return;
    }

    setIsTriaging(true);
    setTriageError(null);
    setTriageResult(null);

    try {
      const triageRequest = {
        family_id: patientData.firstName + patientData.lastName,
        id: `${patientData.firstName}_${patientData.lastName}_${Date.now()}`,
        issue: `${medicalData.problem}. Duration: ${medicalData.duration}. ${medicalData.treatments ? 'Treatments tried: ' + medicalData.treatments : ''}`,
        contact_preferences: patientData.contactPreferences.textMessage ? 'virtual' : 'face-to-face' as 'face-to-face' | 'virtual',
        date_of_birth: patientData.dateOfBirth,
        sex: patientData.sex,
        history: medicalData.concerns || undefined,
        patient_is_on_cancer_pathway: false,
        total_requests: 1,
        has_cardiovascular_disease: 0,
        has_digestive_disease: 0,
        has_musculoskeletal_disease: 0,
        has_respiratory_disease: 0,
      };

      const result = await triageApi.triagePatient(triageRequest);
      setTriageResult(result);
    } catch (error) {
      if (error instanceof TriageAPIError) {
        setTriageError(error.message);
      } else {
        setTriageError('An unexpected error occurred during triage');
      }
      console.error('Triage error:', error);
    } finally {
      setIsTriaging(false);
    }
  };

  const handleSelectScenario = (scenario: DemoScenario) => {
    // Reset the form to beginning and pre-populate with scenario data
    setCurrentStep('identification');
    setSelectedPatient('me');
    setPatientData(scenario.patientData);
    setMedicalData(scenario.medicalData);
    setTriageResult(null);
    setTriageError(null);
    setShowScenarioSelector(false);

    console.log('Scenario selected:', scenario.name);
    console.log('Patient data set:', scenario.patientData);
    console.log('Medical data set:', scenario.medicalData);
  };

  // Add a quick demo function to skip to triage with current scenario data
  const handleQuickDemo = async () => {
    console.log('Quick demo clicked', { patientData, medicalData });

    if (!patientData || !medicalData) {
      console.error('No demo data available');
      setTriageError('No demo data available. Please select a scenario first.');
      return;
    }

    console.log('Setting current step to triage and triggering triage');
    setCurrentStep('triage');
    // Clear any previous state
    setTriageError(null);
    setTriageResult(null);
    setIsTriaging(false);

    setTimeout(() => {
      console.log('Triggering handleTriagePatient from quick demo');
      handleTriagePatient();
    }, 100);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'emergency':
        setCurrentStep('identification');
        break;
      case 'details':
        setCurrentStep('emergency');
        break;
      case 'medical':
        setCurrentStep('details');
        break;
      case 'triage':
        setCurrentStep('medical');
        break;
      case 'confirmation':
        setCurrentStep('triage');
        break;
    }
  };

  const getCurrentStepNumber = () => {
    switch (currentStep) {
      case 'identification': return 1;
      case 'emergency': return 2;
      case 'details': return 3;
      case 'medical': return 4;
      case 'triage': return 5;
      case 'confirmation': return 5;
      default: return 1;
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Demo Banner */}
      <div className="bg-green-600 text-white py-3 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">
              🎯 <strong>DEMO MODE:</strong> Pre-filled with example data to showcase AI triaging
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleQuickDemo}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-yellow-600 transition-colors"
              >
                ⚡ Quick Demo
              </button>
              <button
                onClick={() => setShowScenarioSelector(true)}
                className="bg-white text-green-600 px-3 py-1 rounded text-sm font-medium hover:bg-green-50 transition-colors"
              >
                Switch Scenario
              </button>
            </div>
          </div>
          <p className="text-xs opacity-90">
            💡 Use <strong>Quick Demo</strong> to skip directly to AI triaging results, or go through the full patient journey step by step
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* NHS Header */}
          <div className="text-center mb-8">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block text-xl font-bold mb-6">
              NHS
            </div>
            
            {/* Progress Steps */}
            <div className="flex justify-center items-center gap-4 mb-8">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= getCurrentStepNumber()
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 5 && <div className="w-8 h-0.5 bg-gray-300 mx-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {currentStep === 'identification' && (
              <PatientIdentificationForm 
                selectedPatient={selectedPatient}
                onPatientSelect={setSelectedPatient}
                onContinue={handleNext}
              />
            )}
            
            {currentStep === 'emergency' && (
              <EmergencyWarning onConfirm={handleNext} onBack={handleBack} />
            )}
            
            {currentStep === 'details' && (
              <PatientDetailsForm
                initialData={patientData}
                onContinue={(data) => {
                  setPatientData(data);
                  handleNext();
                }}
                onBack={handleBack}
              />
            )}

            {currentStep === 'medical' && (
              <MedicalRequestForm
                initialData={medicalData}
                onContinue={(data) => {
                  setMedicalData(data);
                  handleNext();
                  // Trigger triage when entering triage step
                  setTimeout(() => handleTriagePatient(), 100);
                }}
                onBack={handleBack}
              />
            )}

            {currentStep === 'triage' && (
              <>
                {!patientData || !medicalData ? (
                  <div className="p-8 md:p-12 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Missing Data</h2>
                    <p className="text-gray-600 mb-6">Patient or medical data is missing. Please go back and complete the forms.</p>
                    <button
                      onClick={handleBack}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Go Back
                    </button>
                  </div>
                ) : (
                  <>
                    {isTriaging && (
                      <TriageResults
                        triageResult={{} as any}
                        patientData={patientData}
                        medicalData={medicalData}
                        isLoading={true}
                      />
                    )}
                    {!isTriaging && triageError && (
                      <div className="p-8 md:p-12 text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Triage Error</h2>
                        <p className="text-gray-600 mb-6">{triageError}</p>
                        <button
                          onClick={handleTriagePatient}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Try Again
                        </button>
                      </div>
                    )}
                    {!isTriaging && !triageError && triageResult && (
                      <TriageResults
                        triageResult={triageResult}
                        patientData={patientData}
                        medicalData={medicalData}
                        onBack={handleBack}
                        onContinue={handleNext}
                      />
                    )}
                    {!isTriaging && !triageError && !triageResult && (
                      <div className="p-8 md:p-12 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Starting Triage...</h2>
                        <p className="text-gray-600 mb-6">Initializing your medical assessment</p>
                        <button
                          onClick={handleTriagePatient}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Start Triage
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {currentStep === 'confirmation' && (
              <ThankYouPage onBack={() => setCurrentStep('identification')} />
            )}
          </div>
        </div>
      </div>

      {/* Demo Scenario Selector Modal */}
      {showScenarioSelector && (
        <DemoScenarioSelector
          onSelectScenario={handleSelectScenario}
          onClose={() => setShowScenarioSelector(false)}
        />
      )}
    </div>
  );
};

export default PatientPortal;