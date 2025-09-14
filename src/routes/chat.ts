import express, { type Request, type Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/authorisation';
import { chatAgent } from '../llm/llmcall'; // Import the instance, not the class
// Import your tools from wherever they are
import { executeDatabaseTool } from '../tools/databaseTools';

const router = express.Router();
const prisma = new PrismaClient();

const messageSchema = z.object({
    message: z.string().min(1),
});

// Remove this broken line:
// const message = GeminiChatAgent.intentPrompt.message; ❌

// Remove duplicate intentSchema - it's already in llmcall.ts

// Available tools configuration - now using real database tools
const availableTools = {
    search_cars: async (params = {}) => {
        console.log('Executing search_cars with params:', params);
        return await executeDatabaseTool('search_cars', params);
    },
    
    get_user_bookings: async (params = {}) => {
        console.log('Executing get_user_bookings with params:', params);
        return await executeDatabaseTool('get_user_bookings', params);
    },
    
    check_availability: async (params = {}) => {
        console.log('Executing check_availability with params:', params);
        return await executeDatabaseTool('check_availability', params);
    },
    
    get_car_details: async (params = {}) => {
        console.log('Executing get_car_details with params:', params);
        return await executeDatabaseTool('get_car_details', params);
    },
    
    get_user_info: async (params = {}) => {
        console.log('Executing get_user_info with params:', params);
        return await executeDatabaseTool('get_user_info', params);
    }
};

// Tool execution function
async function executeTools(toolNames: string[], entities: any, userId?: string) {
    const toolResults: Record<string, any> = {};
    
    for (const toolName of toolNames) {
        if (availableTools[toolName as keyof typeof availableTools]) {
            try {
                const params = buildToolParams(toolName, entities, userId);
                toolResults[toolName] = await availableTools[toolName as keyof typeof availableTools](params);
            } catch (error) {
                console.error(`Tool ${toolName} execution error:`, error);
                toolResults[toolName] = { error: `Failed to execute ${toolName}` };
            }
        } else {
            console.warn(`Tool ${toolName} not found in available tools`);
        }
    }
    
    return toolResults;
}

// Build parameters for tools based on extracted entities
function buildToolParams(toolName: string, entities: any, userId?: string) {
    const params: Record<string, any> = {};
    
    if (!entities) return params;
    
    switch (toolName) {
        case 'search_cars':
            if (entities.car_type) params.carType = entities.car_type;
            if (entities.price_range) params.maxPrice = parseFloat(entities.price_range);
            if (entities.location) params.location = entities.location;
            break;
            
        case 'check_availability':
            if (entities.car_type) params.carId = entities.car_type; // Assuming car_type contains carId
            break;
            
        case 'get_user_bookings':
            if (userId) params.userId = userId;
            break;
            
        case 'get_car_details':
            if (entities.car_type) params.carId = entities.car_type; // Assuming car_type contains carId
            break;
            
        case 'get_user_info':
            if (userId) params.userId = userId;
            break;
    }
    
    return params;
}

// Format tool results for AI response
function formatToolResults(toolResults: Record<string, any>): string {
    let formatted = "Here's what I found:\n\n";
    
    for (const [toolName, result] of Object.entries(toolResults)) {
        switch (toolName) {
            case 'search_cars':
                if (result.success && result.cars) {
                    formatted += "Available Vehicles:\n";
                    result.cars.forEach((car: any, index: number) => {
                        formatted += `${index + 1}. ${car.make} ${car.model} ${car.year} - $${car.price}/day\n`;
                        formatted += `   Type: ${car.carType}\n`;
                        formatted += `   Bookings: ${car.bookingCount}\n\n`;
                    });
                    formatted += `Total: ${result.count} vehicles found\n\n`;
                } else if (result.error) {
                    formatted += `Error searching cars: ${result.error}\n\n`;
                }
                break;
                
            case 'get_user_bookings':
                if (result.success && result.bookings) {
                    formatted += "Your Bookings:\n";
                    result.bookings.forEach((booking: any, index: number) => {
                        formatted += `${index + 1}. ${booking.car.make} ${booking.car.model} ${booking.car.year}\n`;
                        formatted += `   Booking ID: ${booking.id}\n`;
                        formatted += `   Created: ${new Date(booking.createdAt).toLocaleDateString()}\n\n`;
                    });
                    formatted += `Total: ${result.count} bookings\n\n`;
                } else if (result.error) {
                    formatted += `Error getting bookings: ${result.error}\n\n`;
                }
                break;
                
            case 'check_availability':
                if (result.success) {
                    formatted += `Car Availability:\n`;
                    formatted += `${result.make} ${result.model} ${result.year}\n`;
                    formatted += `Available: ${result.available ? 'Yes' : 'No'}\n`;
                    formatted += `Total Bookings: ${result.totalBookings}\n\n`;
                } else if (result.error) {
                    formatted += `Error checking availability: ${result.error}\n\n`;
                }
                break;
                
            case 'get_car_details':
                if (result.success && result.car) {
                    formatted += `${result.car.make} ${result.car.model} ${result.car.year} Details:\n`;
                    formatted += `Price: $${result.car.price}/day\n`;
                    formatted += `Type: ${result.car.carType}\n`;
                    formatted += `Bookings: ${result.car.bookings.length}\n\n`;
                } else if (result.error) {
                    formatted += `Error getting car details: ${result.error}\n\n`;
                }
                break;
                
            case 'get_user_info':
                if (result.success && result.user) {
                    formatted += `User Information:\n`;
                    formatted += `Name: ${result.user.firstName} ${result.user.lastName}\n`;
                    formatted += `Email: ${result.user.email}\n`;
                    formatted += `Total Bookings: ${result.user.totalBookings}\n\n`;
                } else if (result.error) {
                    formatted += `Error getting user info: ${result.error}\n\n`;
                }
                break;
        }
    }
    
    return formatted.trim();
}

// Get all sessions for authenticated user
router.get('/sessions', authenticateUser, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const sessions = await prisma.chatSession.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    take: 1
                }
            }
        });

        res.json({
            success: true,
            message: 'Sessions retrieved',
            sessions: sessions
        });
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Create a new chat session
router.post('/session', authenticateUser, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const session = await prisma.chatSession.create({
            data: { userId }
        });

        // Create initial welcome message - Remove the manual menu
        const welcomeMessage = await prisma.chat.create({
            data: {
                sessionId: session.id,
                message: 'Hello! Welcome to Beta Car Hire. I\'m Sarah, your personal car rental assistant. I can help you with:\n\n• Browse our luxury vehicle fleet\n• Get pricing information\n• Check availability\n• Make bookings\n• Answer questions about our services\n\nWhat can I help you with today?'
            }
        });

        res.json({
            success: true,
            message: 'Chat session created',
            sessionId: session.id,
            welcomeMessage: welcomeMessage
        });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get messages for a session
router.get('/session/:sessionId/messages', authenticateUser, async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user?.id;

        const session = await prisma.chatSession.findUnique({
            where: { id: sessionId }
        });

        if (!session || session.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Access denied to this chat session'
            });
        }

        const messages = await prisma.chat.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' }
        });

        res.json({
            success: true,
            message: 'Messages fetched',
            messages
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// MAIN MESSAGE HANDLER WITH INTENT CLASSIFICATION AND TOOL EXECUTION
router.post('/session/:sessionId/message', authenticateUser, async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const { message } = messageSchema.parse(req.body);
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        // Verify session belongs to user
        const session = await prisma.chatSession.findUnique({
            where: { id: sessionId }
        });

        if (!session || session.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Access denied to this chat session'
            });
        }

        // Save user message
        const userMessage = await prisma.chat.create({
            data: {
                sessionId,
                message
            }
        });

        console.log(`🔍 Processing message: "${message}" for user: ${userId}`);

        // STEP 1: Classify the intent using GeminiChatAgent
        const intentResult = await chatAgent.classifyIntent(message, userId);
        console.log('🎯 Intent classification:', intentResult);

        let finalResponse = '';
        let toolResults = {};

        // STEP 2: Execute tools if needed
        if (intentResult.requires_tools && intentResult.requires_tools.length > 0) {
            console.log(`🔧 Executing tools: ${intentResult.requires_tools.join(', ')}`);
            toolResults = await executeTools(
                intentResult.requires_tools,
                intentResult.entities,
                userId
            );
            console.log('🔧 Tool results:', toolResults);
        }

        // STEP 3: Generate response based on intent and tool results
        if (Object.keys(toolResults).length > 0) {
            // We have tool results - format them nicely
            const toolOutput = formatToolResults(toolResults);
            
            // Let the AI enhance the tool output with conversational text
            const enhancementPrompt = `The user asked: "${message}"
            
I've gathered this information for them:
${toolOutput}

Please provide a friendly, conversational response that:
1. Acknowledges their request
2. Presents the information in a natural way
3. Ends with a helpful follow-up question or offer to assist further

Keep it professional but warm, as Sarah from Beta Car Hire.`;

            finalResponse = await chatAgent.processMessage(sessionId, userId, enhancementPrompt);
        } else {
            // No tools needed - use regular chat processing
            finalResponse = await chatAgent.processMessage(sessionId, userId, message);
        }

        // Clean up the response
        const cleanResponse = finalResponse
            .replace(/\\n/g, '\n')
            .replace(/\*\*/g, '')
            .replace(/"/g, '')
            .trim();

        // Save AI response
        const aiMessage = await prisma.chat.create({
            data: {
                sessionId,
                message: cleanResponse
            }
        });

        res.json({
            success: true,
            message: 'Message processed successfully',
            userMessage,
            aiMessage,
            messageId: aiMessage.id,
            // Include debug info (remove in production)
            debug: {
                intent: intentResult.intent,
                confidence: intentResult.confidence,
                entities: intentResult.entities,
                tools_executed: Object.keys(toolResults),
                has_tool_results: Object.keys(toolResults).length > 0
            }
        });

    } catch (error) {
        console.error('❌ Send message error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                error: error.errors
            });
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Sorry, I encountered an error processing your request. Please try again.'
        });
    }
});

