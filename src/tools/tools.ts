import { z } from 'zod';
import { Tool } from '@langchain/core/tools';
import { PrismaClient } from '@prisma/client';
import { databaseTools } from './databaseTools';

const prisma = new PrismaClient();

// Base tool interface for extensibility
export interface BaseTool {
  name: string;
  description: string;
  parameters: z.ZodSchema;
  execute: (params: any) => Promise<any>;
}

// Car search tool with LangChain integration
export class CarSearchTool extends Tool {
  name = 'search_cars';
  description = 'Search for available luxury cars by make, model, year, type, or price range';

  constructor() {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);
      const result = await databaseTools.search_cars(params);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: 'Invalid input format' });
    }
  }
}

// User bookings tool
export class UserBookingsTool extends Tool {
  name = 'get_user_bookings';
  description = 'Get booking history and current bookings for a specific user';

  constructor() {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);
      const result = await databaseTools.get_user_bookings(params);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: 'Invalid input format' });
    }
  }
}

// Car details tool
export class CarDetailsTool extends Tool {
  name = 'get_car_details';
  description = 'Get detailed information about a specific car';

  constructor() {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);
      const result = await databaseTools.get_car_details(params);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: 'Invalid input format' });
    }
  }
}

// Availability check tool
export class AvailabilityTool extends Tool {
  name = 'check_availability';
  description = 'Check if a specific car is available for booking';

  constructor() {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);
      const result = await databaseTools.check_availability(params);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: 'Invalid input format' });
    }
  }
}

// User info tool
export class UserInfoTool extends Tool {
  name = 'get_user_info';
  description = 'Get user information for customer service';

  constructor() {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);
      const result = await databaseTools.get_user_info(params);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: 'Invalid input format' });
    }
  }
}

// Future extensibility tools (examples)
export class WeatherTool extends Tool {
  name = 'get_weather';
  description = 'Get current weather information for a location';

  constructor() {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);
      // This would integrate with a weather API
      return JSON.stringify({
        success: true,
        location: params.location,
        temperature: '22°C',
        condition: 'Sunny',
        message: 'Perfect weather for a luxury car rental!'
      });
    } catch (error) {
      return JSON.stringify({ success: false, error: 'Invalid input format' });
    }
  }
}

export class PricingTool extends Tool {
  name = 'calculate_pricing';
  description = 'Calculate rental pricing based on car type, duration, and location';

  constructor() {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);
      const car = await prisma.cars.findUnique({
        where: { id: params.carId }
      });

      if (!car) {
        return JSON.stringify({ success: false, error: 'Car not found' });
      }

      const basePrice = parseFloat(car.price);
      const totalPrice = basePrice * params.duration;
      const tax = totalPrice * 0.1; // 10% tax
      const totalWithTax = totalPrice + tax;

      return JSON.stringify({
        success: true,
        car: {
          make: car.make,
          model: car.model,
          year: car.year
        },
        pricing: {
          basePrice: basePrice,
          duration: params.duration,
          subtotal: totalPrice,
          tax: tax,
          total: totalWithTax
        }
      });
    } catch (error) {
      return JSON.stringify({ success: false, error: 'Failed to calculate pricing' });
    }
  }
}

// Tool registry for easy management
export const toolRegistry = {
  // Database tools
  search_cars: new CarSearchTool(),
  get_user_bookings: new UserBookingsTool(),
  get_car_details: new CarDetailsTool(),
  check_availability: new AvailabilityTool(),
  get_user_info: new UserInfoTool(),
  
  // Future tools
  get_weather: new WeatherTool(),
  calculate_pricing: new PricingTool(),
};

// Get all tools as LangChain Tool array
export const getAllTools = (): Tool[] => {
  return Object.values(toolRegistry);
};

// Get specific tools by category
export const getDatabaseTools = (): Tool[] => {
  return [
    toolRegistry.search_cars,
    toolRegistry.get_user_bookings,
    toolRegistry.get_car_details,
    toolRegistry.check_availability,
    toolRegistry.get_user_info,
  ];
};

export const getFutureTools = (): Tool[] => {
  return [
    toolRegistry.get_weather,
    toolRegistry.calculate_pricing,
  ];
};

// Tool factory for creating new tools dynamically
export class ToolFactory {
  static createTool(name: string, description: string, executeFunction: (params: any) => Promise<any>): Tool {
    return new (class extends Tool {
      name = name;
      description = description;
      
      async _call(input: string): Promise<string> {
        try {
          const params = JSON.parse(input);
          const result = await executeFunction(params);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({ success: false, error: 'Invalid input format' });
        }
      }
    })();
  }
}

// Example of how to add new tools in the future
export const addCustomTool = (name: string, description: string, executeFunction: (params: any) => Promise<any>) => {
  const tool = ToolFactory.createTool(name, description, executeFunction);
  (toolRegistry as any)[name] = tool;
  return tool;
};
