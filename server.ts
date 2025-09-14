import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import userRoutes from './src/routes/user';
import bookingRoutes from './src/routes/booking';
import fleetRoutes from './src/routes/fleet';
import chatRoutes from './src/routes/chat';
import aiChatRoutes from './src/routes/aichat';

// Import middleware
import { authenticateUser } from './src/middleware/authorisation';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Validate required environment variables
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is required');
    process.exit(1);
}

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is required');
    process.exit(1);
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default port
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing middleware
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Public routes (no authentication required)
app.use('/api/auth', userRoutes);

// Protected routes (authentication required)
app.use('/api/bookings', bookingRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/aichat', aiChatRoutes);

// Example of a protected route with custom middleware
app.get('/api/profile', authenticateUser, (req, res) => {
    res.json({
        success: true,
        message: 'User profile',
        user: req.user
    });
});

// Example of a route that requires specific user ownership
// Temporarily removed due to path-to-regexp compatibility issue
// app.get('/api/user/:userId/bookings', authenticateUser, (req, res) => { ... });

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            error: 'Invalid JSON in request body'
        });
    }
    
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            success: false,
            error: 'File too large'
        });
    }
    
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
    // Don't serve frontend for API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            error: 'API route not found'
        });
    }
    
    // Serve frontend for all other routes (SPA)
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
    console.log(`📅 Booking endpoints: http://localhost:${PORT}/api/bookings`);
    console.log(`🚗 Fleet endpoints: http://localhost:${PORT}/api/fleet`);
});

export default app;
