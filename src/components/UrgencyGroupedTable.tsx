import React, { useState } from 'react';
import { MoreHorizontal, Phone, FileText, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CallLog } from '@/types/call-log';
import { getPriorityIcon, getStatusBadge } from '@/utils/call-log-utils';

interface UrgencyGroupedTableProps {
  calls: CallLog[];
  onCallSelect: (call: CallLog) => void;
}

interface UrgencyGroup {
  key: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  calls: CallLog[];
}

export const UrgencyGroupedTable: React.FC<UrgencyGroupedTableProps> = ({ calls, onCallSelect }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    high: true,
    medium: true,
    low: true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Group calls by urgency
  const urgencyGroups: UrgencyGroup[] = [
    {
      key: 'high',
      label: 'Red (High Urgency)',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      calls: calls.filter(call => call.priority === 'high')
    },
    {
      key: 'medium',
      label: 'Amber (Medium Urgency)',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      calls: calls.filter(call => call.priority === 'medium')
    },
    {
      key: 'low',
      label: 'Green (Low Urgency)',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      calls: calls.filter(call => call.priority === 'low')
    }
  ].filter(group => group.calls.length > 0); // Only show groups with calls

  const TableSection: React.FC<{ group: UrgencyGroup }> = ({ group }) => (
    <Card className={`${group.borderColor} ${group.bgColor} border-2`}>
      <CardHeader className="pb-2">
        <Collapsible
          open={expandedSections[group.key]}
          onOpenChange={() => toggleSection(group.key)}
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className={`w-full justify-between ${group.color} hover:${group.bgColor} font-semibold`}
            >
              <div className="flex items-center gap-3">
                <span>{group.label}</span>
                <Badge variant="secondary" className="bg-white/80">
                  {group.calls.length}
                </Badge>
              </div>
              {expandedSections[group.key] ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-4 px-0">
              <div className="rounded-md border bg-white">
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
                    {group.calls.map((call) => (
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
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </Card>
  );

  if (urgencyGroups.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No calls found matching the current filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {urgencyGroups.map((group) => (
        <TableSection key={group.key} group={group} />
      ))}
    </div>
  );
};