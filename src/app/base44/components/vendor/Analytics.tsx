import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Mail, TrendingUp, Users } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

export default function Analytics({ vendor, leads }) {
  // Calculate conversion rate
  const conversionRate = useMemo(() => {
    if (!vendor.view_count || vendor.view_count === 0) return 0;
    return ((vendor.lead_count || 0) / vendor.view_count * 100).toFixed(1);
  }, [vendor]);

  // Group leads by status
  const leadsByStatus = useMemo(() => {
    const statusCounts = {
      new: 0,
      contacted: 0,
      qualified: 0,
      converted: 0,
      lost: 0
    };
    
    leads.forEach(lead => {
      if (statusCounts.hasOwnProperty(lead.status)) {
        statusCounts[lead.status]++;
      }
    });
    
    return statusCounts;
  }, [leads]);

  // Calculate recent trends (last 30 days)
  const recentLeads = useMemo(() => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    return leads.filter(lead => new Date(lead.created_date) >= thirtyDaysAgo);
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-[#132847] mt-1">{vendor.view_count || 0}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-[#132847] mt-1">{vendor.lead_count || 0}</p>
              </div>
              <Mail className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-[#132847] mt-1">{conversionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last 30 Days</p>
                <p className="text-2xl font-bold text-[#132847] mt-1">{recentLeads.length}</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#132847]">Lead Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(leadsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'new' ? 'bg-green-500' :
                    status === 'contacted' ? 'bg-blue-500' :
                    status === 'qualified' ? 'bg-purple-500' :
                    status === 'converted' ? 'bg-green-600' :
                    'bg-gray-500'
                  }`} />
                  <span className="font-medium capitalize">{status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-[#132847]">{count}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        status === 'new' ? 'bg-green-500' :
                        status === 'contacted' ? 'bg-blue-500' :
                        status === 'qualified' ? 'bg-purple-500' :
                        status === 'converted' ? 'bg-green-600' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${leads.length > 0 ? (count / leads.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lead Sources */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#132847]">Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['profile_view', 'search', 'ai_chat', 'direct'].map(source => {
                const count = leads.filter(l => l.source === source).length;
                return (
                  <div key={source} className="flex items-center justify-between">
                    <span className="capitalize">{source.replace('_', ' ')}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#132847]">Broker Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['mortgage_broker', 'asset_finance_broker', 'commercial_finance_broker', 'other'].map(type => {
                const count = leads.filter(l => l.broker_type === type).length;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="capitalize">{type.replace(/_/g, ' ')}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}