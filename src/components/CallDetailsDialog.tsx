import React, { useState } from 'react';
import { Phone, User, Calendar, Clock, Edit3, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CallLog } from '@/types/call-log';
import { getPriorityIcon, getStatusIcon, getStatusBadge } from '@/utils/call-log-utils';

interface CallDetailsDialogProps {
  call: CallLog | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (callId: string, status: 'completed' | 'dropped' | 'pending') => void;
  onUpdateUrgency: (callId: string, urgency: 'high' | 'medium' | 'low') => void;
}

export const CallDetailsDialog: React.FC<CallDetailsDialogProps> = ({
  call,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateUrgency
}) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingUrgency, setIsEditingUrgency] = useState(false);
  const [isTranscriptCollapsed, setIsTranscriptCollapsed] = useState(true);

  const handleUpdateStatus = (callId: string, newStatus: 'completed' | 'dropped' | 'pending') => {
    onUpdateStatus(callId, newStatus);
    setIsEditingStatus(false);
  };

  const handleUpdateUrgency = (callId: string, newUrgency: 'high' | 'medium' | 'low') => {
    onUpdateUrgency(callId, newUrgency);
    setIsEditingUrgency(false);
  };

  if (!call) return null;

  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Call Details - {call.patientName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Call Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{call.patientName}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  Date of Birth: {call.dateOfBirth}
                </div>
                
                <div className="text-sm text-gray-600">
                  Caller: 1
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Call Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{call.timestamp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{call.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(call.status)}
                  {getStatusBadge(call.status)}
                  {!isEditingStatus ? <Button variant="ghost" size="sm" onClick={() => setIsEditingStatus(true)} className="ml-2 h-6 px-2">
                      <Edit3 className="h-3 w-3" />
                    </Button> : <Select value={call.status} onValueChange={(value: 'completed' | 'dropped' | 'pending') => handleUpdateStatus(call.id, value)}>
                      <SelectTrigger className="ml-2 h-6 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Completed
                          </div>
                        </SelectItem>
                        <SelectItem value="dropped">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                            Dropped
                          </div>
                        </SelectItem>
                        <SelectItem value="pending">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            Pending
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Urgency Assessment</h4>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(call.priority || 'high')}
                    <span className="text-sm font-medium capitalize">{call.priority || 'High'} Urgency</span>
                    {!isEditingUrgency ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditingUrgency(true)} 
                        className="ml-2 h-6 px-2"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    ) : (
                      <Select 
                        value={call.priority || 'high'} 
                        onValueChange={(value: 'high' | 'medium' | 'low') => handleUpdateUrgency(call.id, value)}
                      >
                        <SelectTrigger className="ml-2 h-6 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Assessment Reasoning</h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  Based on the reported symptoms and call context, this case has been flagged as high urgency due to potential emergency indicators requiring immediate medical attention.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Optimal Care Pathway</h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  Recommended immediate escalation to emergency services. Patient should be advised to call 999 or attend A&E immediately. Follow-up required within 24 hours if symptoms persist or worsen.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Symptoms */}
          {call.symptoms.length > 0 && <Card>
              <CardHeader>
                <CardTitle className="text-lg">Clinical Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {call.symptoms.map((symptom, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 text-sm">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>}

          {/* Call Summary and Transcript Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Call Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Call Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-96">
                  <p className="text-gray-700 pr-4">{call.summary}</p>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Call Transcript */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Call Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono pr-4">
                      {call.transcript}
                    </pre>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
