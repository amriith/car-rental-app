import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Database tool schemas for LangChain
export const searchCarsTool = {
  name: 'search_cars',
  description: 'Search for available cars by make, model, year, type, or price range',
  parameters: z.object({
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.string().optional(),
    carType: z.enum(['Sedan', 'SUV', 'Truck', 'Van', 'SportsCar', 'Convertible', 'Coupe', 'Hatchback', 'Wagon']).optional(),
    maxPrice: z.number().optional(),
    minPrice: z.number().optional(),
  })
};

export const getUserBookingsTool = {
  name: 'get_user_bookings',
  description: 'Get booking history and current bookings for a specific user',
  parameters: z.object({
    userId: z.string(),
  })
};

export const getCarDetailsTool = {
  name: 'get_car_details',
  description: 'Get detailed information about a specific car',
  parameters: z.object({
    carId: z.string(),
  })
};

export const checkAvailabilityTool = {
  name: 'check_availability',
  description: 'Check if a specific car is available for booking',
  parameters: z.object({
    carId: z.string(),
  })
};

export const getUserInfoTool = {
  name: 'get_user_info',
  description: 'Get user information for customer service',
  parameters: z.object({
    userId: z.string(),
  })
};

// Database tool implementations
export const databaseTools = {
  search_cars: async (params: {
    make?: string;
    model?: string;
    year?: string;
    carType?: string;
    maxPrice?: number;
    minPrice?: number;
  }) => {
    try {
      const where: any = {};
      
      if (params.make) where.make = { contains: params.make, mode: 'insensitive' };
      if (params.model) where.model = { contains: params.model, mode: 'insensitive' };
      if (params.year) where.year = params.year;
      if (params.carType) where.carType = params.carType;
      
      // Handle price range
      if (params.minPrice || params.maxPrice) {
        where.price = {};
        if (params.minPrice) where.price.gte = params.minPrice.toString();
        if (params.maxPrice) where.price.lte = params.maxPrice.toString();
      }

      const cars = await prisma.cars.findMany({
        where,
        include: {
          bookings: {
            select: {
              id: true,
              createdAt: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        cars: cars.map(car => ({
          id: car.id,
          make: car.make,
          model: car.model,
          year: car.year,
          price: car.price,
          carType: car.carType,
          bookingCount: car.bookings.length,
          lastBooking: car.bookings[0]?.createdAt || null
        })),
        count: cars.length
      };
    } catch (error) {
      console.error('Error searching cars:', error);
      return { success: false, error: 'Failed to search cars' };
    }
  },

  get_user_bookings: async (params: { userId: string }) => {
    try {
      const bookings = await prisma.booking.findMany({
        where: { userId: params.userId },
        include: {
          car: {
            select: {
              id: true,
              make: true,
              model: true,
              year: true,
              price: true,
              carType: true
            }
          },
          address: {
            select: {
              address: true,
              city: true,
              state: true,
              zip: true
            }
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        bookings: bookings.map(booking => ({
          id: booking.id,
          car: booking.car,
          address: booking.address,
          user: booking.user,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        })),
        count: bookings.length
      };
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return { success: false, error: 'Failed to get user bookings' };
    }
  },

  get_car_details: async (params: { carId: string }) => {
    try {
      const car = await prisma.cars.findUnique({
        where: { id: params.carId },
        include: {
          bookings: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              },
              address: {
                select: {
                  address: true,
                  city: true,
                  state: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!car) {
        return { success: false, error: 'Car not found' };
      }

      return {
        success: true,
        car: {
          id: car.id,
          make: car.make,
          model: car.model,
          year: car.year,
          price: car.price,
          carType: car.carType,
          createdAt: car.createdAt,
          bookings: car.bookings.map(booking => ({
            id: booking.id,
            user: booking.user,
            address: booking.address,
            createdAt: booking.createdAt
          }))
        }
      };
    } catch (error) {
      console.error('Error getting car details:', error);
      return { success: false, error: 'Failed to get car details' };
    }
  },

  check_availability: async (params: { carId: string }) => {
    try {
      const car = await prisma.cars.findUnique({
        where: { id: params.carId },
        include: {
          bookings: {
            select: {
              id: true,
              createdAt: true
            }
          }
        }
      });

      if (!car) {
        return { success: false, error: 'Car not found' };
      }

      const isAvailable = car.bookings.length === 0;
      const lastBooking = car.bookings[0]?.createdAt || null;

      return {
        success: true,
        available: isAvailable,
        carId: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        lastBooking,
        totalBookings: car.bookings.length
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      return { success: false, error: 'Failed to check availability' };
    }
  },

  get_user_info: async (params: { userId: string }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: params.userId },
        include: {
          bookings: {
            include: {
              car: {
                select: {
                  make: true,
                  model: true,
                  year: true,
                  carType: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      return {
        success: true,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
          totalBookings: user.bookings.length,
          recentBookings: user.bookings.slice(0, 5).map(booking => ({
            id: booking.id,
            car: booking.car,
            createdAt: booking.createdAt
          }))
        }
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      return { success: false, error: 'Failed to get user info' };
    }
  }
};

// Helper function to execute database tools
export const executeDatabaseTool = async (toolName: string, params: any) => {
  if (toolName in databaseTools) {
    return await (databaseTools as any)[toolName](params);
  }
  return { success: false, error: 'Tool not found' };
};
