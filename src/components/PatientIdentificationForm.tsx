
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Users } from 'lucide-react';

interface PatientIdentificationFormProps {
  selectedPatient: 'me' | 'someone-else' | null;
  onPatientSelect: (patient: 'me' | 'someone-else') => void;
  onContinue: () => void;
  variant?: 'default' | 'admin';
}

const PatientIdentificationForm: React.FC<PatientIdentificationFormProps> = ({
  selectedPatient,
  onPatientSelect,
  onContinue,
  variant = 'default',
}) => {
  const isAdmin = variant === 'admin';
  const selectedBorderColor = isAdmin ? 'border-purple-500' : 'border-blue-500';
  const selectedBgGradient = isAdmin ? 'bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-gradient-to-br from-blue-50 to-teal-50';
  const iconGradient = isAdmin ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-teal-500';
  const buttonGradient = isAdmin ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600';
  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Who is the patient?
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Please select who you're seeking medical guidance for today.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => onPatientSelect('me')}
          className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
            selectedPatient === 'me'
              ? `${selectedBorderColor} ${selectedBgGradient} shadow-lg`
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div
              className={`p-4 rounded-full transition-all duration-300 ${
                selectedPatient === 'me'
                  ? `${iconGradient} text-white`
                  : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
              }`}
            >
              <User size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Me</h3>
            <p className="text-gray-600 text-center">
              I'm seeking medical guidance for myself
            </p>
          </div>
          {selectedPatient === 'me' && (
            <div className={`absolute top-4 right-4 w-6 h-6 ${iconGradient} rounded-full flex items-center justify-center`}>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </button>

        <button
          onClick={() => onPatientSelect('someone-else')}
          className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
            selectedPatient === 'someone-else'
              ? `${selectedBorderColor} ${selectedBgGradient} shadow-lg`
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div
              className={`p-4 rounded-full transition-all duration-300 ${
                selectedPatient === 'someone-else'
                  ? `${iconGradient} text-white`
                  : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
              }`}
            >
              <Users size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Someone else</h3>
            <p className="text-gray-600 text-center">
              I'm seeking medical guidance for another person
            </p>
          </div>
          {selectedPatient === 'someone-else' && (
            <div className={`absolute top-4 right-4 w-6 h-6 ${iconGradient} rounded-full flex items-center justify-center`}>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </button>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onContinue}
          disabled={!selectedPatient}
          className={`px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 ${
            selectedPatient
              ? `${buttonGradient} text-white shadow-lg hover:shadow-xl`
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PatientIdentificationForm;
