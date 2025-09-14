import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PrismaClient } from '@prisma/client';
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from 'zod';

const prisma = new PrismaClient();

interface AgentConfig {
  geminiApiKey: string;
  maxTokens: number;
  temperature: number;
  redisUrl?: string;
}

// Intent schema
const intentSchema = z.object({
    intent: z.enum(['general_chat', 'car_inquiry', 'pricing', 'booking', 'availability', 'features', 'support']),
    confidence: z.number().min(0).max(1),
    entities: z.object({
        car_type: z.string().optional(),
        date_mentioned: z.string().optional(),
        price_range: z.string().optional(),
        location: z.string().optional()
    }).optional(),
    requires_tools: z.array(z.string()).optional()
});

// Main Gemini Chat Agent Class
export class GeminiChatAgent {
  private langChainModel: ChatGoogleGenerativeAI;
  private outputParser: StructuredOutputParser<any>;
  private intentPrompt: PromptTemplate;

  constructor(config: AgentConfig) {
    
    // Initialize LangChain model
    this.langChainModel = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-flash',
      maxOutputTokens: config.maxTokens,
      temperature: config.temperature,
      apiKey: process.env.GEMINI_API_KEY || '',
    });

    // Initialize output parser
    this.outputParser = StructuredOutputParser.fromZodSchema(intentSchema);

    // Initialize intent classification prompt
    this.intentPrompt = PromptTemplate.fromTemplate(`
You are Sarah Martinez, an Executive Support agent for Beta Car Hire, a premium luxury car rental service.
Your primary duty is to Analyze the user's message and classify their intent.

User message: "{message}"

Classify the intent and extract relevant entities:

- general_chat: Casual conversation, greetings, thank you, etc.
- car_inquiry: Questions about specific cars, models, features
- pricing: Questions about costs, rates, packages
- booking: Want to make a reservation or book a car
- availability: Checking if cars are available for specific dates
- features: Questions about car features, specifications
- support: Help, complaints, or technical issues

Also determine what tools might be needed to respond properly:
- search_cars: To find available vehicles
- get_user_bookings: To get user's booking history
- check_availability: To verify car availability
- get_car_details: To get specific car information
- get_user_info: To get user profile information

Customer Context:
- User ID: {userId}

IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.

{format_instructions}
`);
  }

  // NEW METHOD: Classify Intent
  async classifyIntent(message: string, userId: string): Promise<any> {
    try {
      const formatInstructions = this.outputParser.getFormatInstructions();
      const prompt = await this.intentPrompt.format({
        message: message,
        userId: userId,
        format_instructions: formatInstructions
      });
      
      const response = await this.langChainModel.invoke(prompt);
      
      // Extract text content properly
      let responseText = '';
      if (typeof response.content === 'string') {
        responseText = response.content;
      } else if (Array.isArray(response.content)) {
        responseText = response.content.map(item => 
          typeof item === 'string' ? item : (item as any).text || ''
        ).join('');
      }
      
      // Clean up the response text - remove markdown code blocks if present
      let cleanText = responseText.trim();
      
      console.log('🔍 Raw LLM response:', responseText);
      
      // Remove markdown code blocks (```json ... ```)
      if (cleanText.startsWith('```json') && cleanText.endsWith('```')) {
        cleanText = cleanText.slice(7, -3).trim(); // Remove ```json and ```
      } else if (cleanText.startsWith('```') && cleanText.endsWith('```')) {
        cleanText = cleanText.slice(3, -3).trim(); // Remove ``` and ```
      }
      
      console.log('🧹 Cleaned text:', cleanText);
      
      // Try to parse as JSON first, then use the parser
      try {
        const jsonResult = JSON.parse(cleanText);
        console.log('✅ JSON parsing successful:', jsonResult);
        return jsonResult;
      } catch (jsonError) {
        console.log('❌ JSON parsing failed, trying structured parser');
        // If JSON parsing fails, try the structured parser
        const parsedResult = await this.outputParser.parse(cleanText);
        return parsedResult;
      }
    } catch (error) {
      console.error('Intent classification error:', error);
      // Fallback to general chat if classification fails
      return {
        intent: 'general_chat',
        confidence: 0.5,
        entities: {},
        requires_tools: []
      };
    }
  }

  // UPDATED: Regular chat processing
  async processMessage(sessionId: string, userId: string, message: string): Promise<string> {
    try {
      // Get conversation history from database
      const chatHistory = await prisma.chat.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
        take: 5 // Last 5 messages for context
      });

      // Format conversation history
      const history = chatHistory.map(chat => 
        `User: ${chat.message}`
      ).join('\n');

      // Create regular chat prompt (not intent classification)
      const chatPrompt = `You are Sarah Martinez, an Executive Support agent for Beta Car Hire.
      
      Conversation History:
      ${history}
      
      Customer Context:
      - User ID: ${userId}
      
      Current Message: ${message}
      
      Please provide a helpful, conversational response as Sarah Martinez. Keep it friendly and professional.`;

      const result = await this.langChainModel.invoke(chatPrompt);

      // Extract the text content from the response
      let responseText = '';
      if (typeof result.content === 'string') {
        responseText = result.content;
      } else if (Array.isArray(result.content)) {
        responseText = result.content.map(item => 
          typeof item === 'string' ? item : (item as any).text || ''
        ).join('');
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
export const chatAgent = new GeminiChatAgent({
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  maxTokens: 400,
  temperature: 0.1
});