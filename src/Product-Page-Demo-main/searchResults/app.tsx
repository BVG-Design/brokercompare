import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DirectoryCard from './components/DirectoryCard';
import MainCard from './components/MainCard';
import InfoGrid from './components/InfoGrid';
import RelatedArticles from './components/RelatedArticles';
import ProvidersSection from './components/ProvidersSection';
import SimpleComparison from './components/SimpleComparison';
import DetailedComparison from './components/DetailedComparison';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import ReviewFormModal from './components/ReviewFormModal';
import AdminDashboard from './components/AdminDashboard';
import BrokerDashboard from './components/BrokerDashboard';
import VendorDashboard from './components/VendorDashboard';
import TrainingMaterial from './components/TrainingMaterial';
import ApplyVendor from './components/ApplyVendor';
import Quiz from './components/Quiz';
import PricingSection from './components/PricingSection';
import ResourceCards from './components/ResourceCards';
import { Filter, Grid, List as ListIcon, SlidersHorizontal, Scale, X } from 'lucide-react';

type PageView = 'home' | 'product-detail' | 'compare' | 'admin' | 'broker' | 'vendor' | 'apply' | 'quiz';

const DIRECTORY_LISTINGS = [
    {
        id: 'clickup',
        name: 'ClickUp',
        type: 'Software',
        tagline: 'The one app to replace them all.',
        description: 'A comprehensive productivity platform that handles task management, docs, goals, and team collaboration in one central hub. Highly modular and customizable for complex workflows.',
        rating: 4.7,
        reviews: 8542,
        priceRange: '$0 - $29 /mo',
        pricingType: 'Freemium',
        features: ['AI Document OCR', 'Automated Follow-ups', 'Broker Dashboard', 'Compliance Guardrails', 'Integrations Hub', 'Sprints'],
        logo: 'https://www.google.com/s2/favicons?domain=clickup.com&sz=128',
        badges: ['🥇 Leader', '⚡ High Performer']
    },
    {
        id: 'monday',
        name: 'Monday.com',
        type: 'Software',
        tagline: 'A visual way to manage everything.',
        description: 'A cloud-based work management platform that allows teams to create custom workflow apps. Excels in visual project tracking and simple automation setup for non-technical teams.',
        rating: 4.6,
        reviews: 5120,
        priceRange: '$9 - $50 /mo',
        pricingType: 'Paid Monthly',
        features: ['Visual Boards', 'Gantt Charts', 'Sales CRM', 'Inventory Tracking', 'Webhook support', 'Dashboards'],
        logo: 'https://www.google.com/s2/favicons?domain=monday.com&sz=128',
        badges: ['🚀 Market Leader']
    },
    {
        id: 'process-pro',
        name: 'ProcessPro Consulting',
        type: 'Service',
        tagline: 'Expert workflow design for brokers.',
        description: 'Boutique consulting firm focused on productivity tool implementation for mid-sized brokerages. We specialize in mapping your manual processes to digital tools like ClickUp and Monday.',
        rating: 4.9,
        reviews: 156,
        priceRange: '$500 - $5k',
        pricingType: 'Project Based',
        features: ['Workflow Mapping', 'Tool Selection', 'Team Onboarding', 'Automation Support', 'CRM Cleanup', 'Training'],
        logo: 'https://www.google.com/s2/favicons?domain=processpro.com&sz=128',
        badges: ['💎 Expert Choice']
    },
    {
        id: 'va-masters',
        name: 'VA Masters',
        type: 'Service',
        tagline: 'Scale with world-class support.',
        description: 'Premium offshore virtual assistant services specialized in loan processing and credit analysis for Australian mortgage brokers. Vetted talent with industry knowledge.',
        rating: 4.8,
        reviews: 320,
        priceRange: '$1.2k - $2k /mo',
        pricingType: 'Subscription',
        features: ['Credit Analysis', 'Doc Collection', 'Lender Liaison', 'CRM Management', 'Compliance Check', 'Email Management'],
        logo: 'https://www.google.com/s2/favicons?domain=vamasters.com&sz=128',
        badges: ['🛡️ Trusted Partner']
    }
];

