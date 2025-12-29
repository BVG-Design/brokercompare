import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight, ChevronLeft, CheckCircle, Info } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingQuestionnaire({ user, existingProfile, onComplete }) {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(existingProfile || {
    aggregator: "",
    aggregator_other: "",
    team_size: "",
    team_location: "",
    top_priorities: [],
    lead_capture_crm: "",
    fact_find_software: "",
    email_system: "",
    phone_system: "",
    has_it_support: false,
    has_accountant: false,
    has_marketing_agency: false,
    has_mindset_coach: false,
    has_lawyer: false,
    has_insurance_broker: false,
    has_ai_specialist: false,
    considering_change: false,
    change_details: ""
  });

  const aggregators = [
    "AMAG", "Astute Financial Management", "Buyers Choice Home Loan Advisory Service",
    "Auspak Financial Services", "Aussie", "Australian Finance Group",
    "Balmain NB Commercial Mortgages", "Bernie Lewis Home Loans", "Centrepoint Alliance Lending",
    "Choice Aggregation Services", "Connective Group", "eChoice Home Loans",
    "Elders Home Loans", "Fasttrack Finance Group", "Finance & Systems Technology",
    "Finance King", "Finconnect", "Finsure Finance & Insurance",
    "First Chartered Capital Operations", "GMS Group (Sample and Partners)", "LJ Hooker Home Loans",
    "Loan Market (LMG)", "Loankit", "Loans Today", "Mortgage Choice", "Mortgage House",
    "Mortgage Loans Australia", "Mortgage Point", "My Local Aggregation", "My Local Broker",
    "National Mortgage Brokers (nMB)", "NewCo Financial Services", "Our Broker", "Pennley",
    "PLAN Australia", "Purple Circle Financial Services", "Real Estate .com .au",
    "Smartline Personal Mortgage Advisers", "Specialist Finance Group", "Sure Harvest Pty Ltd",
    "Vow Financial", "MoneyQuest", "Nectar Mortgages", "National Lending Group",
    "Finance and Mortgage Solutions", "Outsource Financial Pty Ltd", "Yellow Brick Road", "Other"
  ];

  const priorities = [
    "Task Management", "Workflow Automations", "Lead Generation", "Marketing",
    "Manual Entry", "Retention/Referral Marketing / Amplification", "Reporting",
    "Team Development", "Systems Training", "Mindset & Strategic Growth", "AI Enablement"
  ];

  const togglePriority = (priority) => {
    if (formData.top_priorities.includes(priority)) {
      setFormData({
        ...formData,
        top_priorities: formData.top_priorities.filter(p => p !== priority)
      });
    } else {
      if (formData.top_priorities.length < 3) {
        setFormData({
          ...formData,
          top_priorities: [...formData.top_priorities, priority]
        });
      } else {
        toast.error("Please select only 3 priorities");
      }
    }
  };

  const saveProfileMutation = useMutation({
    mutationFn: async (data) => {
      if (existingProfile?.id) {
        return await base44.entities.BrokerProfile.update(existingProfile.id, {
          ...data,
          user_email: user.email,
          onboarding_completed: true
        });
      } else {
        return await base44.entities.BrokerProfile.create({
          ...data,
          user_email: user.email,
          onboarding_completed: true
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broker-profile'] });
      toast.success("Profile saved successfully!");
      if (onComplete) onComplete();
    },
    onError: () => {
      toast.error("Failed to save profile");
    }
  });

  const handleNext = () => {
    if (currentStep === 1 && !formData.aggregator) {
      toast.error("Please select your aggregator");
      return;
    }
    if (currentStep === 2 && !formData.team_size) {
      toast.error("Please select your team size");
      return;
    }
    if (currentStep === 3 && formData.top_priorities.length !== 3) {
      toast.error("Please select exactly 3 priorities");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = () => {
    saveProfileMutation.mutate(formData);
  };

  const totalSteps = 6;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-[#132847]">
            {existingProfile ? "Update Your Profile" : "Complete Your Profile"}
          </CardTitle>
          <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#132847] h-2 rounded-full transition-all"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            We ask these questions to better understand your needs and recommend the right tools for your business.{" "}
            <a href="#" className="underline font-semibold">Learn more about how we use this data</a>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Step 1: Aggregator */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Who is your Aggregator? *</Label>
              <Select value={formData.aggregator} onValueChange={(value) => setFormData({...formData, aggregator: value})}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your aggregator" />
                </SelectTrigger>
                <SelectContent>
                  {aggregators.map(agg => (
                    <SelectItem key={agg} value={agg}>{agg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.aggregator === "Other" && (
              <div>
                <Label>Please specify</Label>
                <Input
                  value={formData.aggregator_other}
                  onChange={(e) => setFormData({...formData, aggregator_other: e.target.value})}
                  placeholder="Enter your aggregator name"
                  className="mt-2"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Team Size */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold">Team Size *</Label>
              <RadioGroup value={formData.team_size} onValueChange={(value) => setFormData({...formData, team_size: value})} className="mt-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="just_me" id="just_me" />
                  <label htmlFor="just_me" className="cursor-pointer">Just Me</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2-3" id="2-3" />
                  <label htmlFor="2-3" className="cursor-pointer">2-3</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4-10" id="4-10" />
                  <label htmlFor="4-10" className="cursor-pointer">4-10</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10+" id="10+" />
                  <label htmlFor="10+" className="cursor-pointer">10+</label>
                </div>
              </RadioGroup>
            </div>

            {formData.team_size && formData.team_size !== "just_me" && (
              <div>
                <Label className="text-lg font-semibold">Are all your team onshore or offshore?</Label>
                <RadioGroup value={formData.team_location} onValueChange={(value) => setFormData({...formData, team_location: value})} className="mt-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="onshore" id="onshore" />
                    <label htmlFor="onshore" className="cursor-pointer">All Onshore</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="offshore" id="offshore" />
                    <label htmlFor="offshore" className="cursor-pointer">All Offshore (e.g., Philippines, India, Fiji)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mixed" id="mixed" />
                    <label htmlFor="mixed" className="cursor-pointer">Mix of Both</label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Priorities */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">What are your top 3 priorities right now? *</Label>
              <p className="text-sm text-gray-600 mt-1 mb-4">Select exactly 3 priorities</p>
              <div className="grid md:grid-cols-2 gap-3">
                {priorities.map(priority => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={priority}
                      checked={formData.top_priorities.includes(priority)}
                      onCheckedChange={() => togglePriority(priority)}
                      className="data-[state=checked]:bg-green-600"
                      disabled={!formData.top_priorities.includes(priority) && formData.top_priorities.length >= 3}
                    />
                    <label htmlFor={priority} className="text-sm cursor-pointer">
                      {priority}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3">Selected: {formData.top_priorities.length}/3</p>
            </div>
          </div>
        )}

        {/* Step 4: Software */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">What Programs or Software currently run your:</Label>
            <div>
              <Label>Lead Capture/CRM</Label>
              <Input
                value={formData.lead_capture_crm}
                onChange={(e) => setFormData({...formData, lead_capture_crm: e.target.value})}
                placeholder="e.g., Aggregator Software, HubSpot"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Fact Find Document Collection</Label>
              <Input
                value={formData.fact_find_software}
                onChange={(e) => setFormData({...formData, fact_find_software: e.target.value})}
                placeholder="e.g., Aggregator Software, Saletrekker"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={formData.email_system}
                onChange={(e) => setFormData({...formData, email_system: e.target.value})}
                placeholder="e.g., Google Suite, Microsoft Office"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Phone System</Label>
              <Input
                value={formData.phone_system}
                onChange={(e) => setFormData({...formData, phone_system: e.target.value})}
                placeholder="e.g., Mobile, Landline, VoIP (AirCall)"
                className="mt-2"
              />
            </div>
          </div>
        )}

        {/* Step 5: Service Providers */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Do you use or have a:</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="it_support"
                  checked={formData.has_it_support}
                  onCheckedChange={(checked) => setFormData({...formData, has_it_support: checked})}
                  className="data-[state=checked]:bg-green-600"
                />
                <label htmlFor="it_support" className="cursor-pointer">IT Support</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accountant"
                  checked={formData.has_accountant}
                  onCheckedChange={(checked) => setFormData({...formData, has_accountant: checked})}
                  className="data-[state=checked]:bg-green-600"
                />
                <label htmlFor="accountant" className="cursor-pointer">Accountant</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing_agency"
                  checked={formData.has_marketing_agency}
                  onCheckedChange={(checked) => setFormData({...formData, has_marketing_agency: checked})}
                  className="data-[state=checked]:bg-green-600"
                />
                <label htmlFor="marketing_agency" className="cursor-pointer">Marketing Agency</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mindset_coach"
                  checked={formData.has_mindset_coach}
                  onCheckedChange={(checked) => setFormData({...formData, has_mindset_coach: checked})}
                  className="data-[state=checked]:bg-green-600"
                />
                <label htmlFor="mindset_coach" className="cursor-pointer">Mindset Coach or Growth Strategist</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lawyer"
                  checked={formData.has_lawyer}
                  onCheckedChange={(checked) => setFormData({...formData, has_lawyer: checked})}
                  className="data-[state=checked]:bg-green-600"
                />
                <label htmlFor="lawyer" className="cursor-pointer">Lawyer</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insurance_broker"
                  checked={formData.has_insurance_broker}
                  onCheckedChange={(checked) => setFormData({...formData, has_insurance_broker: checked})}
                  className="data-[state=checked]:bg-green-600"
                />
                <label htmlFor="insurance_broker" className="cursor-pointer">Insurance Broker</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ai_specialist"
                  checked={formData.has_ai_specialist}
                  onCheckedChange={(checked) => setFormData({...formData, has_ai_specialist: checked})}
                  className="data-[state=checked]:bg-green-600"
                />
                <label htmlFor="ai_specialist" className="cursor-pointer">AI & Automations Specialist</label>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Considering Change */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">Are you considering changing Software or Service providers?</Label>
              <RadioGroup
                value={formData.considering_change ? "yes" : "no"}
                onValueChange={(value) => setFormData({...formData, considering_change: value === "yes"})}
                className="mt-4 space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <label htmlFor="yes" className="cursor-pointer">Yes</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <label htmlFor="no" className="cursor-pointer">No</label>
                </div>
              </RadioGroup>
            </div>

            {formData.considering_change && (
              <div>
                <Label>What processes or services do you want improved?</Label>
                <Textarea
                  value={formData.change_details}
                  onChange={(e) => setFormData({...formData, change_details: e.target.value})}
                  placeholder="Tell us what you're looking to improve..."
                  rows={5}
                  className="mt-2"
                />
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {currentStep < totalSteps ? (
            <Button onClick={handleNext} className="bg-[#132847] hover:bg-[#1a3a5f]">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={saveProfileMutation.isPending}
              className="bg-[#132847] hover:bg-[#1a3a5f]"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {saveProfileMutation.isPending ? "Saving..." : "Complete"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}