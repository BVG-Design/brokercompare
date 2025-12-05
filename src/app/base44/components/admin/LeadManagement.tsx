import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, ExternalLink, Building2, User, CheckCircle, Calendar, AlertTriangle, Activity, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function LeadsManagement() {
  const queryClient = useQueryClient();
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadCategory, setLeadCategory] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [newActivity, setNewActivity] = useState({ type: "", description: "" });
  const [newTask, setNewTask] = useState({ task: "", due_date: "" });

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: () => base44.entities.Lead.list('-created_date'),
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['lead-activities', selectedLead?.id],
    queryFn: () => base44.entities.LeadActivity.filter({ lead_id: selectedLead.id }, '-created_date'),
    enabled: !!selectedLead,
  });

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Lead.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success("Lead updated successfully");
    },
  });

  const addActivityMutation = useMutation({
    mutationFn: (activity) => base44.entities.LeadActivity.create(activity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-activities'] });
      toast.success("Activity logged");
      setNewActivity({ type: "", description: "" });
    },
  });

  const anonymizeLeadMutation = useMutation({
    mutationFn: async (lead) => {
      const anonymizedData = {
        ...lead,
        broker_name: `Lead_${lead.id.substring(0, 8)}`,
        broker_email: `anonymized_${lead.id.substring(0, 8)}@example.com`,
        broker_phone: "***REDACTED***",
        company_name: "***REDACTED***",
        message: "***REDACTED***",
        data_anonymized: true
      };
      return base44.entities.Lead.update(lead.id, anonymizedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success("Lead data anonymized");
      setSelectedLead(null);
    },
  });

  const handleSaveLead = () => {
    if (!selectedLead) return;
    updateLeadMutation.mutate({
      id: selectedLead.id,
      data: {
        ...selectedLead,
        lead_category: leadCategory,
        admin_notes: adminNotes
      }
    });
  };

  const handleCheckboxChange = (field) => {
    const updatedLead = { ...selectedLead, [field]: !selectedLead[field] };
    setSelectedLead(updatedLead);
    updateLeadMutation.mutate({ id: selectedLead.id, data: updatedLead });
    
    // Log activity
    addActivityMutation.mutate({
      lead_id: selectedLead.id,
      activity_type: "profile_updated",
      description: `${field.replace(/_/g, ' ')} ${!selectedLead[field] ? 'completed' : 'unchecked'}`,
      performed_by: user?.email || 'admin'
    });
  };

  const handleAddTask = () => {
    if (!newTask.task) return;
    const tasks = selectedLead.tasks || [];
    const updatedLead = {
      ...selectedLead,
      tasks: [...tasks, { task: newTask.task, completed: false, due_date: newTask.due_date }]
    };
    setSelectedLead(updatedLead);
    updateLeadMutation.mutate({ id: selectedLead.id, data: updatedLead });
    setNewTask({ task: "", due_date: "" });
    
    // Log activity
    addActivityMutation.mutate({
      lead_id: selectedLead.id,
      activity_type: "task_completed",
      description: `Task added: ${newTask.task}`,
      performed_by: user?.email || 'admin'
    });
  };

  const handleToggleTask = (taskIndex) => {
    const tasks = [...(selectedLead.tasks || [])];
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    const updatedLead = { ...selectedLead, tasks };
    setSelectedLead(updatedLead);
    updateLeadMutation.mutate({ id: selectedLead.id, data: updatedLead });
    
    // Log activity
    addActivityMutation.mutate({
      lead_id: selectedLead.id,
      activity_type: "task_completed",
      description: `Task ${tasks[taskIndex].completed ? 'completed' : 'uncompleted'}: ${tasks[taskIndex].task}`,
      performed_by: user?.email || 'admin'
    });
  };

  const handleRemoveTask = (taskIndex) => {
    const tasks = [...(selectedLead.tasks || [])];
    tasks.splice(taskIndex, 1);
    const updatedLead = { ...selectedLead, tasks };
    setSelectedLead(updatedLead);
    updateLeadMutation.mutate({ id: selectedLead.id, data: updatedLead });
  };

  const handleLogActivity = () => {
    if (!newActivity.type || !newActivity.description) {
      toast.error("Please provide activity type and description");
      return;
    }

    addActivityMutation.mutate({
      lead_id: selectedLead.id,
      activity_type: newActivity.type,
      description: newActivity.description,
      performed_by: user?.email || 'admin',
      metadata: {}
    });
  };

  const activityTypes = [
    { value: "email_sent", label: "Email Sent" },
    { value: "phone_call", label: "Phone Call" },
    { value: "meeting", label: "Meeting" },
    { value: "note_added", label: "Note Added" },
    { value: "status_changed", label: "Status Changed" },
    { value: "follow_up_scheduled", label: "Follow-up Scheduled" },
    { value: "document_shared", label: "Document Shared" },
    { value: "other", label: "Other" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#132847] flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Leads Management ({leads.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {leads.map(lead => (
              <div 
                key={lead.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedLead(lead);
                  setLeadCategory(lead.lead_category || "");
                  setAdminNotes(lead.admin_notes || "");
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-[#132847]">
                        {lead.data_anonymized ? `Lead_${lead.id.substring(0, 8)}` : lead.broker_name}
                      </h4>
                      <Badge className={
                        lead.status === 'new' ? 'bg-green-500' :
                        lead.status === 'contacted' ? 'bg-blue-500' :
                        lead.status === 'qualified' ? 'bg-purple-500' :
                        lead.status === 'converted' ? 'bg-green-600' :
                        'bg-gray-500'
                      }>
                        {lead.status}
                      </Badge>
                      {lead.risk_level && lead.risk_level !== 'low' && (
                        <Badge variant="outline" className={
                          lead.risk_level === 'high' ? 'border-red-600 text-red-600' :
                          'border-orange-600 text-orange-600'
                        }>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {lead.risk_level} risk
                        </Badge>
                      )}
                      {lead.lead_category && (
                        <Badge variant="outline">
                          {lead.lead_category === 'broker' && <User className="w-3 h-3 mr-1" />}
                          {lead.lead_category === 'directory' && <Building2 className="w-3 h-3 mr-1" />}
                          {lead.lead_category}
                        </Badge>
                      )}
                      {lead.data_anonymized && (
                        <Badge variant="secondary">Anonymized</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Directory:</strong> {lead.vendor_name}
                    </p>
                    {!lead.data_anonymized && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Email:</strong> {lead.broker_email}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      {lead.profile_created && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {lead.welcome_email_sent && <Mail className="w-4 h-4 text-blue-600" />}
                      {lead.follow_up_required && <Calendar className="w-4 h-4 text-orange-600" />}
                      {lead.assigned_to && <User className="w-4 h-4 text-purple-600" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Lead Details Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => {
        setSelectedLead(null);
        setLeadCategory("");
        setAdminNotes("");
      }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Lead Details</span>
              {selectedLead?.data_anonymized && (
                <Badge variant="secondary">Data Anonymized</Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="checklist">Checklist & Tasks</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                {/* Lead Category & Risk */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Lead Category</Label>
                    <Select value={leadCategory} onValueChange={setLeadCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Categorize this lead..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="broker">Broker</SelectItem>
                        <SelectItem value="directory">Directory Listing</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Risk Level</Label>
                    <Select 
                      value={selectedLead.risk_level || 'low'} 
                      onValueChange={(value) => {
                        const updated = { ...selectedLead, risk_level: value };
                        setSelectedLead(updated);
                        updateLeadMutation.mutate({ id: selectedLead.id, data: updated });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Broker Information */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Broker Name</p>
                    <p className="font-semibold">{selectedLead.broker_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{selectedLead.broker_email}</p>
                  </div>
                  {selectedLead.broker_phone && (
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{selectedLead.broker_phone}</p>
                    </div>
                  )}
                  {selectedLead.company_name && (
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="font-semibold">{selectedLead.company_name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Select 
                      value={selectedLead.status} 
                      onValueChange={(value) => {
                        const updated = { ...selectedLead, status: value };
                        setSelectedLead(updated);
                        updateLeadMutation.mutate({ id: selectedLead.id, data: updated });
                      }}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Assigned To</p>
                    <Input
                      value={selectedLead.assigned_to || ''}
                      onChange={(e) => setSelectedLead({ ...selectedLead, assigned_to: e.target.value })}
                      placeholder="Admin email"
                    />
                  </div>
                </div>

                {/* Directory Information */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Directory Listing</h4>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-[#132847]">{selectedLead.vendor_name}</p>
                    <Link to={createPageUrl(`VendorProfile?id=${selectedLead.vendor_id}`)}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Message */}
                {selectedLead.message && !selectedLead.data_anonymized && (
                  <div>
                    <h4 className="font-semibold mb-2">Message</h4>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedLead.message}</p>
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                <div>
                  <Label>Admin Notes</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes..."
                    rows={4}
                  />
                </div>

                {/* Save & Anonymize */}
                <div className="flex gap-3">
                  <Button onClick={handleSaveLead} className="flex-1 bg-[#132847]">
                    Save Changes
                  </Button>
                  {!selectedLead.data_anonymized && (
                    <Button 
                      onClick={() => anonymizeLeadMutation.mutate(selectedLead)}
                      variant="outline"
                      className="border-orange-600 text-orange-600"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Anonymize Data
                    </Button>
                  )}
                </div>
              </TabsContent>

              {/* Checklist & Tasks Tab */}
              <TabsContent value="checklist" className="space-y-6">
                {/* Quick Checklist */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Quick Checklist</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="profile_created"
                        checked={selectedLead.profile_created}
                        onCheckedChange={() => handleCheckboxChange('profile_created')}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <label htmlFor="profile_created" className="text-sm cursor-pointer">
                        Profile Created
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="welcome_email_sent"
                        checked={selectedLead.welcome_email_sent}
                        onCheckedChange={() => handleCheckboxChange('welcome_email_sent')}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <label htmlFor="welcome_email_sent" className="text-sm cursor-pointer">
                        Welcome Email Sent
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="follow_up_required"
                        checked={selectedLead.follow_up_required}
                        onCheckedChange={() => handleCheckboxChange('follow_up_required')}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <label htmlFor="follow_up_required" className="text-sm cursor-pointer">
                        Follow-up Required
                      </label>
                    </div>
                  </div>
                </div>

                {/* Follow-up Date */}
                {selectedLead.follow_up_required && (
                  <div>
                    <Label>Follow-up Date</Label>
                    <Input
                      type="date"
                      value={selectedLead.follow_up_date || ''}
                      onChange={(e) => {
                        const updated = { ...selectedLead, follow_up_date: e.target.value };
                        setSelectedLead(updated);
                        updateLeadMutation.mutate({ id: selectedLead.id, data: updated });
                      }}
                    />
                  </div>
                )}

                {/* Custom Tasks */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Custom Tasks</h3>
                  <div className="space-y-3 mb-4">
                    {selectedLead.tasks?.map((task, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleToggleTask(idx)}
                          className="data-[state=checked]:bg-green-600 mt-1"
                        />
                        <div className="flex-1">
                          <p className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.task}
                          </p>
                          {task.due_date && (
                            <p className="text-xs text-gray-500 mt-1">Due: {task.due_date}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTask(idx)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                    <Input
                      placeholder="Task description"
                      value={newTask.task}
                      onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                    />
                    <Input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    />
                    <Button onClick={handleAddTask} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Activity Log Tab */}
              <TabsContent value="activity" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Activity Log</h3>
                  <Activity className="w-5 h-5 text-gray-500" />
                </div>

                {/* Log New Activity */}
                <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                  <h4 className="font-semibold">Log New Activity</h4>
                  <Select value={newActivity.type} onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Activity description..."
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    rows={3}
                  />
                  <Button onClick={handleLogActivity} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Activity
                  </Button>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activities.map((activity, idx) => (
                    <div key={activity.id} className="flex gap-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#132847] text-white flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm text-[#132847]">
                            {activity.activity_type.replace(/_/g, ' ')}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.created_date).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{activity.description}</p>
                        {activity.performed_by && (
                          <p className="text-xs text-gray-500 mt-1">By: {activity.performed_by}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No activities logged yet</p>
                  )}
                </div>
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights" className="space-y-4">
                <h3 className="font-semibold text-lg">Lead Insights & Growth Tracking</h3>

                {/* Products/Services Interested */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">Products Interested</h4>
                    <div className="space-y-2">
                      {selectedLead.products_interested?.map((product, idx) => (
                        <Badge key={idx} variant="secondary">{product}</Badge>
                      )) || <p className="text-sm text-gray-500">No products tracked</p>}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">Services Interested</h4>
                    <div className="space-y-2">
                      {selectedLead.services_interested?.map((service, idx) => (
                        <Badge key={idx} variant="secondary">{service}</Badge>
                      )) || <p className="text-sm text-gray-500">No services tracked</p>}
                    </div>
                  </div>
                </div>

                {/* Growth Metrics */}
                {selectedLead.growth_metrics && (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold mb-3">Growth Metrics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Initial Team Size</p>
                        <p className="font-semibold">{selectedLead.growth_metrics.initial_team_size || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Current Team Size</p>
                        <p className="font-semibold">{selectedLead.growth_metrics.current_team_size || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Tools Adopted</p>
                        <p className="font-semibold">{selectedLead.growth_metrics.tools_adopted || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Referrals Made</p>
                        <p className="font-semibold">{selectedLead.growth_metrics.referrals_made || 0}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Referral Partnerships */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Referral Partnerships</h4>
                  <div className="space-y-2">
                    {selectedLead.referral_partnerships?.map((partner, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{partner}</span>
                      </div>
                    )) || <p className="text-sm text-gray-500">No partnerships tracked</p>}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className={`p-4 border-2 rounded-lg ${
                  selectedLead.risk_level === 'high' ? 'border-red-500 bg-red-50' :
                  selectedLead.risk_level === 'medium' ? 'border-orange-500 bg-orange-50' :
                  'border-green-500 bg-green-50'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className={`w-5 h-5 ${
                      selectedLead.risk_level === 'high' ? 'text-red-600' :
                      selectedLead.risk_level === 'medium' ? 'text-orange-600' :
                      'text-green-600'
                    }`} />
                    <h4 className="font-semibold">Risk Assessment: {selectedLead.risk_level || 'Low'}</h4>
                  </div>
                  <Textarea
                    placeholder="Add risk notes..."
                    value={selectedLead.risk_notes || ''}
                    onChange={(e) => {
                      const updated = { ...selectedLead, risk_notes: e.target.value };
                      setSelectedLead(updated);
                    }}
                    rows={3}
                  />
                  <Button 
                    onClick={() => updateLeadMutation.mutate({ id: selectedLead.id, data: selectedLead })}
                    size="sm"
                    className="mt-2"
                  >
                    Save Risk Notes
                  </Button>
                </div>

                {/* Application Link */}
                {selectedLead.application_id && (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Linked Application</h4>
                        <p className="text-sm text-gray-600">Application ID: {selectedLead.application_id}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Application
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}