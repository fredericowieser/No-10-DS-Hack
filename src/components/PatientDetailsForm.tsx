
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import { PatientData } from '@/types/triage';

interface PatientDetailsFormProps {
  onContinue: (data: PatientData) => void;
  onBack: () => void;
  variant?: 'default' | 'admin';
  initialData?: PatientData;
}

const PatientDetailsForm: React.FC<PatientDetailsFormProps> = ({ onContinue, onBack, variant = 'default', initialData }) => {
  const isAdmin = variant === 'admin';
  const buttonGradient = isAdmin ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600';
  // Use initialData if provided, otherwise use default values
  const defaultData = {
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1985-03-15',
    phoneNumber: '07912 345 678',
    sex: 'female' as 'female',
    contactPreferences: { textMessage: true, phoneCall: false }
  };

  const data = initialData || defaultData;
  const dobParts = data.dateOfBirth.split('-');

  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [day, setDay] = useState(dobParts[2] || '15');
  const [month, setMonth] = useState(dobParts[1] || '03');
  const [year, setYear] = useState(dobParts[0] || '1985');
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber);
  const [contactPreferences, setContactPreferences] = useState(data.contactPreferences);
  const [sex, setSex] = useState<'male' | 'female'>(data.sex);

  // Update form fields when initialData changes
  useEffect(() => {
    if (initialData) {
      const dobParts = initialData.dateOfBirth.split('-');
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setDay(dobParts[2] || '15');
      setMonth(dobParts[1] || '03');
      setYear(dobParts[0] || '1985');
      setPhoneNumber(initialData.phoneNumber);
      setContactPreferences(initialData.contactPreferences);
      setSex(initialData.sex);
    }
  }, [initialData]);

  const handleContactPreferenceChange = (preference: 'textMessage' | 'phoneCall') => {
    setContactPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    const patientData: PatientData = {
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      contactPreferences,
      sex,
    };

    onContinue(patientData);
  };

  return (
    <div className="p-8 md:p-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Your details</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Provide details so we can identify who this request is for
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Date of birth [DD MM YYYY]</Label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Input
                type="text"
                placeholder="DD"
                value={day}
                onChange={(e) => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
                maxLength={2}
                required
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="MM"
                value={month}
                onChange={(e) => setMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                maxLength={2}
                required
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="YYYY"
                value={year}
                onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone number [Mobile is preferred]</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <Label>Sex</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSex('male')}
              className={`p-3 border rounded-lg text-left ${
                sex === 'male'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setSex('female')}
              className={`p-3 border rounded-lg text-left ${
                sex === 'female'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <Label>How would you prefer to be contacted? [Select all that apply]</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="textMessage"
                checked={contactPreferences.textMessage}
                onCheckedChange={() => handleContactPreferenceChange('textMessage')}
              />
              <Label htmlFor="textMessage" className="text-sm font-normal">Text message</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="phoneCall"
                checked={contactPreferences.phoneCall}
                onCheckedChange={() => handleContactPreferenceChange('phoneCall')}
              />
              <Label htmlFor="phoneCall" className="text-sm font-normal">Phone call</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-8"
          >
            Back
          </Button>
          <Button
            type="submit"
            className={`px-8 ${buttonGradient}`}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientDetailsForm;
