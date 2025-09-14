import express, { type Request, type Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { adminAuthorisation, optionalAuth } from '../middleware/authorisation';

const prisma = new PrismaClient();
const router = express.Router();

const schema = z.object({
    make: z.string(),
    model: z.string(),
    year: z.string(),
    price: z.string(),
    carType: z.enum(['Sedan', 'SUV', 'Truck', 'Van', 'SportsCar', 'Convertible', 'Coupe', 'Hatchback', 'Wagon']),
})

router.post('/fleet', adminAuthorisation, async (req: Request, res: Response) => {
    try {
        const { make, model, year, price, carType } = schema.parse(req.body);
        const car = await prisma.cars.create({
            data: { make, model, year, price, carType }
        });
        res.json({
            success: true,
            message: 'Car added to fleet',
            car
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ 
                success: false, 
                error: err.errors 
            });
        }
        console.error('Add car error:', err);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});


router.get('/fleet', optionalAuth, async (_req: Request, res: Response) =>{
    try {
        const cars = await prisma.cars.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            success: true,
            message: 'Cars fetched',
            cars: cars
        })
    } catch (error) {
        console.error('Fetch fleet error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
})





export default router;
export const carSchema = schema;