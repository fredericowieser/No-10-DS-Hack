
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';

interface EmergencyWarningProps {
  onConfirm: () => void;
  onBack: () => void;
}

const EmergencyWarning: React.FC<EmergencyWarningProps> = ({ onConfirm, onBack }) => {
  const [activeTab, setActiveTab] = useState<'adults' | 'children'>('adults');

  const adultSymptoms = [
    "signs of a heart attack: chest pain, pressure, heaviness, tightness or squeezing across the chest",
    "signs of a stroke: face dropping on one side, cannot hold both arms up, difficulty speaking",
    "sudden confusion (delirium): cannot be sure of own name or age, slurred speech or not making sense",
    "suicide attempt: by taking something or self-harming",
    "severe difficulty breathing: not being able to get words out, breathing very fast, choking or gasping",
    "heavy bleeding: spraying, pouring or enough to make a puddle",
    "severe injuries: after a serious accident",
    "seizure (fit): shaking or jerking because of a fit, or unconscious (can't be woken up)",
    "sudden, rapid swelling: of the lips, mouth, throat or tongue",
    "labour or childbirth: water breaking, more frequent intense cramps (contractions), baby coming, or just born",
    "signs of a severe infection (sepsis): blue, grey, pale or blotchy skin, lips, tongue, palms of soles; a rash that does not fade when you roll a glass over it or high temperature with a stiff neck / bothered by light"
  ];

  const childrenSymptoms = [
    "seizure (fit): shaking or jerking because of a fit, or unconscious (cannot be woken up)",
    "choking: on liquids or solids now",
    "difficulty breathing: making grunting noises, sucking their stomach in under their ribcage or breathing very fast",
    "unable to stay awake: being sleepier than normal or difficult to wake, cannot keep their eyes open for more than a few seconds",
    "blue, grey, pale or blotchy skin, tongue or lips: on brown or black skin, grey or blue palms or soles of the feet",
    "limp and floppy: their head falls to the side, backwards or forwards",
    "heavy bleeding: spraying, pouring or enough to make a puddle",
    "severe injuries: after a serious accident or assault",
    "signs of a stroke: face dropping on one side, cannot hold both arms up, difficulty speaking",
    "sudden, rapid swelling: of the lips, mouth, throat or tongue",
    "sudden confusion: agitation, odd behaviour or non-stop crying",
    "signs of a severe infection (sepsis): a rash that does not fade when you roll a glass over it; a weak or high-pitched cry that's not like their normal cry; not responding like they normally do; not interested in feeding or normal activities; or high temperature with a stiff neck / bothered by light"
  ];

  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-red-500 mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-red-600">
            Confirm this is not an emergency
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Please review the emergency symptoms below and confirm that none are present before continuing.
        </p>
      </div>

      {/* Segmented Control */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
          <button
            onClick={() => setActiveTab('adults')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'adults'
                ? 'bg-white text-gray-800 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Adults
          </button>
          <button
            onClick={() => setActiveTab('children')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'children'
                ? 'bg-white text-gray-800 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Children
          </button>
        </div>
      </div>

      {/* Emergency Content */}
      <div className="bg-red-50 rounded-2xl p-6 md:p-8 mb-8 border border-red-100">
        <h2 className="text-xl font-bold text-red-700 mb-4">
          Call 999 now if {activeTab === 'adults' ? 'you or someone' : 'your child'} has any of these:
        </h2>
        
        <ul className="space-y-3 mb-6">
          {(activeTab === 'adults' ? adultSymptoms : childrenSymptoms).map((symptom, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 leading-relaxed">{symptom}</span>
            </li>
          ))}
        </ul>

        <div className="bg-white rounded-lg p-4 border border-red-200">
          <p className="text-sm text-gray-600 mb-2">
            <strong>British Sign Language (BSL)</strong> speakers can make a BSL video call to 999.
          </p>
          <p className="text-sm text-gray-600">
            <strong>Deaf, hard of hearing or speech-impaired</strong> people can use 18000 to contact 999 using text relay or a textphone.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center space-x-2 px-6 py-3 rounded-xl border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
          <span>Return to previous page</span>
        </Button>

        <Button
          onClick={onConfirm}
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <CheckCircle size={20} />
          <span>I confirm, none are present</span>
        </Button>
      </div>
    </div>
  );
};

export default EmergencyWarning;
