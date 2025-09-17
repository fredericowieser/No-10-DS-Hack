import React from 'react';
import { Button } from '@/components/ui/button';
import { Pill, UserCheck, Stethoscope } from 'lucide-react';

export interface DemoScenario {
  name: string;
  patientData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    sex: 'male' | 'female';
    contactPreferences: {
      textMessage: boolean;
      phoneCall: boolean;
    };
  };
  medicalData: {
    problem: string;
    duration: string;
    treatments: string;
    concerns: string;
    helpNeeded: string;
    contactTimes: string;
  };
  expectedProvider: 'pharmacist' | 'nurse' | 'GP';
  description: string;
}

interface DemoScenarioSelectorProps {
  onSelectScenario: (scenario: DemoScenario) => void;
  onClose: () => void;
}

const scenarios: DemoScenario[] = [
  {
    name: "Hay Fever Case",
    description: "Seasonal allergies - should route to pharmacist",
    expectedProvider: "pharmacist",
    patientData: {
      firstName: "Sarah",
      lastName: "Johnson",
      dateOfBirth: "1985-03-15",
      phoneNumber: "07912 345 678",
      sex: "female",
      contactPreferences: { textMessage: true, phoneCall: false }
    },
    medicalData: {
      problem: "I have been sneezing frequently and have watery eyes. This mainly happens when I'm outside, especially in the garden or park. I think it might be hay fever.",
      duration: "This has been going on for about 3 weeks now, since the weather got warmer. It seems to be getting slightly worse on sunny days.",
      treatments: "I tried taking some basic antihistamines from the supermarket which helped a little bit, but the symptoms come back after a few hours.",
      concerns: "I'm worried this might affect my work presentations as I keep sneezing during meetings. Also concerned it might get worse during peak pollen season.",
      helpNeeded: "I would like advice on better treatment options and whether there are stronger medications that could help control my symptoms.",
      contactTimes: "Best to contact me after 5 PM on weekdays or any time at weekends."
    }
  },
  {
    name: "Routine Blood Test",
    description: "Diabetes monitoring - should route to nurse",
    expectedProvider: "nurse",
    patientData: {
      firstName: "Michael",
      lastName: "Thompson",
      dateOfBirth: "1960-03-20",
      phoneNumber: "07923 456 789",
      sex: "male",
      contactPreferences: { textMessage: false, phoneCall: true }
    },
    medicalData: {
      problem: "I need my routine blood test for diabetes monitoring. I was diagnosed with Type 2 diabetes last year and have been managing it with diet and medication.",
      duration: "My last blood test was 3 months ago and the doctor said I should have regular tests every 3 months to monitor my glucose levels.",
      treatments: "I'm currently taking Metformin 500mg twice daily and following a diabetic diet. My glucose levels have been stable recently.",
      concerns: "I want to make sure my diabetes is still well controlled and that my current medication is still appropriate.",
      helpNeeded: "I need a blood test to check my HbA1c levels and general health markers. I also want to discuss my recent readings with a healthcare professional.",
      contactTimes: "I'm retired so any time during normal working hours is fine for me."
    }
  },
  {
    name: "Urgent Chest Pain",
    description: "Serious symptoms - should route to GP urgently",
    expectedProvider: "GP",
    patientData: {
      firstName: "Emma",
      lastName: "Williams",
      dateOfBirth: "1975-08-10",
      phoneNumber: "07934 567 890",
      sex: "female",
      contactPreferences: { textMessage: true, phoneCall: true }
    },
    medicalData: {
      problem: "I have been experiencing severe chest pain and difficulty breathing. The pain is sharp and gets worse when I take deep breaths or move around.",
      duration: "This started suddenly this morning about 2 hours ago. The pain has been constant and seems to be getting worse.",
      treatments: "I tried resting and taking some paracetamol but it hasn't helped at all. The breathing difficulty is making me very anxious.",
      concerns: "I'm very worried this could be something serious like a heart attack. I have a family history of heart disease and I'm quite scared.",
      helpNeeded: "I need urgent medical attention to find out what's causing this chest pain and breathing difficulty. I need to be seen as soon as possible.",
      contactTimes: "Please contact me immediately - this is urgent and I'm available at any time."
    }
  }
];

const DemoScenarioSelector: React.FC<DemoScenarioSelectorProps> = ({ onSelectScenario, onClose }) => {
  const getIcon = (provider: string) => {
    switch (provider) {
      case 'pharmacist':
        return <Pill className="w-6 h-6" />;
      case 'nurse':
        return <UserCheck className="w-6 h-6" />;
      case 'GP':
        return <Stethoscope className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getColor = (provider: string) => {
    switch (provider) {
      case 'pharmacist':
        return 'border-green-500 text-green-700 bg-green-50';
      case 'nurse':
        return 'border-blue-500 text-blue-700 bg-blue-50';
      case 'GP':
        return 'border-purple-500 text-purple-700 bg-purple-50';
      default:
        return 'border-gray-500 text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Choose a Demo Scenario</h2>
            <Button onClick={onClose} variant="outline" size="sm">
              ✕ Close
            </Button>
          </div>
          <p className="text-gray-600 mt-2">
            Select a pre-built patient scenario to see how our AI triaging system works
          </p>
        </div>

        <div className="p-6 space-y-4">
          {scenarios.map((scenario, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 cursor-pointer hover:shadow-lg transition-all duration-200 ${getColor(scenario.expectedProvider)}`}
              onClick={() => onSelectScenario(scenario)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getIcon(scenario.expectedProvider)}
                  <div>
                    <h3 className="text-lg font-semibold">{scenario.name}</h3>
                    <p className="text-sm opacity-80">{scenario.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium capitalize">→ {scenario.expectedProvider}</div>
                  <div className="text-xs opacity-70">Expected Route</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-current opacity-20">
                <div className="text-sm">
                  <strong>Patient:</strong> {scenario.patientData.firstName} {scenario.patientData.lastName}
                </div>
                <div className="text-sm mt-1">
                  <strong>Issue:</strong> {scenario.medicalData.problem.substring(0, 100)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoScenarioSelector;