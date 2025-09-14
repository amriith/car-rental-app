import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Car, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { cars } from '../data/cars';
import { Booking } from '../types';

export const Bookings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [searchTerm, setSearchTerm] = useState('');

  // Helper function to get car image based on car type
  const getCarImage = (carType: string) => {
    const imageMap: { [key: string]: string } = {
      'Sedan': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      'SUV': 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop',
      'Truck': 'https://images.unsplash.com/photo-1563720228745-8b8a0b8b8b8b?w=400&h=300&fit=crop',
      'Van': 'https://images.unsplash.com/photo-1563720228745-8b8a0b8b8b8b?w=400&h=300&fit=crop',
      'SportsCar': 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop',
      'Convertible': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      'Coupe': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      'Hatchback': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      'Wagon': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop'
    };
    return imageMap[carType] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop';
  };

  // Mock bookings data
  const mockBookings: Booking[] = [
    {
      id: '1',
      carId: '1',
      car: cars[0],
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-02-18'),
      status: 'confirmed',
      totalPrice: 750,
      pickupLocation: 'Executive Terminal, JFK Airport',
      dropoffLocation: 'Midtown Manhattan Hotel',
      createdAt: new Date('2024-02-01')
    },
    {
      id: '2',
      carId: '2',
      car: cars[1],
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-01-25'),
      status: 'completed',
      totalPrice: 1100,
      pickupLocation: 'Beverly Hills Office',
      dropoffLocation: 'LAX Airport',
      createdAt: new Date('2024-01-10')
    },
    {
      id: '3',
      carId: '3',
      car: cars[2],
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-05'),
      status: 'pending',
      totalPrice: 800,
      pickupLocation: 'Downtown Seattle',
      dropoffLocation: 'Seattle-Tacoma Airport',
      createdAt: new Date('2024-02-20')
    }
  ];

  const currentBookings = mockBookings.filter(booking => 
    booking.status === 'confirmed' || booking.status === 'pending'
  );
  
  const pastBookings = mockBookings.filter(booking => 
    booking.status === 'completed' || booking.status === 'cancelled'
  );

  const displayBookings = activeTab === 'current' ? currentBookings : pastBookings;

  const filteredBookings = displayBookings.filter(booking =>
    `${booking.car.make} ${booking.car.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#0B132B] mb-6">My Bookings</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your luxury vehicle reservations and view your rental history.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-xl border border-[#E5E5E5]/20 p-1 flex shadow-sm">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'current'
                  ? 'bg-[#0B132B] text-white'
                  : 'text-[#0B132B] hover:bg-[#E5E5E5]/50'
              }`}
            >
              Current Bookings ({currentBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'past'
                  ? 'bg-[#0B132B] text-white'
                  : 'text-[#0B132B] hover:bg-[#E5E5E5]/50'
              }`}
            >
              Past Bookings ({pastBookings.length})
            </button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 max-w-md mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-[#E5E5E5]/20 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <img
                      src={getCarImage(booking.car.carType)}
                      alt={`${booking.car.make} ${booking.car.model}`}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-[#0B132B]">{booking.car.make} {booking.car.model}</h3>
                      <p className="text-gray-600">{booking.car.carType} • {booking.car.year}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#0B132B]">${booking.totalPrice}</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-[#D4AF37] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#0B132B]">Rental Period</p>
                      <p className="text-sm text-gray-600">
                        {format(booking.startDate, 'MMM d, yyyy')} - {format(booking.endDate, 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-[#D4AF37] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#0B132B]">Pickup Location</p>
                      <p className="text-sm text-gray-600">{booking.pickupLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-[#D4AF37] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#0B132B]">Drop-off Location</p>
                      <p className="text-sm text-gray-600">{booking.dropoffLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Booked on {format(booking.createdAt, 'MMM d, yyyy')}</span>
                  </div>

                  <div className="flex space-x-3">
                    {booking.status === 'confirmed' && (
                      <>
                        <Button variant="ghost" size="sm">
                          Modify
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        Book Again
                      </Button>
                    )}
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Bookings */}
        {filteredBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-[#E5E5E5] rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[#0B132B] mb-2">
              {activeTab === 'current' ? 'No current bookings' : 'No booking history'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'current' 
                ? 'Ready to book your next luxury vehicle?' 
                : 'Your completed bookings will appear here.'}
            </p>
            {activeTab === 'current' && (
              <Button variant="primary">
                Explore Our Fleet
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};