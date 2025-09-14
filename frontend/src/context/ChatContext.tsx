import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  avatar?: string;
  agentName?: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  unreadCount: number;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (text: string) => void;
  markAsRead: () => void;
  sessionId: string | null;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Beta Car Hire. How can I assist you today?\n\nPlease select one of the following options: \n\n1. Chat - General inquiries\n2. Booking - Make a reservation\n3. Car - Browse our fleet\n4. Price - Get pricing information\n5. Vehicle - Vehicle details\n6. Update Rental - Modify existing booking or create new one\n\nJust type the number or the option name to get started!\n\nNote: For full functionality including booking and vehicle search, please log in to your account.',
      isUser: false,
      timestamp: new Date(Date.now() - 300000),
      avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      agentName: 'Sarah Martinez'
    }
  ]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const openChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const closeChat = () => setIsOpen(false);
  const toggleChat = () => isOpen ? closeChat() : openChat();

  // Create or get chat session
  

  const createSession = async () => {
    try {
      // Check if user is authenticated first
      if (!isAuthenticated) {
        console.warn('User not authenticated. Creating demo session.');
        const demoSessionId = `demo-session-${Date.now()}`;
        setSessionId(demoSessionId);
        return demoSessionId;
      }

      // First, try to get existing sessions for the user
      try {
        const existingSessionsResponse = await fetch('http://localhost:3001/api/chat/sessions', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (existingSessionsResponse.ok) {
          const sessionsData = await existingSessionsResponse.json();
          if (sessionsData.success && sessionsData.sessions && sessionsData.sessions.length > 0) {
            // Use the most recent session
            const latestSession = sessionsData.sessions[0];
            setSessionId(latestSession.id);
            return latestSession.id;
          }
        }
      } catch (error) {
        console.log('No existing sessions found, creating new one');
      }

      // If no existing sessions, create a new one
      const response = await fetch('http://localhost:3001/api/chat/session', {
        method: 'POST',
        credentials: 'include', // This sends cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSessionId(data.sessionId);
          return data.sessionId;
        }
      } else {
        console.error('Failed to create session:', response.status, response.statusText);
        // Fallback to demo session
        const demoSessionId = `demo-session-${Date.now()}`;
        setSessionId(demoSessionId);
        return demoSessionId;
      }
    } catch (error) {
      console.error('Error creating session:', error);
      // Fallback to demo session
      const demoSessionId = `demo-session-${Date.now()}`;
      setSessionId(demoSessionId);
      return demoSessionId;
    }
    return null;
  };

  const sendMessage = async (text: string, retryCount: number = 0) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Create session if we don't have one
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = await createSession();
        if (!currentSessionId) {
          throw new Error('Failed to create chat session');
        }
      }

      // Check if user is selecting an option (1-6 or option names)
      const isOptionSelection = /^[1-6]$|^(chat|booking|car|price|vehicle|update|rental)$/i.test(text.trim());
      
      let response;
      
      if (isOptionSelection) {
        // Route to option handler
        response = await fetch('http://localhost:3001/api/aichat/route', {
          method: 'POST',
          credentials: 'include', // This sends cookies for authentication
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            option: text.trim(),
            sessionId: currentSessionId
          }),
        });
      } else {
        // Regular chat message - use the advanced chat system with tool calls
        response = await fetch(`http://localhost:3001/api/chat/session/${currentSessionId}/message`, {
          method: 'POST',
          credentials: 'include', // This sends cookies for authentication
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: text
          }),
        });
      }

      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated, provide demo response
          const demoResponse = {
            success: true,
            aiMessage: {
              id: Date.now().toString(),
              message: isOptionSelection 
                ? `Thank you for selecting option ${text.trim()}. For demo purposes, I can help you with general inquiries about Beta Car Hire. Please log in to access full functionality including booking and vehicle search.`
                : `Thank you for your message: "${text}". I'm Sarah Martinez from Beta Car Hire. For demo purposes, I can provide general information. Please log in to access our full booking system and vehicle database.`,
              createdAt: new Date().toISOString()
            }
          };
          
          const agentResponse: ChatMessage = {
            id: demoResponse.aiMessage.id,
            text: demoResponse.aiMessage.message,
            isUser: false,
            timestamp: new Date(demoResponse.aiMessage.createdAt),
            avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
            agentName: 'Sarah Martinez'
          };

          setMessages(prev => [...prev, agentResponse]);
          
          if (!isOpen) {
            setUnreadCount(prev => prev + 1);
          }
          return;
        } else if (response.status === 403 && retryCount < 1) {
          // Session access denied, try to create a new session (only retry once)
          console.warn('Session access denied, creating new session');
          const newSessionId = await createSession();
          if (newSessionId) {
            // Retry the message with the new session
            return sendMessage(text, retryCount + 1);
          } else {
            // Fallback to demo response
            const demoResponse = {
              success: true,
              aiMessage: {
                id: Date.now().toString(),
                message: `I apologize, but there was an issue with your chat session. Please try refreshing the page or logging in again. For now, I can help with general inquiries about Beta Car Hire.`,
                createdAt: new Date().toISOString()
              }
            };
            
            const agentResponse: ChatMessage = {
              id: demoResponse.aiMessage.id,
              text: demoResponse.aiMessage.message,
              isUser: false,
              timestamp: new Date(demoResponse.aiMessage.createdAt),
              avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
              agentName: 'Sarah Martinez'
            };

            setMessages(prev => [...prev, agentResponse]);
            
            if (!isOpen) {
              setUnreadCount(prev => prev + 1);
            }
            return;
          }
        }
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const agentResponse: ChatMessage = {
          id: data.aiMessage.id,
          text: data.aiMessage.message,
          isUser: false,
          timestamp: new Date(data.aiMessage.createdAt),
          avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
          agentName: 'Sarah Martinez'
        };

        setMessages(prev => [...prev, agentResponse]);
        
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an issue processing your request. Please try again or contact our support team.',
        isUser: false,
        timestamp: new Date(),
        avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        agentName: 'Sarah Martinez'
      };

      setMessages(prev => [...prev, fallbackResponse]);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = () => setUnreadCount(0);

  const value: ChatContextType = {
    messages,
    isOpen,
    unreadCount,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    markAsRead,
    sessionId,
    isLoading
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};