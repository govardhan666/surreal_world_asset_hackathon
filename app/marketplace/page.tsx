'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Shield, TrendingUp, DollarSign, Tag } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { getMarketplaceListings, createLicenseOffer } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function MarketplacePage() {
  const { address, isConnected } = useAccount();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'image' | 'audio' | 'video' | 'text'>('all');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const data = await getMarketplaceListings().catch(() => ({ listings: [] }));
      setListings(data.listings || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast.error('Failed to load marketplace listings');
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(
    (listing: any) => filter === 'all' || listing.type === filter
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              IP <span className="gradient-text">Marketplace</span>
            </h1>
            <p className="text-xl text-gray-400">
              Discover, license, and trade intellectual property assets
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            {(['all', 'image', 'audio', 'video', 'text'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-3 rounded-lg font-semibold capitalize transition ${
                  filter === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Marketplace Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Tag className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{listings.length}</div>
                  <div className="text-gray-400">Active Listings</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">$125K</div>
                  <div className="text-gray-400">Total Volume</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">+34%</div>
                  <div className="text-gray-400">Growth (30d)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading marketplace...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-xl">
              <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No listings found for this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition card-hover"
                >
                  {/* Image Placeholder */}
                  <div className="bg-gradient-to-br from-primary-600 to-secondary-600 h-48 flex items-center justify-center">
                    <Shield className="h-16 w-16 text-white/50" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-primary-500/10 text-primary-400 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                        {listing.type || 'image'}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {listing.views || 0} views
                      </span>
                    </div>

                    <h3 className="text-white font-bold text-lg mb-2">
                      {listing.name || 'Untitled Asset'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {listing.description || 'No description available'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div>
                        <div className="text-gray-400">Floor Price</div>
                        <div className="text-white font-semibold">${listing.price || '0.00'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400">Royalty</div>
                        <div className="text-white font-semibold">{listing.royalty || '10'}%</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => {
                        if (!isConnected) {
                          toast.error('Please connect your wallet');
                          return;
                        }
                        toast.success('License purchase coming soon!');
                      }}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition"
                    >
                      Purchase License
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
