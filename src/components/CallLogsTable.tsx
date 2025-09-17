import React from 'react';
import { MoreHorizontal, Phone, FileText, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CallLog } from '@/types/call-log';
import { getPriorityIcon, getStatusBadge } from '@/utils/call-log-utils';

interface CallLogsTableProps {
  calls: CallLog[];
  onCallSelect: (call: CallLog) => void;
}

export const CallLogsTable: React.FC<CallLogsTableProps> = ({ calls, onCallSelect }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Urgency</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Caller ID</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow 
              key={call.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onCallSelect(call)}
            >
              <TableCell>
                {getPriorityIcon(call.priority)}
              </TableCell>
              <TableCell className="font-medium">{call.patientName}</TableCell>
              <TableCell>{call.dateOfBirth}</TableCell>
              <TableCell>{call.callerId}</TableCell>
              <TableCell>{call.duration}</TableCell>
              <TableCell>{call.timestamp}</TableCell>
              <TableCell>{getStatusBadge(call.status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onCallSelect(call)}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Phone className="mr-2 h-4 w-4" />
                      Call Back
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Flag for Review
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};