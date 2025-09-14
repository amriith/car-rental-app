import React from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Calendar, TrendingUp, DollarSign, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Admin: React.FC = () => {
  const stats = [
    { label: 'Total Vehicles', value: '156', icon: Car, change: '+12%' },
    { label: 'Active Bookings', value: '89', icon: Calendar, change: '+8%' },
    { label: 'Total Customers', value: '2,847', icon: Users, change: '+15%' },
    { label: 'Monthly Revenue', value: '$124,500', icon: DollarSign, change: '+23%' }
  ];

  const recentBookings = [
    { id: 1, customer: 'John Executive', car: 'Mercedes S-Class', status: 'confirmed', amount: '$750' },
    { id: 2, customer: 'Sarah Johnson', car: 'BMW X7', status: 'pending', amount: '$1,100' },
    { id: 3, customer: 'Michael Chen', car: 'Tesla Model S', status: 'completed', amount: '$800' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-[#0B132B] mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">
            Manage your luxury car rental operations and monitor business performance.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-lg border border-[#E5E5E5]/20 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-[#0B132B] to-[#1C2541] rounded-xl">
                  <stat.icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-[#0B132B] mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-[#E5E5E5]/20 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#0B132B]">Recent Bookings</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5E5]/20">
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Customer</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Vehicle</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-[#E5E5E5]/10">
                      <td className="py-4">
                        <div className="font-medium text-[#0B132B]">{booking.customer}</div>
                      </td>
                      <td className="py-4">
                        <div className="text-gray-600">{booking.car}</div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="font-medium text-[#0B132B]">{booking.amount}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-[#E5E5E5]/20 p-6">
              <h3 className="text-xl font-bold text-[#0B132B] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="primary" size="sm" className="w-full justify-start">
                  <Car className="h-4 w-4 mr-2" />
                  Add New Vehicle
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Customers
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics Report
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2541] rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fleet Utilization</span>
                  <span className="text-[#D4AF37]">87%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>System Health</span>
                  <span className="text-green-400">Optimal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Locations</span>
                  <span className="text-[#D4AF37]">12/15</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center p-8 bg-gradient-to-r from-[#F8F9FA] to-[#E5E5E5]/50 rounded-2xl"
        >
          <h3 className="text-2xl font-bold text-[#0B132B] mb-4">Advanced Admin Features Coming Soon</h3>
          <p className="text-gray-600 mb-6">
            This admin dashboard is ready for backend integration. Features like real-time fleet management, 
            advanced analytics, and customer relationship management will be available once connected to your API.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="primary">
              Connect Backend API
            </Button>
            <Button variant="outline">
              View Documentation
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};