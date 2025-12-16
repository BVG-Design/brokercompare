import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MainCard from './components/MainCard';
import InfoGrid from './components/InfoGrid';
import Testimonials from './components/Testimonials';
import ProvidersSection from './components/ProvidersSection';
import SimpleComparison from './components/SimpleComparison';
import DetailedComparison from './components/DetailedComparison';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

function App() {
  const [activePage, setActivePage] = useState<'product' | 'compare'>('product');

  const navigateToCompare = () => {
      window.scrollTo(0, 0);
      setActivePage('compare');
  };

  const navigateToHome = () => {
      window.scrollTo(0, 0);
      setActivePage('product');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigateHome={navigateToHome} />
      
      {activePage === 'product' ? (
          <>
            <HeroSection />
            <main className="flex-grow">
                <MainCard />
                <InfoGrid />
                <Testimonials />
                <CallToAction />
                <SimpleComparison onNavigate={navigateToCompare} />
                <ProvidersSection />
            </main>
          </>
      ) : (
          <main className="flex-grow bg-gray-50/50 pt-8">
              <DetailedComparison onBack={navigateToHome} />
              <CallToAction />
          </main>
      )}

      <Footer />
    </div>
  );
}

export default App;