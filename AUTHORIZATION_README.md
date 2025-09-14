# Rental App - Authorization Middleware

This project includes a comprehensive authorization middleware system that verifies users based on JWT tokens and cookies.

## Features

- **JWT Token Verification**: Validates JWT tokens from cookies
- **Database User Verification**: Ensures users exist in the database
- **Session Management**: Validates chat sessions and chat IDs
- **Role-based Access**: Support for different authorization levels
- **Cookie Security**: Secure cookie handling with proper settings
- **TypeScript Support**: Full TypeScript definitions and type safety

## Middleware Components

### 1. `authenticateUser`
General authentication middleware that verifies JWT token and cookies.

```typescript
import { authenticateUser } from './src/middleware/authorisation';

// Protect a route
app.get('/api/profile', authenticateUser, (req, res) => {
    res.json({ user: req.user });
});
```

### 2. `bookingAuthorisation`
Specialized middleware for booking operations with session validation.

```typescript
import { bookingAuthorisation } from './src/middleware/authorisation';

// Protect booking routes
app.post('/api/bookings/:sessionId/:chatId', bookingAuthorisation, (req, res) => {
    // Booking logic here
});
```

### 3. `adminAuthorisation`
Middleware for admin operations (currently allows any authenticated user).

```typescript
import { adminAuthorisation } from './src/middleware/authorisation';

// Protect admin routes
app.post('/api/fleet', adminAuthorisation, (req, res) => {
    // Admin logic here
});
```

### 4. `optionalAuth`
Optional authentication that doesn't fail if no token is provided.

```typescript
import { optionalAuth } from './src/middleware/authorisation';

// Optional authentication
app.get('/api/public-data', optionalAuth, (req, res) => {
    if (req.user) {
        // User is authenticated
    } else {
        // User is not authenticated, but route still works
    }
});
```

### 5. `validateUserOwnership`
Validates that users can only access their own resources.

```typescript
import { validateUserOwnership } from './src/middleware/authorisation';

// Ensure user can only access their own bookings
app.get('/api/user/:userId/bookings', 
    authenticateUser, 
    validateUserOwnership('userId'), 
    (req, res) => {
        // User can only access their own bookings
    }
);
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=postgresql://username:password@localhost:5432/rental_app
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 4. Start the Server
```bash
# Development mode with hot reload
npm run server:dev

# Production mode
npm run server
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /logout` - Logout user

### Booking Routes (`/api/bookings`)
- `POST /book` - Create a booking (requires authentication)
- `GET /bookings` - Get user's bookings (requires authentication)
- `POST /cancel` - Cancel a booking (requires authentication)

### Fleet Routes (`/api/fleet`)
- `GET /fleet` - Get all cars (optional authentication)
- `POST /fleet` - Add car to fleet (requires admin authentication)

### Profile Routes
- `GET /api/profile` - Get user profile (requires authentication)
- `GET /api/user/:userId/bookings` - Get user's bookings (requires ownership validation)

## Security Features

### Cookie Security
- `httpOnly: true` - Prevents XSS attacks
- `secure: true` - Only sent over HTTPS in production
- `sameSite: 'strict'` - Prevents CSRF attacks
- `maxAge: 3600000` - 1 hour expiration

### JWT Security
- Signed with secret key
- Contains user ID, session ID, and chat ID
- 1 hour expiration for registration, 69 hours for login
- Verified on every protected request

### Database Validation
- User existence verified on every request
- Session ownership validated
- Chat session validation
- Resource ownership checks

## Error Handling

The middleware provides comprehensive error handling:

```typescript
// Example error responses
{
    "success": false,
    "error": "Access token required"
}

{
    "success": false,
    "error": "Invalid or expired token"
}

{
    "success": false,
    "error": "User not found"
}
```

## Usage Examples

### Protecting a Route
```typescript
import express from 'express';
import { authenticateUser } from './src/middleware/authorisation';

const app = express();

// Simple protection
app.get('/api/protected', authenticateUser, (req, res) => {
    res.json({ message: 'This is protected', user: req.user });
});
```

### Multiple Middleware
```typescript
import { authenticateUser, validateUserOwnership } from './src/middleware/authorisation';

// Chain multiple middleware
app.get('/api/user/:userId/data', 
    authenticateUser, 
    validateUserOwnership('userId'),
    (req, res) => {
        res.json({ data: 'User-specific data' });
    }
);
```

### Custom Authorization Logic
```typescript
app.get('/api/admin/users', authenticateUser, (req, res) => {
    // Add custom role checking here
    if (req.user?.email === 'admin@example.com') {
        res.json({ users: 'Admin data' });
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
});
```

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## Troubleshooting

### Common Issues

1. **"JWT_SECRET environment variable is required"**
   - Make sure you have a `.env` file with `JWT_SECRET` set

2. **"User not found"**
   - User might have been deleted from database
   - Token might be corrupted

3. **"Invalid session"**
   - Session might have been deleted
   - User ID mismatch between token and session

4. **Cookie not being sent**
   - Check CORS configuration
   - Ensure `credentials: true` is set in frontend requests

### Debug Mode
Set `NODE_ENV=development` to enable detailed error logging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.



