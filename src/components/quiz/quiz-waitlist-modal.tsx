'use client';

import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Send,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  Loader2,
  Info,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';
import { z } from 'zod';

const contactInfoSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.union([
    z.string()
      .regex(/^[0-9+ ]+$/, 'Phone number must only contain digits, spaces or +')
      .min(8, 'Phone number is too short (min 8 digits)'),
    z.literal(''),
  ]),
});

interface QuizWaitlistModalProps {
  children: React.ReactNode;
}

const PRODUCT_SERVICE_TYPES = [
  { id: 'crm', label: 'CRM (Lead Management & Enquiry Tracker)', type: 'tool' },
  { id: 'factfind', label: 'Fact Find & Document Collection Software', type: 'tool' },
  { id: 'automation', label: 'AI & Workflow Automations', type: 'hybrid' },
  { id: 'va', label: 'Virtual Assistant & Credit Analyst', type: 'service' },
  { id: 'marketing', label: 'Marketing & Social Media Services', type: 'service' },
  { id: 'it', label: 'IT & Cybersecurity Support', type: 'service' },
  { id: 'bookkeeping', label: 'Bookkeeping & Accounting', type: 'service' },
  { id: 'coach', label: 'Mindset Coach & Business Strategist', type: 'service' },
  { id: 'other', label: 'Something Else:', type: 'other' },
];