function App() {
    const [activePage, setActivePage] = useState<PageView>('home');
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [compareIds, setCompareIds] = useState<string[]>([]);

    const [isVendorUpgraded, setIsVendorUpgraded] = useState(false);
    const [isAdminEnabled, setIsAdminEnabled] = useState(false);
    const [featureAuditInProgress, setFeatureAuditInProgress] = useState(false);

    const navigateToHome = () => {
        window.scrollTo(0, 0);
        setActivePage('home');
        setSelectedProductId(null);
    };

    const navigateToProduct = (id: string) => {
        window.scrollTo(0, 0);
        setSelectedProductId(id);
        setActivePage('product-detail');
    };

    const navigateTo = (page: PageView) => {
        window.scrollTo(0, 0);
        setActivePage(page);
    };

    const toggleCompare = (id: string) => {
        setCompareIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(i => i !== id);
            }
            if (prev.length >= 3) {
                return prev; // Limit to 3
            }
            return [...prev, id];
        });
    };

    const clearCompare = () => setCompareIds([]);

    const handleWriteReviewClick = () => {
        if (isLoggedIn) {
            setIsReviewModalOpen(true);
        } else {
            setIsLoginModalOpen(true);
        }
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
    };

    const renderHomeContent = () => (
        <>
            <HeroSection />
            <div className="bg-[#f8fafc] py-12 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Filters Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                            {['All', 'Software', 'Service', 'Products'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-gray-900 text-white border-gray-900 shadow-xl' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all">
                                <SlidersHorizontal size={14} /> Filter
                            </button>
                            <div className="h-6 w-px bg-gray-200"></div>
                            <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <ListIcon size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Grid size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Listings Container */}
                    <div className={`mb-20 ${viewMode === 'list' ? 'space-y-8' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                        {DIRECTORY_LISTINGS.filter(l => activeCategory === 'All' || l.type === activeCategory).map(listing => (
                            <DirectoryCard
                                key={listing.id}
                                {...listing}
                                viewMode={viewMode}
                                onViewDetails={() => navigateToProduct(listing.id)}
                                isComparing={compareIds.includes(listing.id)}
                                onToggleCompare={() => toggleCompare(listing.id)}
                                disableCompare={!compareIds.includes(listing.id) && compareIds.length >= 3}
                            />
                        ))}
                    </div>

                    <RelatedArticles />
                    <CallToAction onTakeQuiz={() => navigateTo('quiz')} />
                    <ProvidersSection />
                    <ResourceCards />
                </div>
            </div>

            {/* Floating Compare Bar */}
            {compareIds.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-8 duration-300">
                    <div className="bg-gray-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-8 border border-gray-800 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-600 rounded-xl">
                                <Scale size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Comparing</p>
                                <p className="text-sm font-black">{compareIds.length} / 3 Items</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {compareIds.map(id => {
                                const item = DIRECTORY_LISTINGS.find(l => l.id === id);
                                return (
                                    <div key={id} className="w-8 h-8 rounded-lg bg-white p-1 relative group overflow-hidden">
                                        <img src={item?.logo} alt={item?.name} className="w-full h-full object-contain" />
                                        <button
                                            onClick={() => toggleCompare(id)}
                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} className="text-white" />
                                        </button>
                                    </div>
                                );
                            })}
                            {compareIds.length < 3 && (
                                <div className="w-8 h-8 rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-600">
                                    <Plus size={14} />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={clearCompare}
                                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => navigateTo('compare')}
                                className="bg-white text-gray-900 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-100 transition-all active:scale-95"
                            >
                                Compare Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    const renderProductDetail = () => {
        return (
            <main className="flex-grow pt-32 bg-[#f8fafc]">
                <MainCard
                    onWriteReview={handleWriteReviewClick}
                    featureAuditInProgress={featureAuditInProgress}
                />
                <InfoGrid onWriteReview={handleWriteReviewClick} />
                {isVendorUpgraded && isAdminEnabled && (
                    <TrainingMaterial businessName="ClickUp" />
                )}
                <PricingSection />
                <DetailedComparison onBack={navigateToHome} />
                <CallToAction onTakeQuiz={() => navigateTo('quiz')} />
            </main>
        );
    };

    const renderContent = () => {
        switch (activePage) {
            case 'admin':
                return <AdminDashboard onToggleTraining={() => setIsAdminEnabled(!isAdminEnabled)} isEnabled={isAdminEnabled} />;
            case 'broker':
                return <BrokerDashboard />;
            case 'vendor':
                return (
                    <VendorDashboard
                        onUpgrade={() => setIsVendorUpgraded(true)}
                        isUpgraded={isVendorUpgraded}
                        isTrainingPublic={isAdminEnabled}
                    />
                );
            case 'apply':
                return <ApplyVendor onBack={navigateToHome} isLoggedIn={isLoggedIn} />;
            case 'quiz':
                return <Quiz onBack={navigateToHome} isLoggedIn={isLoggedIn} />;
            case 'compare':
                return <main className="flex-grow bg-gray-50/50 pt-8"><DetailedComparison onBack={navigateToHome} /></main>;
            case 'product-detail':
                return renderProductDetail();
            case 'home':
            default:
                return renderHomeContent();
        }
    };

    return (
        <div className="min-h-screen flex flex-col selection:bg-purple-100 selection:text-purple-900">
            <Navbar
                onNavigateHome={navigateToHome}
                isLoggedIn={isLoggedIn}
                onLogin={() => setIsLoginModalOpen(true)}
                onLogout={() => setIsLoggedIn(false)}
                onNavigateAdmin={() => navigateTo('admin')}
                onNavigateBroker={() => navigateTo('broker')}
                onNavigateVendor={() => navigateTo('vendor')}
                onNavigateApply={() => navigateTo('apply')}
            />

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            <ReviewFormModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={(data) => { console.log(data); setIsReviewModalOpen(false); alert('Review submitted!'); }}
            />

            {renderContent()}

            <Footer onNavigateApply={() => navigateTo('apply')} />
        </div>
    );
}

// Small helper for the compare bar
const Plus = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default App;