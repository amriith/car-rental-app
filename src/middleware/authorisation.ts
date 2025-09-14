import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request interface to include user data
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                phone: string;
            };
            sessionId?: string;
            chatId?: string;
        }
    }
}

interface JWTPayload {
    userId: string;
    sessionId?: string;
    chatId?: string;
    iat?: number;
    exp?: number;
}

/**
 * General authentication middleware that verifies JWT token and cookies
 * Validates user exists in database and session is valid
 */
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract token from cookies
        const token = req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                error: 'Access token required' 
            });
        }

        // Verify JWT token
        let decoded: JWTPayload;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        } catch (jwtError) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid or expired token' 
            });
        }

        // Verify user exists in database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true
            }
        });

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                error: 'User not found' 
            });
        }

        // Attach user data to request
        req.user = user;

        // If sessionId is in token, verify session exists
        if (decoded.sessionId) {
            const session = await prisma.chatSession.findUnique({
                where: { id: decoded.sessionId }
            });

            if (!session || session.userId !== user.id) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Invalid session' 
                });
            }

            req.sessionId = decoded.sessionId;
        }

        // If chatId is in token, verify chat exists
        if (decoded.chatId) {
            const chat = await prisma.chat.findUnique({
                where: { id: decoded.chatId }
            });

            if (!chat || chat.sessionId !== decoded.sessionId) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Invalid chat session' 
                });
            }

            req.chatId = decoded.chatId;
        }

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error during authentication' 
        });
    }
};

/**
 * Middleware specifically for booking operations
 * Ensures user has valid session and chat context
 */
export const bookingAuthorisation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // First run general authentication
        await authenticateUser(req, res, (err) => {
            if (err) return next(err);
        });

        // Additional booking-specific validations
        const { sessionId } = req.params;
        const { chatId } = req.params;
        const userId = req.user?.id;

        if (!sessionId || !chatId || !userId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required parameters for booking' 
            });
        }

        // Verify session belongs to user
        const session = await prisma.chatSession.findUnique({
            where: { id: sessionId }
        });

        if (!session || session.userId !== userId) {
            return res.status(403).json({ 
                success: false, 
                error: 'Session does not belong to user' 
            });
        }

        // Verify chat belongs to session
        const chat = await prisma.chat.findUnique({
            where: { id: chatId }
        });

        if (!chat || chat.sessionId !== sessionId) {
            return res.status(403).json({ 
                success: false, 
                error: 'Chat does not belong to session' 
            });
        }

        next();
    } catch (error) {
        console.error('Booking authorization error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error during booking authorization' 
        });
    }
};

/**
 * Middleware for admin operations (fleet management)
 * Currently allows any authenticated user, but can be extended for role-based access
 */
export const adminAuthorisation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Run general authentication first
        await authenticateUser(req, res, (err) => {
            if (err) return next(err);
        });

        // TODO: Add role-based authorization when user roles are implemented
        // For now, any authenticated user can perform admin operations
        
        next();
    } catch (error) {
        console.error('Admin authorization error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error during admin authorization' 
        });
    }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 * Useful for endpoints that work with or without authentication
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;
        
        if (!token) {
            return next(); // Continue without authentication
        }

        // If token exists, verify it
        await authenticateUser(req, res, next);
    } catch (error) {
        console.error('Optional auth error:', error);
        // Continue without authentication on error
        next();
    }
};

/**
 * Middleware to validate user ownership of resources
 * Use this for endpoints where users should only access their own data
 */
export const validateUserOwnership = (userIdParam: string = 'userId') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authenticatedUserId = req.user?.id;
            const resourceUserId = req.params[userIdParam] || req.body[userIdParam];

            if (!authenticatedUserId) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Authentication required' 
                });
            }

            if (!resourceUserId) {
                return res.status(400).json({ 
                    success: false, 
                    error: `Missing ${userIdParam} parameter` 
                });
            }

            if (authenticatedUserId !== resourceUserId) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'Access denied: You can only access your own resources' 
                });
            }

            next();
        } catch (error) {
            console.error('User ownership validation error:', error);
            return res.status(500).json({ 
                success: false, 
                error: 'Internal server error during ownership validation' 
            });
        }
    };
};