function QuizBody({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { user } = useAuth();

  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);

  const [answers, setAnswers] = useState<any>({
    types: [],
    automationChoice: '',
    otherType: '',
    brokerageSize: '',
    aggregator: '',
    brokerTypes: [],
    otherBrokerType: '',
    commercialTypes: [],
    otherCommercialType: '',
    businessStage: '',
    revenue: '',
    serviceDetails: {},
    toolDetails: {},
    startTiming: '',
    contactInfo: {
      firstName: user?.user_metadata?.first_name || '',
      lastName: user?.user_metadata?.last_name || '',
      email: user?.email || '',
      phone: '',
      website: '',
      location: '',
      notes: '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedServices = useMemo(() => {
    const services = PRODUCT_SERVICE_TYPES.filter(
      (t) => answers.types.includes(t.id) && t.type === 'service',
    );
    if (
      answers.types.includes('automation') &&
      (answers.automationChoice === 'service' || answers.automationChoice === 'both')
    ) {
      services.push({
        id: 'automation',
        label: 'AI & Automations Implementation Specialist',
        type: 'service',
      });
    }
    return services;
  }, [answers.types, answers.automationChoice]);

  const selectedTools = useMemo(() => {
    const tools = PRODUCT_SERVICE_TYPES.filter(
      (t) => answers.types.includes(t.id) && t.type === 'tool',
    );
    if (
      answers.types.includes('automation') &&
      (answers.automationChoice === 'tool' || answers.automationChoice === 'both')
    ) {
      tools.push({ id: 'automation', label: 'AI Agents, ChatBots, or Integrations Software', type: 'tool' });
    }
    return tools;
  }, [answers.types, answers.automationChoice]);

  const steps = useMemo(() => {
    const baseSteps = ['Type', 'Size', 'Aggregator', 'Stage', 'Revenue'];
    if (answers.types.includes('automation')) {
      baseSteps.push('AutomationChoice');
    }
    const serviceSteps = selectedServices.map((s) => `service_${s.id}`);
    const toolSteps = selectedTools.map((t) => `tool_${t.id}`);
    return [...baseSteps, ...serviceSteps, ...toolSteps, 'Timeline', 'Confirm'];
  }, [selectedServices, selectedTools, answers.types]);

  const progress = ((stepIndex + 1) / steps.length) * 100;
  const currentStepKey = steps[stepIndex];
  const isContactMissing =
    !answers.contactInfo.firstName.trim() ||
    !answers.contactInfo.lastName.trim() ||
    !answers.contactInfo.email.trim();

  const isStepIncomplete = (key: string) => {
    if (key === 'Type') {
      return answers.types.length === 0 || (answers.types.includes('other') && !answers.otherType.trim());
    }
    if (key === 'Size') return !answers.brokerageSize;
    if (key === 'Aggregator') {
      const isBrokerTypeIncomplete =
        answers.brokerTypes.length === 0 ||
        (answers.brokerTypes.includes('Other') && !answers.otherBrokerType.trim());
      const isCommercialTypeIncomplete =
        answers.brokerTypes.includes('Commercial Finance') &&
        (answers.commercialTypes.length === 0 ||
          (answers.commercialTypes.includes('Other') && !answers.otherCommercialType.trim()));
      return !answers.aggregator || isBrokerTypeIncomplete || isCommercialTypeIncomplete;
    }
    if (key === 'Stage') return !answers.businessStage;
    if (key === 'Revenue') return !answers.revenue;
    if (key === 'AutomationChoice') return answers.types.includes('automation') && !answers.automationChoice;
    if (key.startsWith('service_')) {
      const serviceId = key.replace('service_', '');
      const details = answers.serviceDetails[serviceId] || {};
      if (!details.preference) return true;
      if (details.preference === 'local' && !details.location?.trim()) return true;
      if (details.preference === 'offshore' && !details.offshoreLoc) return true;
      return false;
    }
    if (key.startsWith('tool_')) {
      const toolId = key.replace('tool_', '');
      const details = answers.toolDetails[toolId] || {};
      return !details.usedBefore;
    }
    if (key === 'Timeline') return !answers.startTiming;
    if (key === 'Confirm') {
      const validation = contactInfoSchema.safeParse({
        email: answers.contactInfo.email,
        phone: answers.contactInfo.phone,
      });
      return isContactMissing || !validation.success;
    }
    return false;
  };

  const isCurrentStepIncomplete = isStepIncomplete(currentStepKey);

  const handleNext = () => {
    if (isCurrentStepIncomplete) return;
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      // Map state to database schema
      const submissionData = {
        user_id: user?.id || null,
        automation_choice: answers.automationChoice || null,
        other_type: answers.otherType || null,
        brokerage_size: answers.brokerageSize || null,
        aggregator: answers.aggregator || null,
        business_stage: answers.businessStage || null,
        revenue: answers.revenue || null,
        broker_type: answers.brokerTypes.join(', ') || null,
        brokertype_other: answers.otherBrokerType || null,
        commercial_type: answers.commercialTypes.join(', ') || null,
        commercialtype_other: answers.otherCommercialType || null,
        service_details: answers.serviceDetails,
        tool_details: answers.toolDetails,
        contact_first_name: answers.contactInfo.firstName,
        contact_last_name: answers.contactInfo.lastName,
        contact_email: answers.contactInfo.email,
        contact_phone: answers.contactInfo.phone || null,
        contact_website: answers.contactInfo.website || null,
        contact_location: answers.contactInfo.location || null,
        contact_notes: answers.contactInfo.notes || null,
        source: 'quiz-waitlist-modal',
        start_time: answers.startTiming || null,
      };

      // 1. Insert the main submission record
      const { data, error } = await supabase
        .from('quiz_submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) throw error;

      // 2. Insert the selected types into quiz_submission_types
      if (data && answers.types.length > 0) {
        const typesData = answers.types.map((typeId: string) => ({
          submission_id: data.id,
          type_id: typeId,
        }));

        const { error: typesError } = await supabase
          .from('quiz_submission_types')
          .insert(typesData);

        if (typesError) {
          console.error('Error saving quiz types:', typesError);
        }
      }

      setIsFinished(true);
    } catch (err: any) {
      console.error('Quiz submission error:', err);
      setErrors({ submit: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const currentKey = steps[stepIndex];

    if (currentKey === 'Type') {
      return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">What type(s) of Product or Service are you looking for?</h2>
            <p className="text-sm text-brand-blue font-medium">(Select all that apply)</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {PRODUCT_SERVICE_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  const newTypes = answers.types.includes(type.id)
                    ? answers.types.filter((t: string) => t !== type.id)
                    : [...answers.types, type.id];
                  const automationChoice = newTypes.includes('automation') ? answers.automationChoice : '';
                  setAnswers({ ...answers, types: newTypes, automationChoice });
                }}
                className={`p-3 text-left rounded-lg border-2 transition-all flex items-center justify-between group ${answers.types.includes(type.id)
                  ? 'border-brand-orange bg-brand-orange/5'
                  : 'border-gray-100 hover:border-brand-orange/40 bg-white'
                  }`}
              >
                <div className="flex-1">
                  <span
                    className={`font-semibold text-sm ${answers.types.includes(type.id) ? 'text-brand-orange' : 'text-gray-900'
                      }`}
                  >
                    {type.label}
                  </span>
                  {type.id === 'other' && answers.types.includes('other') && (
                    <input
                      type="text"
                      className="w-full mt-2 p-2 text-sm border-b-2 border-brand-orange/30 focus:border-brand-orange outline-none bg-transparent text-gray-900"
                      placeholder="Please specify..."
                      value={answers.otherType}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setAnswers({ ...answers, otherType: e.target.value })}
                    />
                  )}
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${answers.types.includes(type.id)
                    ? 'border-brand-blue bg-brand-blue text-white'
                    : 'border-gray-200'
                    }`}
                >
                  {answers.types.includes(type.id) && <Check size={14} strokeWidth={4} />}
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentKey === 'AutomationChoice') {
      const options = [
        {
          id: 'tool',
          label: 'Tool',
          desc: 'e.g. AI Agents, ChatBots, Integrations Software (Zapier, n8n, Make.com)',
        },
        {
          id: 'service',
          label: 'Service',
          desc: '(AI & Automations Implementation Specialist)',
        },
        {
          id: 'both',
          label: 'Both',
          desc: 'I need both the software and a specialist to set it up',
        },
      ];
      return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <h2 className="text-xl font-bold text-gray-900">With AI & Workflow Automations are you looking for?</h2>
          <div className="grid grid-cols-1 gap-3">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAnswers({ ...answers, automationChoice: opt.id })}
                className={`p-4 text-left rounded-xl border-2 transition-all group ${answers.automationChoice === opt.id
                  ? 'border-brand-orange bg-brand-orange/5 shadow-sm'
                  : 'border-gray-100 bg-white hover:border-brand-orange/30'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-base font-bold ${answers.automationChoice === opt.id ? 'text-brand-orange' : 'text-gray-900'
                      }`}
                  >
                    {opt.label}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${answers.automationChoice === opt.id
                      ? 'border-brand-orange bg-brand-orange text-white'
                      : 'border-gray-200'
                      }`}
                  >
                    {answers.automationChoice === opt.id && <Check size={12} strokeWidth={4} />}
                  </div>
                </div>
                <p
                  className={`text-sm mt-1 leading-relaxed ${answers.automationChoice === opt.id ? 'text-brand-orange' : 'text-gray-500'
                    }`}
                >
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentKey === 'Size') {
      const options = [
        { id: 'independent', label: 'Independent (1-2 people)' },
        { id: 'small', label: 'Small Team (3 - 6 people)' },
        { id: 'mid', label: 'Mid Size (7 - 10 people)' },
        { id: 'large', label: 'Large (10 + people)' },
      ];
      return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <h2 className="text-xl font-bold text-gray-900">What type of brokerage are you?</h2>
          <div className="grid grid-cols-1 gap-3">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAnswers({ ...answers, brokerageSize: opt.id })}
                className={`p-4 text-center rounded-xl border-2 transition-all font-bold text-sm ${answers.brokerageSize === opt.id
                  ? 'border-brand-orange bg-brand-orange/5 text-brand-orange shadow-sm'
                  : 'border-gray-100 bg-white text-gray-900 hover:border-brand-orange/30'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentKey === 'Aggregator') {
      const brokerTypeOptions = ['Mortgage Broker', 'Asset Finance', 'Commercial Finance', 'Other'];
      const commercialTypeOptions = [
        'Development Finance',
        'SME Lending',
        'Equipment Finance',
        'Cashflow Finance',
        'Commercial Property',
        'Trade Finance',
        'Other',
      ];

      return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Which Aggregator are you with?</h2>
            <div className="relative">
              <select
                value={answers.aggregator}
                onChange={(e) => setAnswers({ ...answers, aggregator: e.target.value })}
                className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg outline-none focus:border-brand-orange hover:border-brand-orange/40 transition-colors appearance-none font-semibold text-gray-900 text-sm"
              >
                <option value="">Select an aggregator...</option>
                {[
                  { value: 'amag', label: 'AMAG' },
                  { value: 'astute', label: 'Astute' },
                  { value: 'aussie_home_loans', label: 'Aussie Home Loans' },
                  { value: 'afg', label: 'Australian Finance Group (AFG)' },
                  { value: 'balmain_nb', label: 'Balmain NB Commercial Mortgages' },
                  { value: 'bernie_lewis', label: 'Bernie Lewis Home Loans' },
                  { value: 'buyers_choice', label: 'Buyers Choice' },
                  { value: 'centrepoint_alliance', label: 'Centrepoint Alliance Lending' },
                  { value: 'choice', label: 'Choice Aggregation' },
                  { value: 'cog', label: 'COG Aggregation' },
                  { value: 'compass', label: 'Compass Aggregation' },
                  { value: 'connective', label: 'Connective' },
                  { value: 'echoice', label: 'eChoice Home Loans' },
                  { value: 'fast', label: 'Finance and Systems Technology (FAST)' },
                  { value: 'finance_king', label: 'Finance King' },
                  { value: 'finconnect', label: 'Finconnect' },
                  { value: 'finsure', label: 'Finsure' },
                  { value: 'lendi', label: 'Lendi Group' },
                  { value: 'liberty_network', label: 'Liberty Network Services' },
                  { value: 'lj_hooker', label: 'LJ Hooker Home Loans' },
                  { value: 'loankit', label: 'Loankit' },
                  { value: 'lmg', label: 'Loan Market Group (LMG)' },
                  { value: 'moneyquest', label: 'MoneyQuest' },
                  { value: 'mortgage_choice', label: 'Mortgage Choice' },
                  { value: 'mortgage_house', label: 'Mortgage House' },
                  { value: 'mortgage_loans_australia', label: 'Mortgage Loans Australia' },
                  { value: 'my_local_broker', label: 'My Local Broker' },
                  { value: 'nmb', label: 'National Mortgage Brokers (nMB)' },
                  { value: 'newco', label: 'NewCo Financial Services' },
                  { value: 'our_broker', label: 'Our Broker' },
                  { value: 'outsource', label: 'Outsource Financial' },
                  { value: 'plan', label: 'PLAN Australia' },
                  { value: 'purple_circle', label: 'Purple Circle Financial Services' },
                  { value: 'smartline', label: 'Smartline' },
                  { value: 'sfg', label: 'Specialist Finance Group (SFG)' },
                  { value: 'sure_harvest', label: 'Sure Harvest Pty' },
                  { value: 'swoop', label: 'Swoop' },
                  { value: 'viking', label: 'Viking' },
                  { value: 'vow', label: 'VOW Financial' },
                  { value: 'other', label: 'Other' },
                ].map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronRight size={20} className="rotate-90 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              What type of Broker are you? <span className="text-sm font-medium text-brand-blue block">(Select all that apply)</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {brokerTypeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    const newTypes = answers.brokerTypes.includes(opt)
                      ? answers.brokerTypes.filter((t: string) => t !== opt)
                      : [...answers.brokerTypes, opt];
                    setAnswers({ ...answers, brokerTypes: newTypes });
                  }}
                  className={`p-3 text-left rounded-lg border-2 transition-all flex items-center justify-between group ${answers.brokerTypes.includes(opt)
                    ? 'border-brand-orange bg-brand-orange/5'
                    : 'border-gray-100 hover:border-brand-orange/40 bg-white'
                    }`}
                >
                  <span className={`font-semibold text-sm ${answers.brokerTypes.includes(opt) ? 'text-brand-orange' : 'text-gray-900'}`}>
                    {opt}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${answers.brokerTypes.includes(opt) ? 'border-brand-orange bg-brand-orange text-white' : 'border-gray-200'
                      }`}
                  >
                    {answers.brokerTypes.includes(opt) && <Check size={12} strokeWidth={4} />}
                  </div>
                </button>
              ))}
            </div>
            {answers.brokerTypes.includes('Other') && (
              <input
                type="text"
                placeholder="Please specify other broker type..."
                value={answers.otherBrokerType}
                onChange={(e) => setAnswers({ ...answers, otherBrokerType: e.target.value })}
                className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg outline-none focus:border-brand-orange hover:border-brand-orange/40 text-gray-900 text-sm transition-colors"
              />
            )}
          </div>

          {answers.brokerTypes.includes('Commercial Finance') && (
            <div className="space-y-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-4">
              <h2 className="text-lg font-bold text-gray-900">
                Subcategory of Commercial Finance <span className="text-sm font-medium text-brand-blue block">(Select all that apply)</span>
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {commercialTypeOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      const newTypes = answers.commercialTypes.includes(opt)
                        ? answers.commercialTypes.filter((t: string) => t !== opt)
                        : [...answers.commercialTypes, opt];
                      setAnswers({ ...answers, commercialTypes: newTypes });
                    }}
                    className={`p-3 text-left rounded-lg border-2 transition-all flex items-center justify-between group ${answers.commercialTypes.includes(opt)
                      ? 'border-brand-orange bg-brand-orange/5'
                      : 'border-gray-100 hover:border-brand-orange/40 bg-white'
                      }`}
                  >
                    <span className={`font-semibold text-sm ${answers.commercialTypes.includes(opt) ? 'text-brand-orange' : 'text-gray-900'}`}>
                      {opt}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${answers.commercialTypes.includes(opt) ? 'border-brand-orange bg-brand-orange text-white' : 'border-gray-200'
                        }`}
                    >
                      {answers.commercialTypes.includes(opt) && <Check size={12} strokeWidth={4} />}
                    </div>
                  </button>
                ))}
              </div>
              {answers.commercialTypes.includes('Other') && (
                <input
                  type="text"
                  placeholder="Please specify other commercial category..."
                  value={answers.otherCommercialType}
                  onChange={(e) => setAnswers({ ...answers, otherCommercialType: e.target.value })}
                  className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg outline-none focus:border-brand-orange hover:border-brand-orange/40 text-gray-900 text-sm transition-colors"
                />
              )}
            </div>
          )}
        </div>
      );
    }

    if (currentKey === 'Stage') {
      const options = [
        { id: 'early', label: 'Early Stage (have kicked-off but no consistent income)' },
        { id: 'started', label: 'Hit the Ground Running (just started and doing ok)' },
        { id: 'growth', label: 'Growth (operating for 1 - 3 years)' },
        { id: 'scaling', label: 'Scaling (operating for 3+ years)' },
      ];
      return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <h2 className="text-xl font-bold text-gray-900">What best describes the stage of your business?</h2>
          <div className="grid grid-cols-1 gap-3">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAnswers({ ...answers, businessStage: opt.id })}
                className={`p-4 text-left rounded-lg border-2 transition-all font-semibold text-sm ${answers.businessStage === opt.id
                  ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                  : 'border-gray-100 bg-white text-gray-900 hover:border-brand-orange/30'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentKey === 'Revenue') {
      const options = [
        'Under $15k / month',
        '$15k - $30k / month',
        '$30k - $60k / month',
        '$60k - $100k / month',
        '$100k+ / month',
      ];
      return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <h2 className="text-xl font-bold text-gray-900">What&apos;s your annual revenue?</h2>
          <div className="grid grid-cols-1 gap-3">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswers({ ...answers, revenue: opt })}
                className={`p-3 rounded-lg border-2 transition-all text-center font-bold text-sm ${answers.revenue === opt
                  ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                  : 'border-gray-100 bg-white text-gray-900 hover:border-brand-orange/30'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentKey.startsWith('service_')) {
      const serviceId = currentKey.replace('service_', '');
      let serviceLabel = PRODUCT_SERVICE_TYPES.find((t) => t.id === serviceId)?.label;
      if (serviceId === 'automation') {
        serviceLabel = 'AI & Automations Implementation Specialist';
      }
      const currentDetails =
        answers.serviceDetails[serviceId] || {
          preference: '',
          location: '',
          offshoreLoc: '',
          budgetAmount: '',
          budgetPeriod: 'monthly',
        };

      return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Do you need this {serviceLabel} to be:</h2>
            <div className="grid grid-cols-1 gap-3 mt-2">
              {[
                { id: 'local', label: 'Local - In Person Meetings' },
                { id: 'offshore', label: 'Offshore - Virtual Meetings' },
                { id: 'remote', label: 'Remote - Virtual meetings mostly', sub: '(but can meet in person if required)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() =>
                    setAnswers({
                      ...answers,
                      serviceDetails: {
                        ...answers.serviceDetails,
                        [serviceId]: { ...currentDetails, preference: opt.id },
                      },
                    })
                  }
                  className={`p-3 rounded-lg border-2 transition-all text-left font-semibold text-sm ${currentDetails.preference === opt.id
                    ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                    : 'border-gray-100 bg-white text-gray-900 hover:border-brand-orange/30'
                    }`}
                >
                  <div className="flex flex-wrap items-center gap-1">
                    <span>{opt.label}</span>
                    {opt.sub && <span className="text-xs italic font-normal text-gray-500">{opt.sub}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {currentDetails.preference === 'local' && (
            <div className="animate-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Specify City/State</label>
              <input
                type="text"
                placeholder="e.g. Sydney, NSW"
                className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg focus:border-brand-orange hover:border-brand-orange/40 outline-none text-gray-900 text-sm transition-colors"
                value={currentDetails.location}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    serviceDetails: {
                      ...answers.serviceDetails,
                      [serviceId]: { ...currentDetails, location: e.target.value },
                    },
                  })
                }
              />
            </div>
          )}

          {currentDetails.preference === 'offshore' && (
            <div className="animate-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Location Preference</label>
              <select
                className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg focus:border-brand-orange hover:border-brand-orange/40 outline-none text-gray-900 text-sm transition-colors"
                value={currentDetails.offshoreLoc}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    serviceDetails: {
                      ...answers.serviceDetails,
                      [serviceId]: { ...currentDetails, offshoreLoc: e.target.value },
                    },
                  })
                }
              >
                <option value="">Select location...</option>
                <option value="Philippines">Philippines</option>
                <option value="Fiji">Fiji</option>
                <option value="India">India</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Do you have a budget for this service?</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</div>
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-lg focus:border-brand-orange outline-none text-sm"
                  value={currentDetails.budgetAmount}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      serviceDetails: {
                        ...answers.serviceDetails,
                        [serviceId]: { ...currentDetails, budgetAmount: e.target.value },
                      },
                    })
                  }
                />
              </div>
              <select
                className="w-32 p-3 bg-white border-2 border-gray-100 rounded-lg focus:border-brand-orange outline-none font-bold text-sm"
                value={currentDetails.budgetPeriod}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    serviceDetails: {
                      ...answers.serviceDetails,
                      [serviceId]: { ...currentDetails, budgetPeriod: e.target.value },
                    },
                  })
                }
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="project">Project</option>
              </select>
            </div>
          </div>
        </div>
      );
    }

    if (currentKey.startsWith('tool_')) {
      const toolId = currentKey.replace('tool_', '');
      let toolLabel = PRODUCT_SERVICE_TYPES.find((t) => t.id === toolId)?.label;
      if (toolId === 'automation') {
        toolLabel = 'AI Agents, ChatBots, or Integrations Software';
      }
      const currentDetails =
        answers.toolDetails[toolId] || { usedBefore: '', experience: '', budgetAmount: '', budgetPeriod: 'monthly' };

      return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Have you used {toolLabel} before?</h2>
            <div className="flex gap-3">
              {['Yes', 'No'].map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    setAnswers({
                      ...answers,
                      toolDetails: {
                        ...answers.toolDetails,
                        [toolId]: { ...currentDetails, usedBefore: opt },
                      },
                    })
                  }
                  className={`flex-1 p-3 rounded-lg border-2 transition-all font-bold text-sm ${currentDetails.usedBefore === opt
                    ? 'border-brand-orange bg-brand-orange/5 text-brand-orange shadow-sm'
                    : 'border-gray-100 bg-white text-gray-900 hover:border-brand-orange/30'
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {currentDetails.usedBefore === 'Yes' && (
            <div className="animate-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Which ones and what was your experience?</label>
              <textarea
                rows={4}
                className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg focus:border-brand-orange hover:border-brand-orange/40 outline-none resize-none text-gray-900 text-sm transition-colors"
                placeholder="Share your experience..."
                value={currentDetails.experience}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    toolDetails: {
                      ...answers.toolDetails,
                      [toolId]: { ...currentDetails, experience: e.target.value },
                    },
                  })
                }
              />
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Do you have a budget for this product?</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</div>
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-lg focus:border-brand-orange outline-none text-sm"
                  value={currentDetails.budgetAmount}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      toolDetails: {
                        ...answers.toolDetails,
                        [toolId]: { ...currentDetails, budgetAmount: e.target.value },
                      },
                    })
                  }
                />
              </div>
              <select
                className="w-32 p-3 bg-white border-2 border-gray-100 rounded-lg focus:border-brand-orange outline-none font-bold text-sm"
                value={currentDetails.budgetPeriod}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    toolDetails: {
                      ...answers.toolDetails,
                      [toolId]: { ...currentDetails, budgetPeriod: e.target.value },
                    },
                  })
                }
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="project">Project</option>
              </select>
            </div>
          </div>
        </div>
      );
    }

    if (currentKey === 'Timeline') {
      const options = [
        'Immediately (within the next 1-2 weeks)',
        'Soon (within the next month)',
        "It's hard to say (depends on a few approvals)",
        'Just exploring my options',
      ];
      return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <h2 className="text-xl font-bold text-gray-900">When would you like to start?</h2>
          <div className="grid grid-cols-1 gap-3">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswers({ ...answers, startTiming: opt })}
                className={`p-4 text-left rounded-lg border-2 transition-all font-semibold text-sm ${answers.startTiming === opt
                  ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                  : 'border-gray-100 bg-white text-gray-900 hover:border-brand-orange/30'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentKey === 'Confirm') {
      return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="border-brand-orange bg-brand-orange/10 rounded-lg text-brand-blue">
              <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Great! Thank you</h2>
          </div>
          <p className="text-gray-600 text-sm">
            We are assessing who might be a good fit for you. Can you confirm the following details about you:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First"
                  value={answers.contactInfo.firstName}
                  onChange={(e) =>
                    setAnswers({ ...answers, contactInfo: { ...answers.contactInfo, firstName: e.target.value } })
                  }
                  className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg text-sm focus:border-brand-orange hover:border-brand-orange/40 outline-none text-gray-900 transition-colors"
                  required
                />
                <input
                  type="text"
                  placeholder="Last"
                  value={answers.contactInfo.lastName}
                  onChange={(e) =>
                    setAnswers({ ...answers, contactInfo: { ...answers.contactInfo, lastName: e.target.value } })
                  }
                  className="w-full p-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg text-sm focus:border-brand-orange hover:border-brand-orange/40 outline-none text-gray-900 transition-colors"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  type="email"
                  value={answers.contactInfo.email}
                  onChange={(e) => {
                    setAnswers({
                      ...answers,
                      contactInfo: { ...answers.contactInfo, email: e.target.value },
                    });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  onBlur={() => {
                    const res = contactInfoSchema.shape.email.safeParse(answers.contactInfo.email);
                    if (!res.success) {
                      setErrors({ ...errors, email: res.error.errors[0].message });
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 ${errors.email ? 'border-red-500' : 'border-gray-100'
                    } rounded-lg text-sm focus:border-brand-orange hover:border-brand-orange/40 outline-none text-gray-900 transition-colors`}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  type="tel"
                  value={answers.contactInfo.phone}
                  onChange={(e) => {
                    setAnswers({
                      ...answers,
                      contactInfo: { ...answers.contactInfo, phone: e.target.value },
                    });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  onBlur={() => {
                    const res = contactInfoSchema.shape.phone.safeParse(answers.contactInfo.phone);
                    if (!res.success) {
                      setErrors({ ...errors, phone: res.error.errors[0].message });
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 ${errors.phone ? 'border-red-500' : 'border-gray-100'
                    } rounded-lg text-sm focus:border-brand-orange hover:border-brand-orange/40 outline-none text-gray-900 transition-colors`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  type="url"
                  value={answers.contactInfo.website}
                  onChange={(e) =>
                    setAnswers({ ...answers, contactInfo: { ...answers.contactInfo, website: e.target.value } })
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-lg text-sm focus:border-brand-orange hover:border-brand-orange/40 outline-none text-gray-900 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Final Notes</label>
              <textarea
                rows={3}
                value={answers.contactInfo.notes}
                onChange={(e) =>
                  setAnswers({ ...answers, contactInfo: { ...answers.contactInfo, notes: e.target.value } })
                }
                className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-lg text-sm focus:border-brand-orange hover:border-brand-orange/40 outline-none resize-none text-gray-900 transition-colors"
                placeholder="Anything else we should know?"
              />
            </div>
          </div>

          <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
            By clicking submit you acknowledge the{' '}
            <a href="/terms" className="text-brand-orange font-bold hover:underline">
              terms and services
            </a>{' '}
            of Broker Tools and give permission for us to share your information accordingly.
          </p>
        </div>
      );
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl shadow-brand-blue/10 text-center animate-in zoom-in-95 duration-500">
          <img
            src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Simba%20Digging%20Profile.png"
            alt="Simba Digging profile"
            className="w-20 h-20 rounded-full object-contain mx-auto mb-6 border-2 border-brand-green/30 shadow bg-white"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">You're All Set!</h2>
          <p className="text-gray-600 leading-relaxed mb-6 text-sm">
            We are digging for the right products and services for you. In a short moment an email will be sent confirming your enquiry and some suggested providers for you.
          </p>
          <button
            onClick={() => {
              onClose();
              router.push('/');
            }}
            className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 text-sm"
          >
            Return Home <ExternalLink size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-8 px-3 relative">
      {isWhyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-brand-blue/10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-blue text-white rounded-md">
                  <Info size={18} />
                </div>
                <h3 className="text-base font-bold text-brand-blue">Why We Ask This Question</h3>
              </div>
              <button onClick={() => setIsWhyModalOpen(false)} className="text-brand-blue/70 hover:text-brand-blue transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm text-gray-600 leading-relaxed">
                We use your responses to match you with relevant tools or service providers on Broker Tools, based on your current circumstances.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your data is not sold or shared with aggregators or unrelated third parties, for more details see our{' '}
                <a href="/privacy" className="text-brand-orange font-bold hover:underline">
                  Privacy Policy
                </a>
                . Your details are only forwarded to providers you have explicitly consented for us to contact on your behalf.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Some providers pay us a commission or affiliate fee at no additional cost to you, which helps support and maintain our services. While we aim to remain impartial and technology-agnostic, we may prioritise certain products or services that have consistently delivered strong outcomes.
              </p>
              <button
                onClick={() => setIsWhyModalOpen(false)}
                className="w-full mt-2 py-2.5 bg-brand-blue text-white rounded-lg font-bold hover:bg-brand-blue/90 transition-colors text-sm"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-xl w-full">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="text-sm font-bold text-gray-400 hover:text-gray-900 flex items-center gap-2"
            >
              <ChevronLeft size={16} /> Exit Quiz
            </button>
            <span className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full uppercase tracking-wider">
              Step {stepIndex + 1} of {steps.length}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-blue transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-brand-blue/5 border border-gray-100 min-h-[420px] flex flex-col">
          <div className="flex-grow">{renderStep()}</div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsWhyModalOpen(true)}
              className="text-[11px] font-bold text-brand-blue hover:text-brand-blue/90 hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue/10 rounded-full transition-all"
            >
              <Info size={12} /> Why we ask this question
            </button>
          </div>

          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-[11px] font-bold rounded-lg border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <X size={14} className="shrink-0" />
              {errors.submit}
            </div>
          )}

          <div className="flex items-center gap-3 mt-5 pt-6 border-t border-gray-50">
            {stepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="flex-1 py-3 px-5 border-2 border-gray-100 rounded-lg font-bold text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ChevronLeft size={20} /> Previous
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSubmitting || isCurrentStepIncomplete}
              className={`flex-[2] py-3 px-5 rounded-lg font-bold text-white shadow-lg shadow-brand-orange/30 flex items-center justify-center gap-2 transition-all text-sm ${isSubmitting || isCurrentStepIncomplete
                ? 'bg-brand-orange/60 cursor-not-allowed'
                : 'bg-brand-orange hover:bg-orange-600 hover:scale-[1.01] active:scale-95'
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Analyzing...
                </>
              ) : (
                <>
                  {stepIndex === steps.length - 1 ? 'Get My Recommendations' : 'Next'}
                  {stepIndex === steps.length - 1 ? <Send size={18} /> : <ChevronRight size={20} />}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5 font-medium">
            <Sparkles size={12} className="text-brand-blue" /> Powered by Broker Tools AI Engine
          </p>
        </div>
      </div>
    </div>
  );
}

export function QuizWaitlistModal({ children }: QuizWaitlistModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0 bg-transparent border-none">
        <DialogTitle className="sr-only">Quiz Waitlist</DialogTitle>
        <QuizBody onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
