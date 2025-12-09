'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { LeadRecord } from '@/lib/dashboard-data';
import { Loader2 } from 'lucide-react';

export default function LeadsManagement() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeads = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setLoadError('Could not load leads');
      } else {
        setLeads(data ?? []);
      }
      setIsLoading(false);
    };

    loadLeads();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#132847]">Lead Management</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading leads...</span>
          </div>
        ) : loadError ? (
          <p className="text-sm text-red-600">{loadError}</p>
        ) : leads.length > 0 ? (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {leads.map((lead) => (
              <div key={lead.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {lead.broker_name || 'Unknown broker'} (
                      {lead.broker_email || 'No email'})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      to {lead.vendor_id || 'Unknown vendor'}
                    </p>
                  </div>
                  <Badge variant={lead.status === 'new' ? 'default' : 'outline'}>
                    {lead.status}
                  </Badge>
                </div>
                <p className="text-sm bg-slate-50 p-3 rounded-md my-2">
                  {lead.message || 'No message provided.'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lead.created_at
                    ? new Date(lead.created_at).toLocaleString()
                    : 'No date'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Mail className="mx-auto h-12 w-12 mb-4" />
            <p>No leads have been generated yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
