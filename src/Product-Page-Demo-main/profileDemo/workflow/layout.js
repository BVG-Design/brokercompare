import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { LayoutGrid, Settings, HelpCircle } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Minimal Top Bar */}
      <nav className="fixed top-0 left-0 right-0 h-0 z-50">
        {/* Navigation is embedded in pages for this app */}
      </nav>
      
      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}