import React, { useEffect } from 'react';
import { MessageCircle, Bot, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIWidgetPlaceholderProps {
  onBack?: () => void;
  onContinue?: () => void;
  variant?: 'default' | 'admin';
}

const AIWidgetPlaceholder: React.FC<AIWidgetPlaceholderProps> = ({ onBack, onContinue, variant = 'default' }) => {
  const isAdmin = variant === 'admin';
  const buttonGradient = isAdmin ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600';
  useEffect(() => {
    // Load the ElevenLabs script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);
    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="p-8 md:px-12 md:pt-12 md:pb-2">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Bot className={`w-8 h-8 mr-3 ${isAdmin ? 'text-purple-500' : 'text-blue-500'}`} />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {isAdmin ? 'Your Admin Request' : 'Medical Request'}
          </h1>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg py-0 my-0">
          {isAdmin ? (
            <>
              You'll now be connected to our AI Triage assistant to help with your admin request such as; Doctor's letter, Flu (sick) note, Referral follow-up, Repeat Prescription, Test Results and more
              <br />
              <br />
              Disclaimer: This AI agent is not permitted to provide any medical advice and patient information
            </>
          ) : (
            <>
              You'll now be connected to our AI Triage assistant to discuss your symptoms
              <br />
              <br />
              Disclaimer: This AI Agent is not permitted to provide any medical advice
            </>
          )}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-8 pt-8">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center space-x-2 px-6 py-3 rounded-xl border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
          <span>Return to previous page</span>
        </Button>

        <Button
          onClick={onContinue}
          className={`px-8 py-3 ${buttonGradient} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          Continue
        </Button>
      </div>
      
      <div className="flex justify-center py-[20px]">
        <elevenlabs-convai agent-id={isAdmin ? "agent_01jzmzt946e1stdcxxpexzakvm" : "agent_01jz7xv66be37v5qkcgy42apjc"}></elevenlabs-convai>
      </div>
    </div>
  );
};

export default AIWidgetPlaceholder;
