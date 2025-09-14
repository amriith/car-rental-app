import express, { type Request, type Response } from 'express';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/authorisation';
import { 
  executeDatabaseTool
} from '../tools/databaseTools';
import { tool } from '@langchain/core/tools';

const router = express.Router();
const prisma = new PrismaClient();

// Configuration interface
interface AgentConfig {
  geminiApiKey: string;
  maxTokens: number;
  temperature: number;
  redisUrl?: string;
}

// Main Gemini Chat Agent Class
export class GeminiChatAgent {
  private langChainModel: ChatGoogleGenerativeAI;

  constructor(config: AgentConfig) {
    
    // Initialize LangChain model
    this.langChainModel = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-flash',
      maxOutputTokens: config.maxTokens,
      temperature: config.temperature,
      apiKey: process.env.GEMINI_API_KEY || '',
    });
  }

  // Process user message and generate response
  async processMessage(sessionId: string, userId: string, message: string): Promise<string> {
    try {
      // Get conversation history from database
      const chatHistory = await prisma.chat.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
        take: 5 // Last 5 messages for context
      });

      // Format conversation history as simple string
      const history = chatHistory.map(chat => 
        `User: ${chat.message}`
      ).join('\n');

      // Create a simple prompt without LangChain templates
      const systemPrompt = `You are Sarah Martinez, an Executive Support agent for Beta Car Hire, a premium luxury car rental service. You should:

1. Be polite, professional, and empathetic
2. Help customers with car rentals, bookings, and inquiries
3. Use available tools to provide accurate information
4. Escalate complex issues to human agents when appropriate
5. Always maintain a positive, luxury service tone
6. Keep responses concise and relevant and avoid unnecessary repetition
7. If you don't know the answer, admit it rather than making something up
8. Make it as easy and short as possible for the user to get what they need
9. Make it like a chat agent that is short crisp and to the point

Company Information:
- Beta Car Hire specializes in luxury and premium vehicles
- We offer Sedan, SUV, Truck, Van, SportsCar, Convertible, Coupe, Hatchback, and Wagon
- Our service includes comprehensive insurance and 24/7 support
- We provide concierge-level customer service

Customer Context:
- User ID: ${userId}
- Previous Interactions: ${history}

Current Message: ${message}

Please provide a helpful response as Sarah Martinez.`;

      // Generate response using LLM directly
      const result = await this.langChainModel.invoke(systemPrompt);

      // Extract the text content from the response
      let responseText = '';
      if (typeof result.content === 'string') {
        responseText = result.content;
      } else if (Array.isArray(result.content)) {
        responseText = result.content.map(item => 
          typeof item === 'string' ? item : (item as any).text || ''
        ).join('');
      } else if (result.text) {
        responseText = result.text;
      } else {
        responseText = 'I apologize, but I encountered an issue processing your request. Please try again.';
      }

      return responseText;
    } catch (error) {
      console.error('Error processing message:', error);
      return 'I apologize, but I encountered an issue processing your request. Please try again or contact our support team.';
    }
  }
}

// Initialize the chat agent
const  chatAgent = new GeminiChatAgent({
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  maxTokens: 400,
  temperature: 0.1
});

