import { DynamicTool } from "@langchain/core/tools";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateRentalTool = new DynamicTool({
    name: "update_rental",
    description: "Update rental booking dates or create new booking if user doesn't have existing booking",
    func: async (input: string) => {
      try {
        // Parse the input string to extract parameters
        const params = JSON.parse(input);
        const { userId, newStartDate, newEndDate, carId, addressId } = params;
        
        // Check if user has existing bookings
        const existingBookings = await prisma.booking.findMany({
          where: { 
            userId,
            status: 'active'
          },
          include: {
            car: true,
            address: true
          }
        });

        if (existingBookings.length === 0) {
          // No existing bookings, create new one
          if (!carId || !addressId || !newStartDate || !newEndDate) {
            return "To create a new booking, I need: carId, addressId, startDate, and endDate. Please provide these details.";
          }

          const newBooking = await prisma.booking.create({
            data: {
              userId,
              carId,
              addressId,
              startDate: new Date(newStartDate),
              endDate: new Date(newEndDate),
              totalPrice: 0 // Will be calculated based on car price and duration
            },
            include: {
              car: true,
              address: true
            }
          });

          return `New booking created successfully! Booking ID: ${newBooking.id}, Car: ${newBooking.car.make} ${newBooking.car.model}, Dates: ${newStartDate} to ${newEndDate}`;
        } else {
          // Update existing booking
          const bookingToUpdate = existingBookings[0]; // Update the first active booking
          
          if (!newStartDate || !newEndDate) {
            return `You have an existing booking (ID: ${bookingToUpdate.id}) for ${bookingToUpdate.car.make} ${bookingToUpdate.car.model}. To update it, please provide new start and end dates.`;
          }

          const updatedBooking = await prisma.booking.update({
            where: { id: bookingToUpdate.id },
            data: {
              startDate: new Date(newStartDate),
              endDate: new Date(newEndDate),
            },
            include: {
              car: true,
              address: true
            }
          });

          return `Booking updated successfully! Booking ID: ${updatedBooking.id}, Car: ${updatedBooking.car.make} ${updatedBooking.car.model}, New dates: ${newStartDate} to ${newEndDate}`;
        }
      } catch (error) {
        console.error('Error updating rental:', error);
        return "Error updating rental. Please contact support.";
      }
    },
});