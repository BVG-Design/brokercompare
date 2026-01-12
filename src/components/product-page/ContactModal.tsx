'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ContactModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    businessName: string;
    logoUrl?: string | null;
}

const COMPANY_SIZES = [
    '1-5',
    '6-20',
    '21-50',
    '51-200',
    '201+'
];

const ROLES = [
    'Owner/Principal',
    'Broker',
    'Operations/Admin',
    'IT/Technology',
    'Marketing',
    'Other'
];

const BROKER_TYPES = [
    'Mortgage Broker',
    'Asset Finance',
    'Commercial Finance',
    'Other'
];

const AGGREGATORS = [
    'AMAG',
    'Astute',
    'Aussie Home Loans',
    'AFG',
    'Connective',
    'Finsure',
    'LMG',
    'Liberty Network Services',
    'Mortgage Choice',
    'PLAN Australia',
    'SFG',
    'VOW Financial',
    'Other'
];

export default function ContactModal({ open, onOpenChange, businessName, logoUrl }: ContactModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [selectedBrokerTypes, setSelectedBrokerTypes] = useState<string[]>([]);
    const [selectedAggregator, setSelectedAggregator] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate submission
        setTimeout(() => {
            setIsLoading(false);
            onOpenChange(false);
            alert('Form submitted successfully! (Mock)');
        }, 1500);
    };

    const toggleBrokerType = (type: string) => {
        setSelectedBrokerTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const inputClasses = "h-10 border-slate-400 focus-visible:ring-0 focus-visible:border-brand-orange focus:border-brand-orange focus:ring-0 rounded-md bg-white text-slate-900 transition-colors";
    const selectTriggerClasses = "h-10 border-slate-400 focus:ring-0 focus:border-brand-orange focus-visible:ring-0 focus-visible:border-brand-orange rounded-md bg-white text-slate-900 transition-colors";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden p-0 border-none rounded-md">
                <div className="flex flex-col h-full bg-white max-h-[90vh]">
                    <div className="p-5 md:p-7 border-b border-slate-100 flex-shrink-0">
                        <DialogHeader className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-white border border-slate-100 rounded-md flex items-center justify-center p-3 shadow-md">
                                    {logoUrl && !imageError ? (
                                        <img
                                            src={logoUrl}
                                            alt={`${businessName} logo`}
                                            className="w-full h-full object-contain"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className="text-primary font-bold text-3xl">{businessName?.charAt(0) || 'B'}</div>
                                    )}
                                </div>
                            </div>
                            <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight mb-2 text-center">
                                Request to be contacted
                            </DialogTitle>
                            <DialogDescription className="text-base text-slate-700 text-center">
                                {businessName} may contact you regarding your request
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 md:px-10 md:pb-10 md:pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <p className="text-sm text-slate-700 font-medium pb-2 border-b border-slate-100">
                                Fields marked with an asterisk (<span className="text-red-500">*</span>) are required
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700">First Name<span className="text-red-500 ml-0.5">*</span></Label>
                                    <Input id="firstName" required className={inputClasses} placeholder="Jane" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700">Last Name<span className="text-red-500 ml-0.5">*</span></Label>
                                    <Input id="lastName" required className={inputClasses} placeholder="Doe" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Business Email<span className="text-red-500 ml-0.5">*</span></Label>
                                    <Input id="email" type="email" required className={inputClasses} placeholder="jane@company.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone Number</Label>
                                    <Input id="phone" className={inputClasses} placeholder="+61" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="company" className="text-sm font-semibold text-slate-700">Company<span className="text-red-500 ml-0.5">*</span></Label>
                                    <Input id="company" required className={inputClasses} placeholder="Company Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="companySize" className="text-sm font-semibold text-slate-700">Company Size<span className="text-red-500 ml-0.5">*</span></Label>
                                    <Select required>
                                        <SelectTrigger className={selectTriggerClasses}>
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COMPANY_SIZES.map(size => (
                                                <SelectItem key={size} value={size}>{size}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-sm font-semibold text-slate-700">Role / Team Function<span className="text-red-500 ml-0.5">*</span></Label>
                                    <Select required>
                                        <SelectTrigger className={selectTriggerClasses}>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ROLES.map(role => (
                                                <SelectItem key={role} value={role}>{role}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="aggregator" className="text-sm font-semibold text-slate-700">Aggregator<span className="text-red-500 ml-0.5">*</span></Label>
                                    <Select required onValueChange={setSelectedAggregator}>
                                        <SelectTrigger className={selectTriggerClasses}>
                                            <SelectValue placeholder="Select aggregator" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {AGGREGATORS.map(agg => (
                                                <SelectItem key={agg} value={agg}>{agg}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {selectedAggregator === 'Other' && (
                                <div className="space-y-2">
                                    <Label htmlFor="otherAggregator" className="text-sm font-semibold text-slate-700">Aggregator Details<span className="text-red-500 ml-0.5">*</span></Label>
                                    <Input id="otherAggregator" required className={inputClasses} placeholder="Please specify your aggregator" />
                                </div>
                            )}

                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-slate-700">Broker Type (Select all that apply)<span className="text-red-500 ml-0.5">*</span></Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {BROKER_TYPES.map(type => (
                                        <Label
                                            key={type}
                                            className={`flex items-center space-x-3 p-3 rounded-md border transition-all cursor-pointer ${selectedBrokerTypes.includes(type)
                                                ? 'border-brand-orange bg-brand-orange/5 shadow-sm'
                                                : 'border-slate-400 bg-white hover:border-brand-orange/50'
                                                }`}
                                        >
                                            <Checkbox
                                                id={`type-${type}`}
                                                checked={selectedBrokerTypes.includes(type)}
                                                onCheckedChange={() => toggleBrokerType(type)}
                                                className="border-slate-400 data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange focus-visible:ring-0"
                                            />
                                            <span className={`text-sm font-medium ${selectedBrokerTypes.includes(type) ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {type}
                                            </span>
                                        </Label>
                                    ))}
                                </div>
                            </div>

                            {selectedBrokerTypes.includes('Other') && (
                                <div className="space-y-2">
                                    <Label htmlFor="otherBrokerType" className="text-sm font-semibold text-slate-700">Broker Type Details<span className="text-red-500 ml-0.5">*</span></Label>
                                    <Input id="otherBrokerType" required className={inputClasses} placeholder="Please specify your broker type" />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="website" className="text-sm font-semibold text-slate-700">Website</Label>
                                <Input id="website" className={inputClasses} placeholder="www.yourwebsite.com" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-sm font-semibold text-slate-700">Message</Label>
                                <Textarea
                                    id="message"
                                    className="min-h-[100px] border-slate-400 focus-visible:ring-0 focus-visible:border-brand-orange focus:border-brand-orange focus:ring-0 rounded-md resize-none bg-white text-slate-900 transition-colors"
                                    placeholder="Tell us about your needs..."
                                />
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-start space-x-3">
                                    <Checkbox id="terms" required className="mt-1 border-slate-700 data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange focus-visible:ring-0" />
                                    <Label htmlFor="terms" className="text-[13px] leading-snug text-slate-700 font-normal">
                                        I agree to the <a href="#" className="underline hover:text-brand-orange transition-colors">Broker Tools Terms & Conditions</a> and <a href="#" className="underline hover:text-brand-orange transition-colors">Privacy Policy</a>.
                                    </Label>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Checkbox id="marketing" className="mt-1 border-slate-700 data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange focus-visible:ring-0" />
                                    <Label htmlFor="marketing" className="text-[13px] leading-snug text-slate-600 font-normal">
                                        By submitting this form, I consent to Broker Tools storing and processing my personal information to provide platform access, resources, and related communications. I also agree to receive communication, product updates, insights, and occasional marketing from <span className="font-semibold text-slate-600">{businessName}</span>. I understand that I can unsubscribe at any time.
                                    </Label>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={isLoading || selectedBrokerTypes.length === 0}
                                    className="w-full h-10 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-md shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                                >
                                    {isLoading ? 'Sending...' : `Contact ${businessName}`}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
