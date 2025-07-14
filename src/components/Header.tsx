import React, { useState } from 'react';
import { Search, Menu, X, User, LogIn, UserPlus, BookOpen, TrendingUp, Info, Mail } from 'lucide-react';

interface HeaderProps {
  onAuthClick: (type: 'login' | 'register') => void;
  isAuthenticated?: boolean;
  user?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onAuthClick, 
  isAuthenticated = false, 
  user = null,
  onLogout 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Trend Analysis', href: '#trends', icon: TrendingUp },
    { name: 'Blog', href: '#blog', icon: BookOpen },
    { name: 'About', href: '#about', icon: Info },
    { name: 'Contact', href: '#contact', icon: Mail },
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={32} />
              <span className="text-2xl font-bold text-gray-900">CHENDING</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <item.icon size={16} />
                {item.name}
              </a>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <User size={16} />
                  {user.name}
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                      {user.email}
                    </div>
                    <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile Settings
                    </a>
                    <a href="#dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </a>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => onAuthClick('login')}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogIn size={16} />
                  Sign In
                </button>
                <button
                  onClick={() => onAuthClick('register')}
                  className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <UserPlus size={16} />
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={16} />
                  {item.name}
                </a>
              ))}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {user.name} ({user.email})
                    </div>
                    <a href="#profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                      Profile Settings
                    </a>
                    <a href="#dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                      Dashboard
                    </a>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onAuthClick('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <LogIn size={16} />
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        onAuthClick('register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <UserPlus size={16} />
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};