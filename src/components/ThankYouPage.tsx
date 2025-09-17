import React from 'react';
import { CheckCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface ThankYouPageProps {
  onBack?: () => void;
}
const ThankYouPage: React.FC<ThankYouPageProps> = ({
  onBack
}) => {
  return <div className="p-8 md:p-12 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Thank you for your submission!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">We have received your admin request and our team will review it shortly. You can expect to hear from us within the next 24-48 hours with next steps.</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">What happens next?</h2>
          <div className="space-y-3 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
              <p className="text-gray-700">Our clinical team will review your information and symptoms</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
              <p className="text-gray-700">We'll contact you via your preferred method to discuss next steps</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
              <p className="text-gray-700">If needed, we'll schedule an appointment or provide further guidance</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <p className="text-gray-600 mb-4">
            If you have any urgent concerns, please contact us immediately:
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <Phone className="w-4 h-4" />
              <span className="font-medium">(0207 123 4567</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <Mail className="w-4 h-4" />
              <span className="font-medium">support@elevenlabshealth.com</span>
            </div>
          </div>
        </div>

        {onBack && <div className="mt-8 pt-6 border-t">
            <Button onClick={onBack} variant="outline" className="px-8 py-3">
              Return to Portal
            </Button>
          </div>}
      </div>
    </div>;
};
export default ThankYouPage;