'use client';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Clock,
  CheckCircle,
  X,
  Loader2,
  Inbox,
} from 'lucide-react';

// Mock data
const mockApplications = [
  {
    id: 'app1',
    company_name: 'Creative Marketing Co',
    contact_name: 'Alice',
    email: 'alice@creative.com',
    status: 'pending',
    business_type: 'service',
    categories: ['marketing_services', 'lead_generation'],
  },
  {
    id: 'app2',
    company_name: 'CRM Innovators',
    contact_name: 'Bob',
    email: 'bob@crminnovate.com',
    status: 'approved',
    business_type: 'software',
    categories: ['crm_systems'],
  },
  {
    id: 'app3',
    company_name: 'Finance Solutions Ltd',
    contact_name: 'Charlie',
    email: 'charlie@finance.com',
    status: 'rejected',
    business_type: 'both',
    categories: ['commercial_finance', 'asset_finance_tools'],
  },
];

export default function ApplicationsManagement() {
  const { toast } = useToast();
  const [applications, setApplications] = useState(mockApplications);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isMutating, setIsMutating] = useState(false);

  const pendingApplications = applications.filter(
    (app) => app.status === 'pending'
  );
  const processedApplications = applications.filter(
    (app) => app.status !== 'pending'
  );

  const updateApplicationStatus = async (app, status, reason = '') => {
    setIsMutating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status } : a))
    );
    toast({
      title: `Application ${status}`,
      description: `${app.company_name}'s application has been ${status}.`,
    });
    setSelectedApplication(null);
    setIsMutating(false);
  };

  const saveNotes = async (app) => {
    setIsMutating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, admin_notes: adminNotes } : a))
    );
    toast({ title: 'Notes saved' });
    setIsMutating(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Pending Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#132847]">
            Pending Applications ({pendingApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingApplications.length === 0 ? (
            <div className="text-center py-8">
              <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No pending applications</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pendingApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-start justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedApplication(app);
                    setAdminNotes(app.admin_notes || '');
                    setRejectReason('');
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-[#132847]">
                        {app.company_name}
                      </p>
                      <Badge variant="outline" className="bg-orange-50">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                      {app.business_type && (
                        <Badge variant="secondary">{app.business_type}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Contact:</strong> {app.contact_name} ({app.email})
                    </p>
                    {app.categories && app.categories.length > 0 && (
                      <p className="text-sm text-gray-600">
                        <strong>Categories:</strong>{' '}
                        {app.categories.slice(0, 3).join(', ')}
                        {app.categories.length > 3 &&
                          ` +${app.categories.length - 3} more`}
                      </p>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Review
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Other cards will go here */}
    </div>
  );
}
