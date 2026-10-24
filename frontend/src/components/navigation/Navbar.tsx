import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TourLynkLogo } from '../../assets/logo/TourLynkLogo';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Menu, X, User as UserIcon, Calendar, Heart, Shield, LogOut, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/vehicles?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Vehicles', path: '/vehicles' },
    { name: 'Explore Sri Lanka', path: '/destinations' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-tourlynk-navy/95 backdrop-blur-md shadow-lg py-3 border-b border-white/10'
          : 'bg-gradient-to-b from-tourlynk-dark/90 via-tourlynk-dark/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <TourLynkLogo variant="light" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-tourlynk-gold font-semibold'
                      : 'text-gray-200 hover:text-tourlynk-gold'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-tourlynk-gold rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Icon Trigger */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-48 bg-white/15 text-white placeholder-gray-300 text-xs rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-tourlynk-gold border border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-1 text-gray-300 hover:text-white text-xs p-1"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-200 hover:text-tourlynk-gold transition-colors rounded-full hover:bg-white/10"
                  title="Search vehicles"
                  aria-label="Search vehicles"
                >
                  <Search size={19} />
                </button>
              )}
            </div>

            {/* Authentication Buttons / User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/20 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-tourlynk-gold text-tourlynk-navy flex items-center justify-center font-bold text-xs uppercase">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate">{user.fullName.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100 text-tourlynk-textDark animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">{user.fullName}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-tourlynk-deepTeal text-white text-[10px] font-bold rounded-full">
                          ADMINISTRATOR
                        </span>
                      )}
                    </div>

                    <Link
                      to="/bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-gray-50 font-medium"
                    >
                      <Calendar size={15} className="text-tourlynk-deepTeal" />
                      My Bookings
                    </Link>

                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-gray-50 font-medium"
                    >
                      <Heart size={15} className="text-rose-500" />
                      Saved Vehicles
                    </Link>

                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-gray-50 font-medium"
                    >
                      <UserIcon size={15} className="text-gray-500" />
                      Profile Settings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-tourlynk-goldLight text-tourlynk-navy font-semibold border-t border-gray-100"
                      >
                        <Shield size={15} className="text-tourlynk-goldDark" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium text-left"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth/login"
                  className="text-xs font-semibold text-white hover:text-tourlynk-gold px-4 py-2 rounded-full border border-white/20 hover:border-tourlynk-gold transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="text-xs font-bold bg-tourlynk-gold hover:bg-tourlynk-goldHover text-tourlynk-navy px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 rounded-md hover:bg-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-tourlynk-navy border-b border-white/10 px-4 pt-3 pb-6 space-y-4 shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-gray-400 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-tourlynk-gold"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-300">
              <Search size={18} />
            </button>
          </form>

          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-tourlynk-deepTeal text-tourlynk-gold font-bold'
                    : 'text-gray-200 hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-bold bg-tourlynk-gold/20 text-tourlynk-gold"
              >
                🛡 Admin Dashboard
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col space-y-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-gray-200 hover:bg-white/5 rounded-lg flex items-center gap-2"
                >
                  <Calendar size={16} /> My Bookings
                </Link>
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-gray-200 hover:bg-white/5 rounded-lg flex items-center gap-2"
                >
                  <UserIcon size={16} /> Profile & Saved
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="px-3 py-2 text-sm text-rose-400 hover:bg-white/5 rounded-lg text-left flex items-center gap-2"
                >
                  <LogOut size={16} /> Sign Out ({user.fullName.split(' ')[0]})
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-white border border-white/20 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-bold bg-tourlynk-gold text-tourlynk-navy rounded-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
