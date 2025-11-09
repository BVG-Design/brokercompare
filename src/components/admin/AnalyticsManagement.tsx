'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, Eye, Mail } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{change}</p>
    </CardContent>
  </Card>
);

export default function AnalyticsManagement() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#132847]">Platform Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value="1,204"
              icon={Users}
              change="+20.1% from last month"
            />
            <StatCard
              title="Page Views"
              value="89,234"
              icon={Eye}
              change="+15.3% from last month"
            />
            <StatCard
              title="Leads Generated"
              value="452"
              icon={Mail}
              change="+8.2% from last month"
            />
            <StatCard
              title="New Listings"
              value="12"
              icon={BarChart}
              change="+5 since last week"
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-12">
          Chart component coming soon.
        </CardContent>
      </Card>
    </div>
  );
}
