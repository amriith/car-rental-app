import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { format } from 'date-fns';

export const ChatWidget: React.FC = () => {
  const { messages, isOpen, unreadCount, toggleChat, closeChat, sendMessage, isLoading } = useChat();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText.trim());
      setMessageText('');
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={toggleChat}
          className="relative p-4 bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && !isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium"
            >
              {unreadCount}
            </motion.div>
          )}
        </button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[32rem] bg-white rounded-2xl shadow-2xl border border-[#E5E5E5]/20 z-50 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                  alt="Support Agent"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm">Sarah Martinez</h3>
                  <p className="text-xs text-[#E5E5E5]">Executive Support</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={closeChat}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  onClick={closeChat}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#F8F9FA] to-white">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!message.isUser && message.avatar && (
                      <img
                        src={message.avatar}
                        alt={message.agentName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div
                      className={`p-3 rounded-2xl ${
                        message.isUser
                          ? 'bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white'
                          : 'bg-white border border-[#E5E5E5] text-[#0B132B] shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isUser ? 'text-[#E5E5E5]' : 'text-gray-500'}`}>
                        {format(message.timestamp, 'HH:mm')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end space-x-2 max-w-[80%]">
                    <img
                      src="https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                      alt="Sarah Martinez"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="p-3 rounded-2xl bg-white border border-[#E5E5E5] text-[#0B132B] shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E5E5E5]/20">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || isLoading}
                  className="p-2 bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};