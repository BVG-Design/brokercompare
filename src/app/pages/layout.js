
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { PlusCircle, ChevronDown, LogOut, LayoutDashboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const isAdmin = user?.role === 'admin';

  const navigation = [
    { name: 'AI Automations', href: createPageUrl('BrowsePartners?category=ai_automations') },
    { name: 'CRMs & Fact Finds', href: createPageUrl('BrowsePartners?category=crm_systems') },
    { name: 'VA Services', href: createPageUrl('BrowsePartners?category=va_services') },
    { name: 'Marketing & Sales', href: createPageUrl('BrowsePartners?category=marketing_services') },
    { name: 'Directory', href: createPageUrl('BrowsePartners') },
    { name: 'Podcast', href: createPageUrl('Blog') },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <style>{`
        :root {
          --primary: #132847;
          --secondary: #ef4e23;
          --accent: #05d8b5;
          --light: #fffff0;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#132847] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690717ccaa7e24fa00fbe980/fcce34b4a_BTLong.png"
                alt="Broker 360"
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all text-white hover:bg-white/10"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-3">
              {!user ? (
                <Button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="bg-white text-[#132847] hover:bg-gray-100"
                >
                  Sign In
                </Button>
              ) : (
                <>
                  <Link to={createPageUrl('ApplyPartner')}>
                    <Button className="bg-[#ef4e23] hover:bg-[#d63d15] text-white">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      List Your Business
                    </Button>
                  </Link>
                  
                  {/* Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white hover:bg-white/10 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#05d8b5] flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-2 py-1.5 text-sm font-semibold">{user.full_name || user.email}</div>
                      <DropdownMenuSeparator />
                      {isAdmin ? (
                        <>
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl('AdminDashboard')} className="flex items-center cursor-pointer">
                              <LayoutDashboard className="w-4 h-4 mr-2" />
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl('PartnerDashboard')} className="flex items-center cursor-pointer">
                              <LayoutDashboard className="w-4 h-4 mr-2" />
                              Partner Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={() => base44.auth.logout()} className="cursor-pointer text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>

            {/* Mobile menu - simplified for now */}
            <div className="lg:hidden">
              <Button
                onClick={() => base44.auth.redirectToLogin()}
                size="sm"
                className="bg-white text-[#132847] hover:bg-gray-100"
              >
                Menu
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#132847] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690717ccaa7e24fa00fbe980/fcce34b4a_BTLong.png"
                  alt="Broker 360"
                  className="h-10 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-gray-300 mb-4 text-sm">
                Connecting brokers with the right products, software, and services to optimize their workflow.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><Link to={createPageUrl('BrowsePartners')} className="hover:text-[#05d8b5] transition-colors">Browse Directory</Link></li>
                <li><Link to={createPageUrl('Blog')} className="hover:text-[#05d8b5] transition-colors">Podcast</Link></li>
                <li><Link to={createPageUrl('ApplyPartner')} className="hover:text-[#05d8b5] transition-colors">List Your Business</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-[#05d8b5] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#05d8b5] transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-[#05d8b5] transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Engage</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="mailto:hello@brokertools.com" className="hover:text-[#05d8b5] transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#05d8b5] transition-colors">Partner With Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 BrokerTools. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
