import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Cars', href: '/cars' },
    { name: 'Bookings', href: '/bookings', requiresAuth: true },
    { name: 'Support', href: '/support' }
  ];

  const filteredNavigation = navigation.filter(item => 
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-[#E5E5E5]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-[#0B132B] to-[#1C2541] rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0B132B]">Beta Car Hire</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-[#D4AF37]'
                    : 'text-[#0B132B] hover:text-[#D4AF37]'
                }`}
              >
                {item.name}
                {location.pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D4AF37]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-[#0B132B] hover:text-[#D4AF37] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0B132B] to-[#1C2541] flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#0B132B]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-[#E5E5E5]/20"
        >
          <div className="px-4 py-4 space-y-4">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 text-sm font-medium ${
                  location.pathname === item.href
                    ? 'text-[#D4AF37]'
                    : 'text-[#0B132B]'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {!isAuthenticated ? (
              <div className="flex space-x-2 pt-4 border-t border-[#E5E5E5]/20">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">Login</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">Sign Up</Button>
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#E5E5E5]/20">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-2 text-[#0B132B]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0B132B] to-[#1C2541] flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} className="w-full mt-2">
                  Logout
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};