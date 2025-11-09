'use client';
import React, { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Trash2, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { services, software } from '@/lib/data';

export default function DirectoryManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Combine services and software into a single list of vendors
  const allVendors = useMemo(() => {
    const combined = [
      ...services.map((s) => ({ ...s, type: 'Service' })),
      ...software.map((s) => ({ ...s, type: 'Software' })),
    ];
    // In a real app, status would come from the data. Here we mock it.
    return combined.map((vendor, index) => ({
      ...vendor,
      status:
        index % 3 === 0
          ? 'approved'
          : index % 3 === 1
          ? 'pending'
          : 'rejected',
      listing_tier:
        index % 3 === 0
          ? 'featured'
          : index % 3 === 1
          ? 'premium'
          : 'free',
      view_count: Math.floor(Math.random() * 1000),
      lead_count: Math.floor(Math.random() * 50),
    }));
  }, []);

  const [vendors, setVendors] = useState(allVendors);

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesSearch = vendor.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || vendor.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchTerm, statusFilter]);

  const handleDeleteVendor = (vendorId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this vendor? This action cannot be undone.'
      )
    ) {
      setVendors((prev) => prev.filter((v) => v.id !== vendorId));
      toast({
        title: 'Vendor Deleted',
        description: 'The vendor has been removed from the directory.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#132847]">
            Directory Listings ({vendors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {vendor.logoUrl && (
                        <img
                          src={vendor.logoUrl}
                          alt={vendor.name}
                          className="w-10 h-10 object-contain"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-[#132847]">
                          {vendor.name}
                        </h4>
                        <p className="text-sm text-gray-600">{vendor.type}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge
                        variant={
                          vendor.status === 'approved'
                            ? 'default'
                            : vendor.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className={
                          vendor.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : ''
                        }
                      >
                        {vendor.status}
                      </Badge>
                      <Badge variant="outline">
                        Tier: {vendor.listing_tier}
                      </Badge>
                      <Badge variant="outline">
                        {vendor.view_count || 0} views
                      </Badge>
                      <Badge variant="outline">
                        {vendor.lead_count || 0} leads
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/${
                        vendor.type === 'Service' ? 'services' : 'software'
                      }/${vendor.id}`}
                      passHref
                    >
                      <Button asChild variant="ghost" size="sm">
                        <a>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toast({ description: 'Edit functionality coming soon' })
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteVendor(vendor.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
