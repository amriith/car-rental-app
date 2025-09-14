import express, { type Request, type Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateUser, validateUserOwnership } from '../middleware/authorisation';

const router = express.Router();
const prisma = new PrismaClient();

const bookingSchema = z.object({
    carId: z.string(),
    userId: z.string(),
    addressId: z.string(),
})

const cancelSchema = z.object({
    bookingId: z.string(),
})

router.post('/book', authenticateUser, validateUserOwnership('userId'), async (req: Request, res: Response) =>{
    try {
        const {carId, userId, addressId} = bookingSchema.parse(req.body);
        
        // Verify car exists
        const car = await prisma.cars.findUnique({
            where: { id: carId }
        });
        
        if (!car) {
            return res.status(404).json({
                success: false,
                error: 'Car not found'
            });
        }
        
        // Verify address exists
        const address = await prisma.address.findUnique({
            where: { id: addressId }
        });
        
        if (!address) {
            return res.status(404).json({
                success: false,
                error: 'Address not found'
            });
        }
        
        const booking = await prisma.booking.create({
            data: {
                carId, 
                userId, 
                addressId,
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                totalPrice: 0,
                status: 'active'
            }
        })
        
        res.json({
            success: true,
            message: 'Booking created',
            booking
        })
    } catch (error) {
        console.error('Booking creation error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ 
                success: false, 
                error: error.errors 
            });
        }
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
})

router.get('/bookings', authenticateUser, async (req: Request, res: Response) =>{
    try {
        const userId = req.user?.id;
        
        // Get bookings for the authenticated user only
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                car: true,
                address: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
        
        res.json({
            success: true,
            message: 'Bookings fetched',
            bookings
        })
    } catch (error) {
        console.error('Fetch bookings error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
})

router.post('/cancel', authenticateUser, async (req: Request, res: Response) =>{
    try {
        const {bookingId} = cancelSchema.parse(req.body);
        const userId = req.user?.id;
        
        // First verify the booking exists and belongs to the user
        const existingBooking = await prisma.booking.findUnique({
            where: { id: bookingId }
        });
        
        if (!existingBooking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }
        
        if (existingBooking.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You can only cancel your own bookings'
            });
        }
        
        const booking = await prisma.booking.delete({
            where: {id: bookingId}
        })
        
        res.json({
            success: true,
            message: 'Booking cancelled',
            booking
        })
    } catch (error) {
        console.error('Cancel booking error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ 
                success: false, 
                error: error.errors 
            });
        }
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
})


export default router;
export { bookingSchema };