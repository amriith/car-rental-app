import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#2A3F5F]">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B132B]/80 to-[#1C2541]/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Executive
              <span className="block text-[#D4AF37]">Luxury Rentals</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-[#E5E5E5] mb-8 leading-relaxed"
            >
              Experience the pinnacle of automotive luxury with our premium fleet. 
              From executive sedans to luxury SUVs, we provide exceptional vehicles 
              for discerning clients.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="secondary" size="lg">
                Explore Our Fleet
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#0B132B]">
                Contact Concierge
              </Button>
            </motion.div>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Find Your Perfect Vehicle</h3>
            
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#D4AF37]" />
                <input
                  type="text"
                  placeholder="Pickup Location"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#D4AF37]" />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#D4AF37]" />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>
              </div>

              <Button variant="secondary" size="lg" className="w-full">
                <Search className="h-5 w-5 mr-2" />
                Search Available Cars
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-[#E5E5E5] text-sm text-center">
                ✨ Complimentary concierge service • Premium insurance included
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-[#D4AF37] rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-[#D4AF37] rounded-full opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-[#D4AF37] rounded-full opacity-80 animate-pulse delay-500"></div>
    </div>
  );
};