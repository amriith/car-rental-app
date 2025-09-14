import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Clock, Star, Phone, Award, Users } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { CarCard } from '../components/cars/CarCard';
import { Button } from '../components/ui/Button';
import { cars } from '../data/cars';

export const Home: React.FC = () => {
  const featuredCars = cars.slice(0, 3);

  const features = [
    {
      icon: Shield,
      title: 'Premium Insurance',
      description: 'Comprehensive coverage included with every rental for your peace of mind.'
    },
    {
      icon: Clock,
      title: '24/7 Concierge',
      description: 'Round-the-clock support from our executive service team.'
    },
    {
      icon: Star,
      title: 'Luxury Fleet',
      description: 'Meticulously maintained premium vehicles from top manufacturers.'
    },
    {
      icon: Phone,
      title: 'White Glove Service',
      description: 'Personalized delivery and pickup service at your location.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Premium Vehicles' },
    { number: '10,000+', label: 'Satisfied Clients' },
    { number: '50+', label: 'Global Locations' },
    { number: '4.9', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#0B132B] to-[#1C2541]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-[#D4AF37] mb-2">{stat.number}</div>
                <div className="text-[#E5E5E5] text-sm lg:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0B132B] mb-6">Featured Luxury Vehicles</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our handpicked selection of premium vehicles, each offering 
              unparalleled comfort, performance, and style for the discerning executive.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Link to="/cars">
              <Button variant="primary" size="lg">
                Explore Full Fleet
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0B132B] mb-6">Why Choose Beta Car Hire</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference with our premium service standards and 
              attention to detail that sets us apart in luxury car rental.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[#0B132B] to-[#1C2541] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                  <feature.icon className="h-8 w-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-semibold text-[#0B132B] mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#2A3F5F] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready for Your Executive Experience?</h2>
            <p className="text-xl text-[#E5E5E5] mb-8 max-w-3xl mx-auto">
              Join thousands of executives who trust Beta Car Hire for their premium transportation needs. 
              Book your luxury vehicle today and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cars">
                <Button variant="secondary" size="lg">
                  Book Now
                </Button>
              </Link>
              <Link to="/support">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#0B132B]">
                  Speak with Concierge
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};