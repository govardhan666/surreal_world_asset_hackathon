'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { TrendingUp, DollarSign, Eye, Users } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAnalytics } from '@/lib/api-client';
import toast from 'react-hot-toast';

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 7000 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 8000 },
];

const usageData = [
  { day: 'Mon', views: 400 },
  { day: 'Tue', views: 300 },
  { day: 'Wed', views: 600 },
  { day: 'Thu', views: 800 },
  { day: 'Fri', views: 500 },
  { day: 'Sat', views: 700 },
  { day: 'Sun', views: 600 },
];

export default function AnalyticsPage() {
  const { address, isConnected } = useAccount();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (isConnected && address) {
      loadAnalytics();
    }
  }, [isConnected, address]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics(address!).catch(() => null);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <TrendingUp className="h-16 w-16 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400">Please connect your wallet to view analytics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="gradient-text">Analytics</span> Dashboard
              </h1>
              <p className="text-xl text-gray-400">
                Track your IP performance and revenue
              </p>
            </div>

            {/* Timeframe Selector */}
            <div className="flex space-x-2">
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    timeframe === period
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <span className="text-green-400 text-sm font-semibold">+12.5%</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">$12,450</div>
              <div className="text-gray-400 text-sm">Total Revenue</div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-400" />
                </div>
                <span className="text-blue-400 text-sm font-semibold">+8.2%</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">45,678</div>
              <div className="text-gray-400 text-sm">Total Views</div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-purple-400 text-sm font-semibold">+15.3%</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">1,234</div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-400" />
                </div>
                <span className="text-yellow-400 text-sm font-semibold">+22.1%</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">89</div>
              <div className="text-gray-400 text-sm">Licenses Sold</div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Usage Chart */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Content Usage</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="views" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
