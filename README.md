# 🚗 Rental App - Full Stack Application

A comprehensive car rental application built with React frontend and Express backend, featuring user authentication, fleet management, booking system, and AI-powered chat support.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express + TypeScript + Prisma + PostgreSQL
- **Authentication**: JWT with HTTP-only cookies
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: LangChain for chat functionality

## ✨ Features

- 🔐 **User Authentication**: Login, Register, Profile Management
- 🚗 **Fleet Management**: Browse and manage car inventory
- 📅 **Booking System**: Create and manage car bookings
- 💬 **AI Chat Support**: Intelligent customer support
- 📱 **Responsive Design**: Mobile-first UI/UX
- 🔒 **Security**: CORS, Helmet, Input validation
- 🎨 **Modern UI**: Beautiful, accessible interface

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

**Option 1: Automated Setup (Recommended)**
```bash
# Linux/Mac
./setup.sh

# Windows
setup.bat
```

**Option 2: Manual Setup**
```bash
# Install all dependencies
npm run install:all

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up database
npx prisma generate
npx prisma db push
```

### Development

```bash
# Start both frontend and backend
npm run dev:full

# Or start individually
npm run server:dev    # Backend only
npm run frontend:dev  # Frontend only
```

### Production

```bash
npm run build:full
```

## 📁 Project Structure

```
rental-app/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React contexts
│   │   ├── services/   # API services
│   │   └── types/      # TypeScript types
├── src/                # Backend source
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   └── langchain/      # AI integration
├── prisma/             # Database schema
└── server.ts          # Main server file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/logout` - User logout

### Fleet Management
- `GET /api/fleet/fleet` - Get all cars
- `POST /api/fleet/fleet` - Add new car (Admin)

### Booking Management
- `GET /api/bookings/bookings` - Get user bookings
- `POST /api/bookings/book` - Create booking
- `POST /api/bookings/cancel` - Cancel booking

### Chat System
- `POST /api/chat/session` - Create chat session
- `GET /api/chat/session/:id/messages` - Get messages
- `POST /api/chat/session/:id/message` - Send message

## 🔧 Available Scripts

- `npm run dev:full` - Start both frontend and backend
- `npm run server:dev` - Start backend only
- `npm run frontend:dev` - Start frontend only
- `npm run build:full` - Build for production
- `npm run install:all` - Install all dependencies

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📚 Documentation

- [Integration Guide](./INTEGRATION_GUIDE.md) - Detailed integration documentation
- [Authorization Guide](./AUTHORIZATION_README.md) - Authentication and authorization details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the integration
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
