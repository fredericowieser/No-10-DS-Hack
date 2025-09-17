import React, { useState } from 'react';
import PatientIdentificationForm from '@/components/PatientIdentificationForm';
import EmergencyWarning from '@/components/EmergencyWarning';
import PatientDetailsForm from '@/components/PatientDetailsForm';
import MedicalRequestForm from '@/components/MedicalRequestForm';
import ThankYouPage from '@/components/ThankYouPage';

type PatientPortalStep = 'identification' | 'emergency' | 'details' | 'medical' | 'confirmation';

const PatientPortal = () => {
  const [currentStep, setCurrentStep] = useState<PatientPortalStep>('identification');
  const [selectedPatient, setSelectedPatient] = useState<'me' | 'someone-else' | null>(null);

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
        setCurrentStep('confirmation');
        break;
    }
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
      case 'confirmation':
        setCurrentStep('medical');
        break;
    }
  };

  const getCurrentStepNumber = () => {
    switch (currentStep) {
      case 'identification': return 1;
      case 'emergency': return 2;
      case 'details': return 3;
      case 'medical': return 4;
      case 'confirmation': return 4;
      default: return 1;
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* NHS Header */}
          <div className="text-center mb-8">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block text-xl font-bold mb-6">
              NHS
            </div>
            
            {/* Progress Steps */}
            <div className="flex justify-center items-center gap-4 mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= getCurrentStepNumber() 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && <div className="w-8 h-0.5 bg-gray-300 mx-2" />}
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
                onContinue={handleNext} 
                onBack={handleBack}
              />
            )}
            
            {currentStep === 'medical' && (
              <MedicalRequestForm 
                onContinue={handleNext} 
                onBack={handleBack}
              />
            )}
            
            {currentStep === 'confirmation' && (
              <ThankYouPage onBack={() => setCurrentStep('identification')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;