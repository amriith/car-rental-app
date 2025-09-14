import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Users, Fuel, Settings } from 'lucide-react';
import { Car } from '../../types';
import { Button } from '../ui/Button';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  // Generate a placeholder image based on car type
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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-lg border border-[#E5E5E5]/20 overflow-hidden group"
    >
      {/* Car Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getCarImage(car.carType)}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            car.carType === 'SportsCar' || car.carType === 'Convertible'
              ? 'bg-[#D4AF37] text-[#0B132B]'
              : car.carType === 'SUV' || car.carType === 'Truck'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {car.carType.toUpperCase()}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-medium">4.5</span>
          <span className="text-white/70 text-xs">(12)</span>
        </div>
      </div>

      {/* Car Details */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[#0B132B] mb-1">{car.make} {car.model}</h3>
          <p className="text-gray-600 text-sm">{car.carType} • {car.year}</p>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>5 seats</span>
          </div>
          <div className="flex items-center space-x-1">
            <Settings className="h-4 w-4" />
            <span>Auto</span>
          </div>
          <div className="flex items-center space-x-1">
            <Fuel className="h-4 w-4" />
            <span>Petrol</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-[#0B132B]">${car.price}</span>
            <span className="text-gray-600 text-sm ml-1">/day</span>
          </div>
          <Link to={`/cars/${car.id}`}>
            <Button variant="primary" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};