// Chat endpoint
router.post('/chat', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    if (!message || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Message and sessionId are required'
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

    // Generate AI response
    const aiResponse = await chatAgent.processMessage(sessionId, userId, message);
    
    // Save AI response
    const aiMessage = await prisma.chat.create({
      data: {
        sessionId,
        message: aiResponse
      }
    });

    res.json({
      success: true,
      message: 'Message processed successfully',
      userMessage: {
        id: userMessage.id,
        message: userMessage.message,
        createdAt: userMessage.createdAt
      },
      aiMessage: {
        id: aiMessage.id,
        message: aiMessage.message,
        createdAt: aiMessage.createdAt
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Option routing endpoint
router.post('/route', authenticateUser, async (req: Request, res: Response) => {
    try {
        const { option, sessionId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        if (!option || !sessionId) {
            return res.status(400).json({
                success: false,
                error: 'Option and sessionId are required'
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

        let response = '';
        let toolResult = null;

        // Route based on option
        switch (option.toLowerCase()) {
            case '1':
            case 'chat':
                response = 'I\'m here to help with any general inquiries about Beta Car Hire. What would you like to know?';
                break;
            
            case '2':
            case 'booking':
                response = 'I\'d be happy to help you make a booking! Let me check our available vehicles and dates for you.';
                // Use the booking tool
                toolResult = await executeDatabaseTool('get_user_bookings', { userId });
                response += `\n\nI can see your booking history. Would you like to make a new booking? Please provide:\n1. Your preferred dates\n2. Type of vehicle you need\n3. Pickup location`;
                break;
            
            case '3':
            case 'car':
                response = 'Let me show you our luxury fleet! Here are our available vehicles:';
                // Use the search cars tool
                toolResult = await executeDatabaseTool('search_cars', {});
                break;
            
            case '4':
            case 'price':
                response = 'I\'ll get you our current pricing information. Let me check our rates:';
                // Use the search cars tool for pricing
                const carData = await executeDatabaseTool('search_cars', {});
                const prompt = `Format this car pricing data for text display. 
                Use only plain text, no markdown, no special formatting, no \\n \n5  characters.
                Just use actual line breaks and simple dashes or numbers: ${JSON.stringify(carData)}
                Make each car on a separate line with clear pricing only use use actual line breaks. `;
                let aiResponse = await chatAgent.processMessage(sessionId, userId, prompt);
                  toolResult = aiResponse
                  .replace(/\\n/g, '\n')        
                  .replace(/\*\*/g, '')         
                  .replace(/\*/g, '')          
                  .trim();                      
              
                break;  
                break;
            
            case '5':
            case 'vehicle':
                response = 'I can provide detailed information about any vehicle in our fleet. Which vehicle would you like to know more about?';
                break;
            
            case '6':
            case 'update':
            case 'rental':
                response = 'I can help you update your rental dates or create a new booking. Let me check your current bookings first.';
                // Use the update rental tool
                toolResult = await executeDatabaseTool('update_rental', { userId });
                break;
            
            default:
                response = 'I didn\'t understand that option. Please select from:\n1. Chat\n2. Booking\n3. Car\n4. Price\n5. Vehicle\n6. Update Rental';
        }

        // Save the response to chat
        const aiMessage = await prisma.chat.create({
            data: {
                sessionId,
                message: response + (toolResult ? `\n\n${JSON.stringify(toolResult)}` : '')
            }
        });

        res.json({
            success: true,
            message: 'Option processed successfully',
            aiMessage: {
                id: aiMessage.id,
                message: aiMessage.message,
                createdAt: aiMessage.createdAt
            },
            toolResult
        });

    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

router.post('/booking', authenticateUser, async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.body;
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

        const result = await executeDatabaseTool('get_user_bookings', { userId });
        
        // Save the response to chat
        const aiMessage = await prisma.chat.create({
            data: {
                sessionId,
                message: `Booking information: ${JSON.stringify(result)}`
            }
        });

        res.json({
            success: true,
            message: 'Booking processed successfully',
            aiMessage: {
                id: aiMessage.id,
                message: aiMessage.message,
                createdAt: aiMessage.createdAt
            },
            result
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

router.post('/update-rental', authenticateUser, async (req: Request, res: Response) => {
    try {
        const { sessionId, startDate, endDate, carId, addressId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                error: 'SessionId is required'
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

        // Check if user has existing bookings
        const existingBookings = await prisma.booking.findMany({
            where: { 
                userId,
                status: 'active'
            },
            include: {
                car: true,
                address: true
            }
        });

        let result;
        let responseMessage;

        if (existingBookings.length === 0) {
            // No existing bookings, need to create new one
            if (!carId || !addressId || !startDate || !endDate) {
                // Get available cars for selection
                const availableCars = await prisma.cars.findMany({
                    take: 5
                });
                
                responseMessage = `You don't have any existing bookings. To create a new booking, I need:\n\n1. Car selection (choose from available cars below)\n2. Address information\n3. Start date\n4. End date\n\nAvailable cars:\n${availableCars.map((car, index) => `${index + 1}. ${car.make} ${car.model} ${car.year} - $${car.price}/day (ID: ${car.id})`).join('\n')}\n\nPlease provide:\n- Car ID or number from the list above\n- Your address\n- Start date (YYYY-MM-DD)\n- End date (YYYY-MM-DD)`;
                
                result = { message: responseMessage, availableCars };
            } else {
                // Create new booking
                const newBooking = await prisma.booking.create({
                    data: {
                        userId,
                        carId,
                        addressId,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        totalPrice: 0
                    },
                    include: {
                        car: true,
                        address: true
                    }
                });

                responseMessage = `New booking created successfully!\n\nBooking ID: ${newBooking.id}\nCar: ${newBooking.car.make} ${newBooking.car.model} ${newBooking.car.year}\nDates: ${startDate} to ${endDate}\nStatus: Active`;
                result = { booking: newBooking, message: responseMessage };
            }
        } else {
            // Update existing booking
            const bookingToUpdate = existingBookings[0];
            
            if (!startDate || !endDate) {
                responseMessage = `You have an existing booking:\n\nBooking ID: ${bookingToUpdate.id}\nCar: ${bookingToUpdate.car.make} ${bookingToUpdate.car.model}\nCurrent dates: ${bookingToUpdate.startDate.toISOString().split('T')[0]} to ${bookingToUpdate.endDate.toISOString().split('T')[0]}\n\nTo update your booking, please provide:\n- New start date (YYYY-MM-DD)\n- New end date (YYYY-MM-DD)`;
                result = { existingBooking: bookingToUpdate, message: responseMessage };
            } else {
                // Update the booking
                const updatedBooking = await prisma.booking.update({
                    where: { id: bookingToUpdate.id },
                    data: {
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                    },
                    include: {
                        car: true,
                        address: true
                    }
                });

                responseMessage = `Booking updated successfully!\n\nBooking ID: ${updatedBooking.id}\nCar: ${updatedBooking.car.make} ${updatedBooking.car.model}\nNew dates: ${startDate} to ${endDate}\nStatus: Active`;
                result = { booking: updatedBooking, message: responseMessage };
            }
        }

        // Save the response to chat
        const aiMessage = await prisma.chat.create({
            data: {
                sessionId,
                message: responseMessage
            }
        });

        res.json({
            success: true,
            message: 'Rental update processed successfully',
            aiMessage: {
                id: aiMessage.id,
                message: aiMessage.message,
                createdAt: aiMessage.createdAt
            },
            result
        });
    } catch (error) {
        console.error('Update rental error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});


export default router;





