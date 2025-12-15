import React from 'react';
import { LayoutDashboard, RefreshCcw, MoreHorizontal, Share2, Filter } from 'lucide-react';

interface NavbarProps {
    onNavigateHome?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigateHome }) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between text-sm sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <div 
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer"
            onClick={onNavigateHome}
        >
          <LayoutDashboard size={16} />
          <span className="font-medium">Dashboard</span>
        </div>
        <div className="h-4 w-px bg-gray-300"></div>
        <div className="px-3 py-1 bg-gray-100 rounded-md font-medium text-gray-700">Preview</div>
        <div 
            className="flex items-center space-x-1 text-gray-600 cursor-pointer hover:text-gray-900"
            onClick={onNavigateHome}
        >
            <span>ProductReview</span>
            <span className="text-xs">v1.2</span>
        </div>
        <div className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <RefreshCcw size={14} />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
            <MoreHorizontal size={18} />
        </button>
        <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
            <Filter size={18} />
        </button>
        <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
            <Share2 size={18} />
        </button>
        <button className="bg-black text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors">
            Publish
        </button>
      </div>
    </nav>
  );
};

export default Navbar;