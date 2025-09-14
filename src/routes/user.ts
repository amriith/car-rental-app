import express, { type Request, type Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateUser } from '../middleware/authorisation';

const router = express.Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    phone: z.string().min(10),
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

// Validate JWT_SECRET exists
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

router.post('/register', async (req: Request, res: Response) =>{
    const {email, password, firstName, lastName, phone} = registerSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {email, password: hashedPassword, firstName, lastName, phone}
    })
    
    const session = await prisma.chatSession.create({
        data: {userId: user.id}
    })
    const chat = await prisma.chat.create({
        data: {sessionId: session.id, message: 'Hello, how can I help you today?'}
    })
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn: '1h'});

    // Set cookies with appropriate settings for development
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
        httpOnly: true, 
        secure: isProduction, 
        sameSite: 'strict', 
        maxAge: 3600000
    });
    res.cookie('sessionId', session.id, {
        httpOnly: true, 
        secure: isProduction, 
        sameSite: 'strict', 
        maxAge: 3600000
    });
    res.cookie('chatId', chat.id, {
        httpOnly: true, 
        secure: isProduction, 
        sameSite: 'strict', 
        maxAge: 3600000
    });

    res.json({
        success: true,
        message: 'User registered',
        token,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone
        }
    })
})

router.post('/login', async (req: Request, res: Response) =>{
    const {email, password} = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
        where: {email}
    })
    if (!user) {
        return res.status(401).json({error: 'Invalid credentials'})
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({error: 'Invalid credentials'})
    }
    
    const session = await prisma.chatSession.create({
        data: {userId: user.id}
    })
    const chat = await prisma.chat.create({
        data: {sessionId: session.id, message: 'Hello, how can I help you today?'}
    })
    const token = jwt.sign({userId: user.id, sessionId: session.id, chatId: chat.id}, process.env.JWT_SECRET!, {expiresIn: '69h'});
    
    // Set cookies with appropriate settings for development
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
        httpOnly: true, 
        secure: isProduction, 
        sameSite: 'strict', 
        maxAge: 3600000
    });
    res.cookie('sessionId', session.id, {
        httpOnly: true, 
        secure: isProduction, 
        sameSite: 'strict', 
        maxAge: 3600000
    });
    res.cookie('chatId', chat.id, {
        httpOnly: true, 
        secure: isProduction, 
        sameSite: 'strict', 
        maxAge: 3600000
    });
    
    res.json({
        success: true,
        message: 'User logged in',
        token,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone
        }
    })
})

router.get('/logout', async (req: Request, res: Response) =>{
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({error: 'No token found'})
    }
    
    try {
       
        jwt.verify(token, process.env.JWT_SECRET!);
        
        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie('token', { secure: isProduction, sameSite: 'strict' });
        res.clearCookie('sessionId', { secure: isProduction, sameSite: 'strict' });
        res.clearCookie('chatId', { secure: isProduction, sameSite: 'strict' });
        
        res.json({
            success: true,
            message: 'User logged out'
        })
    } catch (error) {
        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie('token', { secure: isProduction, sameSite: 'strict' });
        res.clearCookie('sessionId', { secure: isProduction, sameSite: 'strict' });
        res.clearCookie('chatId', { secure: isProduction, sameSite: 'strict' });
        
        res.status(401).json({
            success: false,
            message: 'Invalid token, but cookies cleared'
        })
    }
})

router.get('/verify-user', authenticateUser, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                car: true,
                address: true
            }
        });

        res.json({
            success: true, 
            message: 'User verified', 
            user: req.user,
            bookings: bookings
        });
    } catch (error) {
        console.error('Verify user error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}); 

export default router;