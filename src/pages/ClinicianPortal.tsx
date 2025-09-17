import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallLog, mockCallLogs } from '@/types/call-log';
import { SearchFilters } from '@/components/SearchFilters';
import { UrgencyGroupedTable } from '@/components/UrgencyGroupedTable';
import { CallDetailsDialog } from '@/components/CallDetailsDialog';
const ClinicianPortal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [callLogs, setCallLogs] = useState<CallLog[]>(mockCallLogs);
  const updatePriority = (callId: string, newPriority: 'high' | 'medium' | 'low' | 'pending' | 'none') => {
    setCallLogs(prevLogs => prevLogs.map(call => {
      if (call.id === callId) {
        const updatedCall = { ...call, priority: newPriority };
        // If priority is changed from pending to any other value, set status to completed
        if (call.priority === 'pending' && newPriority !== 'pending') {
          updatedCall.status = 'completed';
        }
        // If priority is set to pending, set status to pending
        if (newPriority === 'pending') {
          updatedCall.status = 'pending';
        }
        return updatedCall;
      }
      return call;
    }));
    if (selectedCall && selectedCall.id === callId) {
      const updatedCall = { ...selectedCall, priority: newPriority };
      // If priority is changed from pending to any other value, set status to completed
      if (selectedCall.priority === 'pending' && newPriority !== 'pending') {
        updatedCall.status = 'completed';
      }
      // If priority is set to pending, set status to pending
      if (newPriority === 'pending') {
        updatedCall.status = 'pending';
      }
      setSelectedCall(updatedCall);
    }
  };
  const updateStatus = (callId: string, newStatus: 'completed' | 'dropped' | 'pending') => {
    setCallLogs(prevLogs => prevLogs.map(call => {
      if (call.id === callId) {
        const updatedCall = { ...call, status: newStatus };
        // If status is set to dropped, set priority to none
        if (newStatus === 'dropped') {
          updatedCall.priority = 'none';
        }
        return updatedCall;
      }
      return call;
    }));
    if (selectedCall && selectedCall.id === callId) {
      const updatedCall = { ...selectedCall, status: newStatus };
      // If status is set to dropped, set priority to none
      if (newStatus === 'dropped') {
        updatedCall.priority = 'none';
      }
      setSelectedCall(updatedCall);
    }
  };
  const filteredCalls = callLogs.filter(call => {
    const matchesSearch = call.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || call.nhsNumber.includes(searchTerm) || call.callerId.includes(searchTerm);
    const matchesPriority = priorityFilter === 'all' || call.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });
  return <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clinician Portal</h1>
          <p className="text-gray-600">Monitor and review patient call logs and interactions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Phone className="h-5 w-5" />
              Call Logs
            </CardTitle>
            
            <SearchFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
          </CardHeader>
          
          <CardContent>
            <UrgencyGroupedTable calls={filteredCalls} onCallSelect={setSelectedCall} />
          </CardContent>
        </Card>

        <CallDetailsDialog call={selectedCall} isOpen={!!selectedCall} onClose={() => setSelectedCall(null)} onUpdateStatus={updateStatus} onUpdateUrgency={updatePriority} />
      </div>
    </div>;
};
export default ClinicianPortal;