"use client";

import { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";

export default function BetaConsentModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already acknowledged beta status
        const hasConsented = localStorage.getItem("betaConsent");

        // Slight delay to ensure hydration match and smooth entry
        if (!hasConsented) {
            setIsOpen(true);
            setTimeout(() => setIsVisible(true), 100);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("betaConsent", "true");
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 300);
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div
                className={`w-full max-w-lg mx-4 rounded-2xl bg-brand-blue p-6 shadow-2xl relative overflow-hidden transition-all duration-300 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
            >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-orange to-white" />

                <div className="mb-6 flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-brand-orange">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">
                            WELCOME TO BROKER TOOLS...
                        </h2>
                        <div className="space-y-3 text-sm text-white/90 leading-relaxed">
                            <p>
                                we are <strong>Beta Testing</strong>!
                            </p>
                            <p>
                                By entering into this site you acknowledge, that AI may make errors and you may encounter occassional bugs or incomplete features.
                            </p>
                            <p>
                                If this is the case, please let us know - via the contact us form - found in the footer of our site.<br /><br /> We also welcome your ideas, suggestions or ways we can make this better.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        onClick={handleAccept}
                        className="flex-1 rounded-lg bg-brand-orange px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20"
                    >
                        I Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
