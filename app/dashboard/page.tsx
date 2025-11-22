'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Shield, TrendingUp, AlertTriangle, DollarSign, Plus, Eye } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import Link from 'next/link';
import { getUserIPs, getAnalytics } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [ipAssets, setIpAssets] = useState([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      loadDashboardData();
    }
  }, [isConnected, address]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [ipsData, analyticsData] = await Promise.all([
        getUserIPs(address!).catch(() => ({ ips: [] })),
        getAnalytics(address!).catch(() => null),
      ]);
      setIpAssets(ipsData.ips || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
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
            <Shield className="h-16 w-16 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400">Please connect your wallet to access the dashboard</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Manage your intellectual property portfolio</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {ipAssets.length}
              </div>
              <div className="text-gray-400 text-sm">Protected Assets</div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {analytics?.violations || 0}
              </div>
              <div className="text-gray-400 text-sm">Active Violations</div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                ${analytics?.revenue || '0.00'}
              </div>
              <div className="text-gray-400 text-sm">Total Revenue</div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                +{analytics?.growth || 0}%
              </div>
              <div className="text-gray-400 text-sm">Growth Rate</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              href="/scan"
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <Plus className="h-5 w-5" />
              <span>Register New IP</span>
            </Link>
            <Link
              href="/scan"
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition border border-gray-700"
            >
              <Eye className="h-5 w-5" />
              <span>Scan Content</span>
            </Link>
          </div>

          {/* IP Assets List */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your IP Assets</h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading assets...</p>
              </div>
            ) : ipAssets.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No IP assets registered yet</p>
                <Link
                  href="/scan"
                  className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  <Plus className="h-5 w-5" />
                  <span>Register Your First IP</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {ipAssets.map((asset: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                          <Shield className="h-6 w-6 text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{asset.name || 'Untitled Asset'}</h3>
                          <p className="text-gray-400 text-sm">{asset.type || 'Unknown Type'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">${asset.revenue || '0.00'}</div>
                        <div className="text-gray-400 text-sm">Revenue</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
