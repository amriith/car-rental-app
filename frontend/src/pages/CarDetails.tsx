import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Fuel, Settings, Shield, Clock, Phone, ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { fleetAPI } from '../services/api';
import { Car } from '../types';

export const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const response = await fleetAPI.getCars();
        if (response.success && response.cars) {
          const foundCar = response.cars.find((c: Car) => c.id === id);
          if (foundCar) {
            setCar(foundCar);
          } else {
            setError('Car not found');
          }
        } else {
          setError('Failed to fetch car details');
        }
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Failed to fetch car details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCar();
    }
  }, [id]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement booking logic
    alert('Booking request submitted! Our concierge team will contact you shortly.');
    setShowBookingForm(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F9FA] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B132B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !car) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F9FA] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-[#0B132B] mb-2">Car not found</h3>
          <p className="text-gray-600 mb-6">{error || 'The requested car could not be found.'}</p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Generate placeholder images based on car type
  const getCarImages = (carType: string) => {
    const imageMap: { [key: string]: string[] } = {
      'Sedan': [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop'
      ],
      'SUV': [
        'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop'
      ],
      'SportsCar': [
        'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop'
      ]
    };
    return imageMap[carType] || [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop'
    ];
  };

  const carImages = getCarImages(car.carType);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F9FA] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Fleet</span>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-w-16 aspect-h-10 rounded-2xl overflow-hidden">
                <img
                  src={carImages[selectedImage]}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-96 object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {carImages.length > 1 && (
                <div className="flex space-x-4">
                  {carImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-14 rounded-lg overflow-hidden ${
                        selectedImage === index
                          ? 'ring-2 ring-[#D4AF37]'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${car.make} ${car.model} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Car Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  car.carType === 'SportsCar' || car.carType === 'Convertible'
                    ? 'bg-[#D4AF37] text-[#0B132B]'
                    : car.carType === 'SUV' || car.carType === 'Truck'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {car.carType.toUpperCase()}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">4.5</span>
                  <span className="text-sm text-gray-500">(12 reviews)</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-[#0B132B] mb-2">{car.make} {car.model}</h1>
              <p className="text-xl text-gray-600">{car.carType} • {car.year}</p>
            </div>

            {/* Price */}
            <div className="p-6 bg-gradient-to-r from-[#0B132B] to-[#1C2541] rounded-2xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold">${car.price}</span>
                  <span className="text-lg text-[#E5E5E5] ml-2">per day</span>
                </div>
                <div className="text-right">
                  <p className="text-[#D4AF37] text-sm font-medium">Premium Package</p>
                  <p className="text-[#E5E5E5] text-xs">Insurance & concierge included</p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#E5E5E5]/20">
                <Users className="h-5 w-5 text-[#0B132B]" />
                <div>
                  <p className="text-sm text-gray-600">Seats</p>
                  <p className="font-semibold text-[#0B132B]">5 passengers</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#E5E5E5]/20">
                <Settings className="h-5 w-5 text-[#0B132B]" />
                <div>
                  <p className="text-sm text-gray-600">Transmission</p>
                  <p className="font-semibold text-[#0B132B] capitalize">Automatic</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#E5E5E5]/20">
                <Fuel className="h-5 w-5 text-[#0B132B]" />
                <div>
                  <p className="text-sm text-gray-600">Fuel Type</p>
                  <p className="font-semibold text-[#0B132B] capitalize">Petrol</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#E5E5E5]/20">
                <Shield className="h-5 w-5 text-[#0B132B]" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-green-600">Available</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-bold text-[#0B132B] mb-4">Premium Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Premium Leather Seats',
                  'Navigation System',
                  'Bluetooth Connectivity',
                  'Climate Control',
                  'Power Windows',
                  'Central Locking'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Included Services */}
            <div className="p-6 bg-gradient-to-r from-[#F8F9FA] to-[#E5E5E5]/50 rounded-2xl">
              <h4 className="font-semibold text-[#0B132B] mb-3">Included in Your Rental</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-[#D4AF37]" />
                  <span className="text-sm text-gray-700">Premium Insurance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-[#D4AF37]" />
                  <span className="text-sm text-gray-700">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-[#D4AF37]" />
                  <span className="text-sm text-gray-700">Concierge Service</span>
                </div>
              </div>
            </div>

            {/* Booking Button */}
            <div className="space-y-3">
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => setShowBookingForm(!showBookingForm)}
              >
                Reserve This Vehicle
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Contact Concierge
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Booking Form */}
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12 p-8 bg-white rounded-2xl shadow-lg border border-[#E5E5E5]/20"
          >
            <h3 className="text-2xl font-bold text-[#0B132B] mb-6">Complete Your Reservation</h3>
            
            <form onSubmit={handleBooking} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0B132B] mb-2">
                    Pickup Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      required
                      className="w-full pl-12 pr-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0B132B] mb-2">
                    Return Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      required
                      className="w-full pl-12 pr-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#0B132B] mb-2">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter pickup address or select from our locations"
                      required
                      className="w-full pl-12 pr-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" size="lg">
                  Confirm Reservation
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};