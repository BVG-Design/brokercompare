'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail } from 'lucide-react';

const mockLeads = [
  {
    id: 'lead1',
    vendor_name: 'Marketing Pro AU',
    broker_name: 'Alex Broker',
    broker_email: 'alex@finance.co',
    message: "Interested in your SEO package for brokers. Can we chat?",
    status: 'new',
    date: new Date(2023, 10, 28).toISOString(),
  },
  {
    id: 'lead2',
    vendor_name: 'VA Connect',
    broker_name: 'Brenda Smith',
    broker_email: 'brenda@brokering.com',
    message: "I need a VA for 20 hours a week. What are your rates?",
    status: 'contacted',
    date: new Date(2023, 10, 27).toISOString(),
  },
  {
    id: 'lead3',
    vendor_name: 'LoanFlow Pro',
    broker_name: 'Chris Johnson',
    broker_email: 'chris.j@mortgages.au',
    message: "Do you offer a free trial for your software?",
    status: 'closed',
    date: new Date(2023, 10, 25).toISOString(),
  },
];

export default function LeadsManagement() {
  const [leads] = useState(mockLeads);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#132847]">Lead Management</CardTitle>
      </CardHeader>
      <CardContent>
        {leads.length > 0 ? (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {leads.map((lead) => (
              <div key={lead.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{lead.broker_name} ({lead.broker_email})</p>
                    <p className="text-sm text-muted-foreground">to {lead.vendor_name}</p>
                  </div>
                  <Badge variant={lead.status === 'new' ? 'default' : 'outline'}>
                    {lead.status}
                  </Badge>
                </div>
                <p className="text-sm bg-slate-50 p-3 rounded-md my-2">{lead.message}</p>
                <p className="text-xs text-muted-foreground">{new Date(lead.date).toLocaleString()}</p>
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
