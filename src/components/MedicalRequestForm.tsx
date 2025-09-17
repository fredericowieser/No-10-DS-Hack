import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, Stethoscope } from 'lucide-react';
import { MedicalData } from '@/types/triage';

interface MedicalRequestFormProps {
  onContinue?: (data: MedicalData) => void;
  onBack?: () => void;
  initialData?: MedicalData;
}

const MedicalRequestForm: React.FC<MedicalRequestFormProps> = ({ onContinue, onBack, initialData }) => {
  const defaultData = {
    problem: 'I have been sneezing frequently and have watery eyes. This mainly happens when I\'m outside, especially in the garden or park. I think it might be hay fever.',
    duration: 'This has been going on for about 3 weeks now, since the weather got warmer. It seems to be getting slightly worse on sunny days.',
    treatments: 'I tried taking some basic antihistamines from the supermarket which helped a little bit, but the symptoms come back after a few hours.',
    concerns: 'I\'m worried this might affect my work presentations as I keep sneezing during meetings. Also concerned it might get worse during peak pollen season.',
    helpNeeded: 'I would like advice on better treatment options and whether there are stronger medications that could help control my symptoms.',
    contactTimes: 'Best to contact me after 5 PM on weekdays or any time at weekends.'
  };

  const data = initialData || defaultData;
  const [formData, setFormData] = useState(data);

  const [characterCounts, setCharacterCounts] = useState({
    problem: 500 - data.problem.length,
    duration: 500 - data.duration.length,
    treatments: 500 - data.treatments.length,
    concerns: 500 - data.concerns.length,
    helpNeeded: 500 - data.helpNeeded.length,
    contactTimes: 500 - data.contactTimes.length
  });

  // Update form fields when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setCharacterCounts({
        problem: 500 - initialData.problem.length,
        duration: 500 - initialData.duration.length,
        treatments: 500 - initialData.treatments.length,
        concerns: 500 - initialData.concerns.length,
        helpNeeded: 500 - initialData.helpNeeded.length,
        contactTimes: 500 - initialData.contactTimes.length
      });
    }
  }, [initialData]);

  const handleTextChange = (field: keyof typeof formData, value: string) => {
    if (value.length <= 500) {
      setFormData(prev => ({ ...prev, [field]: value }));
      setCharacterCounts(prev => ({ ...prev, [field]: 500 - value.length }));
    }
  };

  const isFormValid = formData.problem.trim() && formData.duration.trim() && formData.helpNeeded.trim();

  return (
    <div className="p-8 md:px-12 md:pt-12 md:pb-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Stethoscope className="w-8 h-8 mr-3 text-blue-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Medical request
          </h1>
        </div>
        <p className="text-gray-600 text-sm mb-2">I have a health problem</p>
      </div>

      <div className="space-y-8">
        {/* About the problem */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">About the problem</h3>
          <p className="text-gray-600 text-sm mb-3">Focus on one, for example: I have a pain in my lower back</p>
          <Textarea
            placeholder="Type response here"
            value={formData.problem}
            onChange={(e) => handleTextChange('problem', e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {characterCounts.problem} characters remaining
          </div>
          
          {/* Attach photo button */}
          <Button variant="outline" className="mt-3 text-blue-600 border-blue-200 hover:bg-blue-50">
            <Upload className="w-4 h-4 mr-2" />
            + Attach a photo (optional)
          </Button>
        </div>

        {/* Duration */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            How long has it been going on for? Is it getting better or worse?
          </h3>
          <p className="text-gray-600 text-sm mb-3">For example: It's been going on for over a week</p>
          <Textarea
            placeholder="Type response here"
            value={formData.duration}
            onChange={(e) => handleTextChange('duration', e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {characterCounts.duration} characters remaining
          </div>
        </div>

        {/* Treatments tried */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Have you tried anything to help?</h3>
          <p className="text-gray-600 text-sm mb-3">For example: I've tried physio, which helps a little</p>
          <Textarea
            placeholder="Type response here"
            value={formData.treatments}
            onChange={(e) => handleTextChange('treatments', e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {characterCounts.treatments} characters remaining
          </div>
        </div>

        {/* Concerns */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Is there anything you're particularly worried about? (optional)
          </h3>
          <p className="text-gray-600 text-sm mb-3">For example: I'm worried about it affecting my work</p>
          <Textarea
            placeholder="Type response here"
            value={formData.concerns}
            onChange={(e) => handleTextChange('concerns', e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {characterCounts.concerns} characters remaining
          </div>
        </div>

        {/* How to help */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">How would you like us to help?</h3>
          <p className="text-gray-600 text-sm mb-3">For example: I would like help managing my pain</p>
          <Textarea
            placeholder="Type response here"
            value={formData.helpNeeded}
            onChange={(e) => handleTextChange('helpNeeded', e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {characterCounts.helpNeeded} characters remaining
          </div>
        </div>

        {/* Contact times */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            When are the best times to contact you (optional)
          </h3>
          <p className="text-gray-600 text-sm mb-3">We can't guarantee a time and will only contact you during opening hours</p>
          <Textarea
            placeholder="Type response here"
            value={formData.contactTimes}
            onChange={(e) => handleTextChange('contactTimes', e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {characterCounts.contactTimes} characters remaining
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mt-12 pt-8 border-t border-gray-200">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center space-x-2 px-6 py-3 rounded-xl border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Button>

        <Button
          onClick={() => {
            if (onContinue && isFormValid) {
              const medicalData: MedicalData = {
                problem: formData.problem,
                duration: formData.duration,
                treatments: formData.treatments,
                concerns: formData.concerns,
                helpNeeded: formData.helpNeeded,
                contactTimes: formData.contactTimes,
              };
              onContinue(medicalData);
            }
          }}
          disabled={!isFormValid}
          className={`px-8 py-3 rounded-xl shadow-lg transition-all duration-300 ${
            isFormValid
              ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default MedicalRequestForm;