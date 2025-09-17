import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCheck, Stethoscope, Pill, Clock, AlertTriangle, CheckCircle, MapPin, ExternalLink, Users, Star, Calendar, Phone } from 'lucide-react';
import { TriageResult, PatientData, MedicalData, ProviderMatch, MatchingFactor } from '@/types/triage';

interface TriageResultsProps {
  triageResult: TriageResult;
  patientData: PatientData;
  medicalData: MedicalData;
  onBack?: () => void;
  onContinue?: () => void;
  isLoading?: boolean;
}

const TriageResults: React.FC<TriageResultsProps> = ({
  triageResult,
  patientData,
  medicalData,
  onBack,
  onContinue,
  isLoading = false
}) => {
  const getProviderIcon = () => {
    if (!triageResult?.recommended_provider) return null;
    switch (triageResult.recommended_provider) {
      case 'pharmacist':
        return <Pill className="w-8 h-8" />;
      case 'nurse':
        return <UserCheck className="w-8 h-8" />;
      case 'GP':
        return <Stethoscope className="w-8 h-8" />;
    }
  };

  const getProviderColor = () => {
    if (!triageResult?.recommended_provider) return 'text-gray-600 bg-gray-100 border-gray-200';
    switch (triageResult.recommended_provider) {
      case 'pharmacist':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'nurse':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'GP':
        return 'text-purple-600 bg-purple-100 border-purple-200';
    }
  };

  const getUrgencyInfo = () => {
    if (!triageResult.urgency_info) return null;

    const { urgency } = triageResult.urgency_info;

    switch (urgency) {
      case 0:
        return {
          label: 'Routine',
          description: 'Appointment within 30 days',
          icon: <Clock className="w-5 h-5" />,
          color: 'text-green-600 bg-green-50 border-green-200'
        };
      case 1:
        return {
          label: 'Priority',
          description: 'Appointment within 2 weeks',
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'text-orange-600 bg-orange-50 border-orange-200'
        };
      case 2:
        return {
          label: 'Urgent',
          description: 'Urgent appointment needed',
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'text-red-600 bg-red-50 border-red-200'
        };
    }
  };

  const urgencyInfo = getUrgencyInfo();

  if (isLoading) {
    return (
      <div className="p-8 md:p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your Request</h2>
          <p className="text-gray-600">Please wait while we determine the best care for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 mr-3 text-green-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Care Recommendation
          </h1>
        </div>
        <p className="text-gray-600">Based on your symptoms, here's our recommended care path</p>
      </div>

      {/* Main Recommendation Card */}
      <div className={`max-w-2xl mx-auto mb-8 p-6 rounded-2xl border-2 ${getProviderColor()}`}>
        <div className="flex items-center justify-center mb-4">
          <div className={`p-4 rounded-full ${getProviderColor()}`}>
            {getProviderIcon()}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 capitalize">
          {triageResult?.recommended_provider || 'Loading...'}
        </h2>

        <p className="text-center text-gray-700 mb-4">
          {triageResult?.message || 'Analyzing your medical condition...'}
        </p>

        {urgencyInfo && (
          <div className={`flex items-center justify-center p-3 rounded-lg border ${urgencyInfo.color}`}>
            {urgencyInfo.icon}
            <span className="ml-2 font-semibold">{urgencyInfo.label}</span>
            <span className="ml-2 text-sm">({urgencyInfo.description})</span>
          </div>
        )}
      </div>

      {/* Pharmacy Recommendations - Only show for pharmacist */}
      {triageResult?.recommended_provider === 'pharmacist' && (
        <div className="max-w-2xl mx-auto mb-8 p-6 bg-green-50 rounded-2xl border border-green-200">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-green-800">Nearby Pharmacies</h3>
          </div>
          <p className="text-sm text-green-700 mb-4">Here are some local pharmacies where you can get help:</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
              <div>
                <h4 className="font-medium text-gray-800">Boots Pharmacy</h4>
                <p className="text-sm text-gray-600">High Street, City Centre • Open until 8pm</p>
              </div>
              <a
                href="https://www.google.com/maps/place/Boots+Pharmacy/@51.5074,-0.1278,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
              >
                <MapPin className="w-4 h-4 mr-1" />
                View Map
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
              <div>
                <h4 className="font-medium text-gray-800">Superdrug Pharmacy</h4>
                <p className="text-sm text-gray-600">Shopping Centre, Main Road • Open until 7pm</p>
              </div>
              <a
                href="https://www.google.com/maps/place/Superdrug+Pharmacy/@51.5074,-0.1278,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
              >
                <MapPin className="w-4 h-4 mr-1" />
                View Map
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
              <div>
                <h4 className="font-medium text-gray-800">Patel's Pharmacy</h4>
                <p className="text-sm text-gray-600">Church Lane, Local Area • Open until 6:30pm</p>
              </div>
              <a
                href="https://www.google.com/maps/place/Patels+Pharmacy/@51.5074,-0.1278,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
              >
                <MapPin className="w-4 h-4 mr-1" />
                View Map
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

          <p className="text-xs text-green-600 mt-3">
            💡 No appointment needed - walk-in service available at all locations
          </p>
        </div>
      )}

      {/* Provider Matching Section */}
      {triageResult?.provider_matches && triageResult.provider_matches.length > 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center mb-6">
            <Users className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">Recommended Providers Based on Your Preferences</h3>
          </div>

          <div className="grid gap-4">
            {triageResult.provider_matches.map((match, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                {/* Provider Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 ${
                      match.provider_type === 'pharmacist' ? 'bg-green-100 text-green-600' :
                      match.provider_type === 'nurse' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {match.provider_type === 'pharmacist' ? <Pill className="w-6 h-6" /> :
                       match.provider_type === 'nurse' ? <UserCheck className="w-6 h-6" /> :
                       <Stethoscope className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{match.provider_name}</h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{match.availability}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-semibold text-gray-700">{match.overall_match_score}/8 Match</span>
                  </div>
                </div>

                {/* Contact Method & Appointment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 text-gray-500 mr-2" />
                    <span><strong>Contact:</strong> {match.contact_method}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span><strong>Next available:</strong> {match.appointment_time}</span>
                  </div>
                </div>

                {/* Matching Factors */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">Why This Provider Is Recommended:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {match.matching_factors.map((factor, factorIndex) => (
                      <div key={factorIndex} className="flex items-start">
                        <div className="flex items-center mr-3">
                          {/* Score visualization */}
                          <div className="flex items-center">
                            {[...Array(factor.max_score)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full mr-1 ${
                                  i < factor.score ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700">{factor.factor}</div>
                          <div className="text-xs text-gray-600">{factor.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Book Appointment Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {index === 0 ? '✨ Best match for your preferences' : 'Alternative option'}
                    </div>
                    <Button
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        index === 0
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {match.provider_type === 'pharmacist' ? 'Visit Pharmacy' : 'Book Appointment'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Matching Logic Explanation */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h6 className="text-sm font-semibold text-blue-800 mb-2">How We Match You with Providers:</h6>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• <strong>Contact Preference:</strong> We prioritize providers who offer your preferred consultation method</p>
              <p>• <strong>Availability:</strong> Faster availability for urgent cases, convenient scheduling for routine care</p>
              <p>• <strong>Specialty Match:</strong> Providers with relevant expertise for your specific condition</p>
              <p>• <strong>Continuity:</strong> Providers you've seen before or from your registered practice</p>
            </div>
          </div>
        </div>
      )}

      {/* Patient Summary */}
      <div className="max-w-2xl mx-auto mb-8 p-6 bg-gray-50 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Summary</h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-gray-600">Patient:</span>
            <span className="ml-2">{patientData.firstName} {patientData.lastName} {triageResult?.patient_age && `(Age: ${triageResult.patient_age})`}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Problem:</span>
            <span className="ml-2">{medicalData.problem}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Duration:</span>
            <span className="ml-2">{medicalData.duration}</span>
          </div>
          {medicalData.treatments && (
            <div>
              <span className="font-medium text-gray-600">Treatments tried:</span>
              <span className="ml-2">{medicalData.treatments}</span>
            </div>
          )}
        </div>
      </div>

      {/* Keywords if available */}
      {triageResult.urgency_info?.keywords && triageResult.urgency_info.keywords.length > 0 && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Key Factors Considered:</h4>
          <div className="flex flex-wrap gap-2">
            {triageResult.urgency_info.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="max-w-2xl mx-auto mb-8 p-6 border border-gray-200 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">What happens next?</h3>
        <div className="space-y-2 text-sm text-gray-700">
          {triageResult.recommended_provider === 'pharmacist' && (
            <>
              <p>• Visit your local pharmacy for assessment and treatment</p>
              <p>• Your pharmacist can provide advice and over-the-counter medications</p>
              <p>• No appointment needed - walk-in service available</p>
            </>
          )}
          {triageResult.recommended_provider === 'nurse' && (
            <>
              <p>• A practice nurse will contact you to arrange an appointment</p>
              <p>• They can provide specialized nursing care and treatments</p>
              <p>• You'll be contacted using your preferred method</p>
            </>
          )}
          {triageResult.recommended_provider === 'GP' && (
            <>
              <p>• A GP will review your request and contact you</p>
              <p>• An appointment will be scheduled based on urgency</p>
              <p>• You'll receive confirmation via your preferred contact method</p>
            </>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 pt-8 border-t border-gray-200">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center space-x-2 px-6 py-3 rounded-xl border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
          <span>Back to Form</span>
        </Button>

        <Button
          onClick={onContinue}
          className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          Confirm Request
        </Button>
      </div>
    </div>
  );
};

export default TriageResults;