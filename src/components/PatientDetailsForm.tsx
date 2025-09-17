
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface PatientDetailsFormProps {
  onContinue: () => void;
  onBack: () => void;
  variant?: 'default' | 'admin';
}

const PatientDetailsForm: React.FC<PatientDetailsFormProps> = ({ onContinue, onBack, variant = 'default' }) => {
  const isAdmin = variant === 'admin';
  const buttonGradient = isAdmin ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactPreferences, setContactPreferences] = useState({
    textMessage: false,
    phoneCall: false
  });

  const handleContactPreferenceChange = (preference: 'textMessage' | 'phoneCall') => {
    setContactPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
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
