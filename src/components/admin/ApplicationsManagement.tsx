'use client';
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Clock,
  Loader2,
  Inbox,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { ApplicationRecord } from '@/lib/dashboard-data';
import ApplicationAssessment from './ApplicationAssessment';

export default function ApplicationsManagement() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  useEffect(() => {
    const loadApplications = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('partner_application')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setLoadError('Could not load applications');
        toast({
          title: 'Error loading applications',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setApplications(data ?? []);
      }
      setIsLoading(false);
    };

    loadApplications();
  }, [toast]);

  const handleReview = (app: ApplicationRecord) => {
    setSelectedApp(app);
    setIsAssessmentOpen(true);
  };

  const handleAssessmentSaved = () => {
    // Refresh applications or update local state
    const loadApplications = async () => {
      const { data } = await supabase
        .from('partner_application')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setApplications(data);
    };
    loadApplications();
  };

  const pendingApplications = applications.filter(
    (app) => app.status === 'pending'
  );
  const processedApplications = applications.filter(
    (app) => app.status !== 'pending'
  );

  const updateApplicationStatus = async (
    appId: string,
    status: ApplicationRecord['status'],
    reason = ''
  ) => {
    const { error } = await supabase
      .from('partner_application')
      .update({ status, reject_reason: reason || null })
      .eq('id', appId);

    if (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );
    toast({
      title: `Application ${status}`,
      description: 'Status updated.',
    });
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
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading applications...</span>
            </div>
          ) : loadError ? (
            <p className="text-sm text-red-600">{loadError}</p>
          ) : pendingApplications.length === 0 ? (
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReview(app)}
                  >
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

      {selectedApp && (
        <ApplicationAssessment
          isOpen={isAssessmentOpen}
          onClose={() => setIsAssessmentOpen(false)}
          application={selectedApp}
          onSaved={handleAssessmentSaved}
        />
      )}
    </div>
  );
}
