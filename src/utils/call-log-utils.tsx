import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
export const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'high':
      return <div className="w-3 h-3 bg-red-500 rounded-full" />;
    case 'medium':
      return <div className="w-3 h-3 bg-yellow-500 rounded-full" />;
    case 'low':
      return <div className="w-3 h-3 bg-green-500 rounded-full" />;
    case 'pending':
      return <div className="w-3 h-3 rounded-full bg-slate-400" />;
    case 'none':
      return <div className="w-3 h-3 bg-black rounded-full" />;
    default:
      return null;
  }
};
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'dropped':
      return <XCircle className="w-4 h-4 text-red-600" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600" />;
    default:
      return null;
  }
};
export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
    case 'dropped':
      return <Badge variant="destructive">Dropped</Badge>;
    case 'pending':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    default:
      return null;
  }
};