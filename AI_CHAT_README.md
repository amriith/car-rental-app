# AI Chat Agent for Rental App

## Overview

This AI chat agent system provides intelligent customer service for your rental app using Google's Gemini AI model through LangChain. The agent can interact with your database to provide real-time information about cars, bookings, and user data.

## Features

### 🤖 Intelligent Customer Service
- **Sarah Martinez** - Your AI customer service agent
- Natural language processing for customer inquiries
- Context-aware responses based on conversation history
- Professional luxury service tone

### 🗄️ Database Integration
- **Car Search**: Find cars by make, model, year, type, or price range
- **User Bookings**: Access customer booking history and current reservations
- **Car Details**: Get comprehensive information about specific vehicles
- **Availability Check**: Real-time car availability status
- **User Information**: Customer profile and service history

### 🔧 LangChain Tools Framework
- Extensible tool system for future enhancements
- Easy integration of new tools and capabilities
- Structured tool registry for management
- Tool factory for dynamic tool creation

## Architecture

```
Frontend (React) → Chat Context → AI Chat API → Gemini AI → Database Tools → Prisma → PostgreSQL
```

### Components

1. **Frontend Chat Widget** (`frontend/src/components/chat/ChatWidget.tsx`)
   - Beautiful, responsive chat interface
   - Real-time message updates
   - Loading states and animations
   - Session management

2. **Chat Context** (`frontend/src/context/ChatContext.tsx`)
   - State management for chat functionality
   - API integration with backend
   - Session handling and message persistence

3. **AI Chat Route** (`src/routes/aichat.ts`)
   - Main AI agent implementation
   - LangChain integration
   - Conversation memory management
   - Tool orchestration

4. **Database Tools** (`src/tools/databaseTools.ts`)
   - Prisma-based database operations
   - Structured tool definitions
   - Error handling and validation

5. **LangChain Tools** (`src/tools/tools.ts`)
   - Extensible tool framework
   - Tool registry and factory
   - Future-ready architecture

## Setup Instructions

### 1. Environment Variables

Add to your `.env` file:

```env
GOOGLE_API_KEY=your_google_api_key_here
# OR alternatively:
# GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
```

### 2. Install Dependencies

```bash
npm install @langchain/google-genai @langchain/core langchain
```

### 3. Database Schema

The system uses your existing Prisma schema with these key models:
- `User` - Customer information
- `Cars` - Vehicle inventory
- `Booking` - Rental reservations
- `Chat` - Message storage
- `ChatSession` - Conversation sessions

### 4. API Endpoints

- `POST /api/chat/session` - Create new chat session
- `GET /api/chat/session/:sessionId/messages` - Get conversation history
- `POST /api/aichat/chat` - Send message to AI agent

## Usage Examples

### Customer Inquiries

**"I'm looking for a luxury SUV"**
- Agent uses `search_cars` tool
- Filters by car type "SUV"
- Returns available options with details

**"What are my current bookings?"**
- Agent uses `get_user_bookings` tool
- Retrieves user's booking history
- Provides personalized information

**"Is the BMW X5 available?"**
- Agent uses `check_availability` tool
- Checks real-time availability
- Provides booking guidance

### Tool Integration

The agent automatically selects appropriate tools based on customer queries:

```typescript
// Example tool usage
const result = await executeDatabaseTool('search_cars', {
  make: 'BMW',
  carType: 'SUV',
  maxPrice: 200
});
```

## Future Extensibility

### Adding New Tools

1. **Create Tool Class**:
```typescript
export class WeatherTool extends Tool {
  name = 'get_weather';
  description = 'Get weather information for location';
  
  async _call(input: string): Promise<string> {
    // Implementation
  }
}
```

2. **Register Tool**:
```typescript
toolRegistry.weather = new WeatherTool();
```

3. **Update Agent Prompt**:
Add tool description to the customer service prompt template.

### Example Future Tools

- **Weather Integration**: Weather-based car recommendations
- **Pricing Calculator**: Dynamic pricing based on demand
- **Route Planning**: Integration with mapping services
- **Payment Processing**: Booking and payment handling
- **Notification System**: SMS/email notifications

## Configuration

### Agent Settings

```typescript
const chatAgent = new GeminiChatAgent({
  geminiApiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
  maxTokens: 1000,
  temperature: 0.7
});
```

### Tool Configuration

- **Temperature**: Controls response creativity (0.0-1.0)
- **Max Tokens**: Limits response length
- **Memory**: Conversation context retention

## Error Handling

The system includes comprehensive error handling:

- **API Failures**: Graceful fallback responses
- **Database Errors**: Structured error messages
- **Invalid Input**: Input validation and sanitization
- **Session Management**: Secure session handling

## Security Features

- **Authentication**: JWT-based user authentication
- **Session Validation**: User-session ownership verification
- **Input Sanitization**: Protection against injection attacks
- **Rate Limiting**: Prevents abuse (implement as needed)

## Monitoring and Analytics

### Logging
- Request/response logging
- Error tracking
- Performance metrics
- Tool usage analytics

### Metrics to Track
- Response times
- Tool usage frequency
- Customer satisfaction
- Error rates

## Deployment Considerations

### Production Setup
1. **Environment**: Use production Gemini API keys
2. **Database**: Optimize Prisma queries for performance
3. **Caching**: Implement Redis for conversation memory
4. **Monitoring**: Set up logging and error tracking
5. **Scaling**: Consider horizontal scaling for high traffic

### Performance Optimization
- **Connection Pooling**: Optimize database connections
- **Memory Management**: Implement conversation cleanup
- **Caching**: Cache frequently accessed data
- **CDN**: Use CDN for static assets

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Verify GEMINI_API_KEY is set correctly
   - Check API key permissions and quotas

2. **Database Connection**
   - Verify DATABASE_URL format
   - Ensure Prisma client is properly initialized

3. **Session Management**
   - Check JWT token validity
   - Verify session ownership

4. **Tool Execution**
   - Check tool parameter validation
   - Verify database schema compatibility

### Debug Mode

Enable verbose logging in the agent:

```typescript
const chain = new ConversationChain({
  llm: this.langChainModel,
  memory,
  prompt,
  verbose: true // Enable debug logging
});
```

## Contributing

### Adding New Features

1. **Database Tools**: Add new tools in `databaseTools.ts`
2. **LangChain Tools**: Extend `tools.ts` with new capabilities
3. **Agent Logic**: Update agent prompts and behavior
4. **Frontend**: Enhance chat interface as needed

### Code Style

- Use TypeScript for type safety
- Follow existing error handling patterns
- Add comprehensive JSDoc comments
- Include unit tests for new tools

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs
3. Verify environment configuration
4. Test individual components

---

**Built with ❤️ using LangChain, Gemini AI, and modern web technologies**
