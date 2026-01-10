'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import Script from 'next/script';

interface SubscribeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SubscribeModal({
    open,
    onOpenChange,
}: SubscribeModalProps) {
    // HubBoss form embed script will handle the form


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[720px] bg-white border-brand-blue/10 p-0 overflow-hidden">
                <div className="p-6">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <img
                                src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/BrokerTools%20Icon.png"
                                alt="BrokerTools"
                                className="h-16 w-16 rounded-xl object-contain bg-white p-1 shadow-sm"
                            />
                            <div>
                                <DialogTitle className="text-2xl font-bold text-brand-blue">Subscribe to BrokerTools</DialogTitle>
                                <DialogDescription className="text-brand-blue/70">
                                    Get the latest tools, software reviews, and industry insights delivered straight to your inbox.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="min-h-[350px] w-full bg-white">
                    <iframe
                        src="https://link.hubboss.io/widget/form/La2mpDKaSorBUETyReae"
                        style={{ width: '100%', height: '100%', border: 'none', borderRadius: '3px' }}
                        id="inline-La2mpDKaSorBUETyReae"
                        data-layout="{'id':'INLINE'}"
                        data-trigger-type="alwaysShow"
                        data-trigger-value=""
                        data-activation-type="alwaysActivated"
                        data-activation-value=""
                        data-deactivation-type="neverDeactivate"
                        data-deactivation-value=""
                        data-form-name="Broker Tools"
                        data-height="350"
                        data-layout-iframe-id="inline-La2mpDKaSorBUETyReae"
                        data-form-id="La2mpDKaSorBUETyReae"
                        title="Broker Tools"
                    ></iframe>
                    <Script
                        src="https://link.hubboss.io/js/form_embed.js"
                        strategy="afterInteractive"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
