import React from 'react';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B132B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] rounded-lg">
                <Car className="h-6 w-6 text-[#0B132B]" />
              </div>
              <span className="text-xl font-bold">Beta Car Hire</span>
            </div>
            <p className="text-[#E5E5E5] mb-4 max-w-md">
              Premium luxury car rental service providing executive-level vehicles and exceptional customer experience across the globe.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-[#E5E5E5]">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#D4AF37] font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-[#E5E5E5] hover:text-[#D4AF37] transition-colors">Home</a></li>
              <li><a href="/cars" className="text-[#E5E5E5] hover:text-[#D4AF37] transition-colors">Our Fleet</a></li>
              <li><a href="/bookings" className="text-[#E5E5E5] hover:text-[#D4AF37] transition-colors">Bookings</a></li>
              <li><a href="/support" className="text-[#E5E5E5] hover:text-[#D4AF37] transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#D4AF37] font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-[#D4AF37] mt-0.5" />
                <div>
                  <p className="text-[#E5E5E5] text-sm">support@betacarhire.com</p>
                  <p className="text-[#E5E5E5] text-sm">booking@betacarhire.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-[#D4AF37] mt-0.5" />
                <p className="text-[#E5E5E5] text-sm">
                  123 Executive Drive<br />
                  Business District<br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1C2541] mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#E5E5E5] text-sm">
              © 2024 Beta Car Hire. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-[#E5E5E5] hover:text-[#D4AF37] text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-[#E5E5E5] hover:text-[#D4AF37] text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-[#E5E5E5] hover:text-[#D4AF37] text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};