import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Phone, Mail, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useChat, ChatMessage } from '../context/ChatContext';
import { Button } from '../components/ui/Button';

export const Support: React.FC = () => {
  const { messages, sendMessage } = useChat();
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

  const contactMethods = [
    {
      icon: Phone,
      title: '24/7 Concierge Line',
      description: 'Speak with our executive support team',
      contact: '+1 (555) 123-4567',
      available: 'Available 24/7'
    },
    {
      icon: Mail,
      title: 'Executive Support',
      description: 'Email our premium support team',
      contact: 'concierge@betacarhire.com',
      available: 'Response within 2 hours'
    },
    {
      icon: MapPin,
      title: 'Executive Lounge',
      description: 'Visit our premium location',
      contact: '123 Executive Drive, Business District',
      available: 'Mon-Fri 8AM-8PM'
    }
  ];

  const faqItems = [
    {
      question: 'How do I modify or cancel my reservation?',
      answer: 'You can modify or cancel your reservation up to 24 hours before pickup through your booking dashboard or by contacting our concierge team.'
    },
    {
      question: 'What is included in the premium package?',
      answer: 'All our rentals include comprehensive insurance, 24/7 roadside assistance, concierge service, and complimentary vehicle delivery and pickup.'
    },
    {
      question: 'Do you offer chauffeur services?',
      answer: 'Yes, we provide professional chauffeur services for all our luxury vehicles. Contact our concierge team to arrange this premium service.'
    },
    {
      question: 'What are your pickup and drop-off options?',
      answer: 'We offer flexible pickup and drop-off at airports, hotels, offices, or any location within our service area. Delivery is complimentary for bookings over 3 days.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#0B132B] mb-6">Executive Support</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our dedicated concierge team is available 24/7 to ensure your luxury car rental experience exceeds expectations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-[#E5E5E5]/20 overflow-hidden h-[600px] flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-6 bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                    alt="Support Agent"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">Sarah Martinez</h3>
                    <p className="text-sm text-[#E5E5E5]">Executive Support Specialist</p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Online</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#F8F9FA] to-white">
                {messages.map((message: ChatMessage) => (
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
                        className={`p-4 rounded-2xl ${
                          message.isUser
                            ? 'bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white'
                            : 'bg-white border border-[#E5E5E5] text-[#0B132B] shadow-sm'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-2 ${message.isUser ? 'text-[#E5E5E5]' : 'text-gray-500'}`}>
                          {format(message.timestamp, 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E5E5E5]/20">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="p-3 bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Contact Methods & FAQ */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-[#E5E5E5]/20 p-6"
            >
              <h3 className="text-xl font-bold text-[#0B132B] mb-6">Other Ways to Reach Us</h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-xl hover:bg-[#F8F9FA] transition-colors">
                    <div className="p-2 bg-[#0B132B] rounded-lg">
                      <method.icon className="h-5 w-5 text-[#D4AF37]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#0B132B]">{method.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                      <p className="text-sm font-medium text-[#0B132B]">{method.contact}</p>
                      <p className="text-xs text-gray-500">{method.available}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-r from-[#0B132B] to-[#1C2541] rounded-2xl p-6 text-white"
            >
              <h3 className="text-xl font-bold mb-4">Need Immediate Assistance?</h3>
              <p className="text-[#E5E5E5] mb-4">
                For urgent matters or roadside assistance, call our 24/7 emergency line.
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                Call Emergency Line
              </Button>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-[#0B132B] text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-[#E5E5E5]/20 p-6">
                <h3 className="text-lg font-semibold text-[#0B132B] mb-3">{item.question}</h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};