// TEST ROUTES FOR DEBUGGING

// Test intent classification only
router.post('/test-intent', authenticateUser, async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        const userId = req.user?.id || 'test-user';
        
        console.log(`🧪 Testing intent for: "${message}"`);
        const intentResult = await chatAgent.classifyIntent(message, userId);
        
        res.json({
            success: true,
            message: message,
            intent_analysis: intentResult
        });
    } catch (error) {
        console.error('❌ Test intent error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Test tool execution only
router.post('/test-tools', authenticateUser, async (req: Request, res: Response) => {
    try {
        const { tools, entities = {} } = req.body;
        
        if (!tools || !Array.isArray(tools)) {
            return res.status(400).json({
                success: false,
                error: 'tools array is required'
            });
        }
        
        console.log(`🧪 Testing tools: ${tools.join(', ')}`);
        const toolResults = await executeTools(tools, entities);
        const formatted = formatToolResults(toolResults);
        
        res.json({
            success: true,
            tools_executed: tools,
            tool_results: toolResults,
            formatted_output: formatted
        });
    } catch (error) {
        console.error('❌ Test tools error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Health check
router.get('/health', (_req: Request, res: Response) => {
    res.json({
        success: true,
        status: 'Chat system operational',
        available_tools: Object.keys(availableTools),
        features: ['intent_classification', 'tool_execution', 'conversational_ai']
    });
});

export default router;