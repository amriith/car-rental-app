# Frontend-Backend Integration Guide

This document outlines the complete integration between the frontend React application and the backend Express server for the rental app.

## 🏗️ Architecture Overview

The application now follows a full-stack architecture with:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS (in `/frontend` folder)
- **Backend**: Express + TypeScript + Prisma + PostgreSQL (in root folder)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with HTTP-only cookies
- **API**: RESTful API with proper error handling

## 📁 Project Structure

```
rental-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React contexts (Auth, Chat)
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── package.json         # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
├── src/                     # Backend source code
│   ├── routes/              # API route handlers
│   ├── middleware/          # Express middleware
│   └── langchain/           # AI/LLM integration
├── prisma/                  # Database schema and migrations
├── server.ts               # Main server file
└── package.json            # Backend dependencies
```

## 🔧 Integration Features

### 1. Authentication System
- **Backend**: JWT tokens with HTTP-only cookies
- **Frontend**: AuthContext with automatic token management
- **Features**: Login, Register, Logout, Protected routes

### 2. API Service Layer
- **Location**: `frontend/src/services/api.ts`
- **Features**: Axios instance with interceptors, error handling, automatic token attachment
- **Endpoints**: Auth, Fleet, Booking, Chat APIs

### 3. Real-time Chat System
- **Backend**: Chat sessions and messages stored in database
- **Frontend**: ChatContext with real-time messaging
- **Features**: Session management, message history, AI responses

### 4. Fleet Management
- **Backend**: CRUD operations for car fleet
- **Frontend**: Dynamic car listing with filtering and search
- **Features**: Real-time data fetching, error handling, loading states

### 5. Booking System
- **Backend**: User-specific booking management
- **Frontend**: Booking creation and management
- **Features**: User authentication required, ownership validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/rental_app"
   JWT_SECRET="your-super-secret-jwt-key"
   FRONTEND_URL="http://localhost:5173"
   PORT=3001
   ```

3. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Development

**Run both frontend and backend together**:
```bash
npm run dev:full
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

**Run individually**:
```bash
# Backend only
npm run server:dev

# Frontend only
npm run frontend:dev
```

### Production Build

```bash
npm run build:full
```

This will:
1. Build the frontend React app
2. Build the backend TypeScript code
3. Serve the frontend as static files from the backend

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/logout` - User logout
- `GET /api/profile` - Get user profile

### Fleet Management
- `GET /api/fleet/fleet` - Get all cars
- `POST /api/fleet/fleet` - Add new car (Admin only)

### Booking Management
- `GET /api/bookings/bookings` - Get user bookings
- `POST /api/bookings/book` - Create new booking
- `POST /api/bookings/cancel` - Cancel booking

### Chat System
- `POST /api/chat/session` - Create chat session
- `GET /api/chat/session/:id/messages` - Get chat messages
- `POST /api/chat/session/:id/message` - Send message

## 🔒 Security Features

1. **CORS Configuration**: Properly configured for frontend-backend communication
2. **Helmet**: Security headers for Express
3. **JWT Authentication**: Secure token-based authentication
4. **HTTP-only Cookies**: Prevents XSS attacks
5. **Input Validation**: Zod schemas for request validation
6. **Error Handling**: Comprehensive error handling and logging

## 🎨 Frontend Features

### Components Updated
- **AuthContext**: Real API integration with error handling
- **ChatContext**: Backend chat system integration
- **Cars Page**: Real-time fleet data with filtering
- **CarCard**: Updated to work with backend data model
- **Login/Signup**: Full backend integration

### State Management
- **Authentication**: JWT token management with localStorage
- **API Calls**: Centralized service layer with error handling
- **Loading States**: Proper loading and error states throughout
- **Real-time Updates**: Live data fetching and updates

## 🗄️ Database Schema

The integration uses the existing Prisma schema with:
- **Users**: Authentication and profile data
- **Cars**: Fleet management
- **Bookings**: User bookings with relationships
- **ChatSessions**: Chat functionality
- **Chat**: Individual chat messages
- **Addresses**: Booking locations

## 🔄 Data Flow

1. **User Authentication**: Frontend → Backend → Database → JWT Token
2. **Fleet Data**: Frontend → API Service → Backend → Database → Frontend
3. **Chat Messages**: Frontend → Chat API → Database → AI Response → Frontend
4. **Bookings**: Frontend → Booking API → Database → User-specific data

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` is set correctly in `.env`
2. **Database Connection**: Verify `DATABASE_URL` is correct
3. **JWT Errors**: Check `JWT_SECRET` is set
4. **Port Conflicts**: Ensure ports 3001 and 5173 are available

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📝 Next Steps

1. **Add more car details**: Images, specifications, availability
2. **Implement payment integration**: Stripe or similar
3. **Add admin dashboard**: Fleet management interface
4. **Enhance chat system**: Real-time WebSocket connection
5. **Add email notifications**: Booking confirmations
6. **Implement file uploads**: Car images and documents

## 🤝 Contributing

1. Follow the existing code structure
2. Update types when adding new features
3. Test both frontend and backend integration
4. Update this documentation for new features

---

The integration is now complete and ready for development and production use!
