import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, CreditCard, Save, Camera, Key, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'payment' | 'preferences'>('personal');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Executive Drive, Business District, NY 10001'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Bell }
  ];

  const savedCards = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '09/25', isDefault: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-4">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
              alt={user?.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-[#D4AF37] text-[#0B132B] rounded-full shadow-lg hover:bg-[#B8941F] transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <h1 className="text-3xl font-bold text-[#0B132B] mb-2">{user?.name}</h1>
          <p className="text-gray-600">Executive Member since 2024</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-xl border border-[#E5E5E5]/20 p-1 flex shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#0B132B] text-white'
                    : 'text-[#0B132B] hover:bg-[#E5E5E5]/50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-[#E5E5E5]/20 p-8"
        >
          {activeTab === 'personal' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0B132B]">Personal Information</h2>
                <Button
                  variant={isEditing ? 'secondary' : 'outline'}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0B132B] mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0B132B] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0B132B] mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0B132B] mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6 border-t border-[#E5E5E5]/20">
                    <Button type="submit" variant="primary">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>

              {/* Security Section */}
              <div className="mt-8 pt-8 border-t border-[#E5E5E5]/20">
                <h3 className="text-lg font-semibold text-[#0B132B] mb-4">Security</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0B132B]">Payment Methods</h2>
                <Button variant="primary">
                  Add New Card
                </Button>
              </div>

              <div className="space-y-4">
                {savedCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between p-4 border border-[#E5E5E5] rounded-xl hover:border-[#0B132B] transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-[#0B132B] to-[#1C2541] rounded flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-[#0B132B]">{card.type} •••• {card.last4}</p>
                        <p className="text-sm text-gray-600">Expires {card.expiry}</p>
                      </div>
                      {card.isDefault && (
                        <span className="px-2 py-1 bg-[#D4AF37] text-[#0B132B] text-xs font-medium rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-[#F8F9FA] to-[#E5E5E5]/50 rounded-xl">
                <h3 className="font-semibold text-[#0B132B] mb-2">Billing Information</h3>
                <p className="text-gray-600 text-sm">
                  All payments are processed securely. Your card information is encrypted and never stored on our servers.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-2xl font-bold text-[#0B132B] mb-6">Preferences & Settings</h2>

              <div className="space-y-8">
                {/* Notifications */}
                <div>
                  <h3 className="text-lg font-semibold text-[#0B132B] mb-4">Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'booking', label: 'Booking confirmations', enabled: true },
                      { id: 'reminders', label: 'Pickup reminders', enabled: true },
                      { id: 'promotions', label: 'Special offers and promotions', enabled: false },
                      { id: 'updates', label: 'Service updates', enabled: true }
                    ].map((pref) => (
                      <div key={pref.id} className="flex items-center justify-between p-4 border border-[#E5E5E5] rounded-xl">
                        <div>
                          <p className="font-medium text-[#0B132B]">{pref.label}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={pref.enabled}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0B132B]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0B132B]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-[#0B132B] mb-4">Rental Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0B132B] mb-2">
                        Preferred Vehicle Category
                      </label>
                      <select className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent">
                        <option>Luxury</option>
                        <option>SUV</option>
                        <option>Electric</option>
                        <option>Economy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0B132B] mb-2">
                        Preferred Pickup Time
                      </label>
                      <select className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent">
                        <option>Morning (8AM - 12PM)</option>
                        <option>Afternoon (12PM - 6PM)</option>
                        <option>Evening (6PM - 10PM)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5]/20">
                <Button variant="primary">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};