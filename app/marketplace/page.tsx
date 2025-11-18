"use client";

import { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Filter,
  Search,
  ShoppingCart,
  ArrowUpDown,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MarketplaceCard from "@/components/marketplace/MarketplaceCard";
import PurchaseModal from "@/components/marketplace/PurchaseModal";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  // Mock marketplace data
  const marketplaceAssets = [
    {
      id: "1",
      name: "Digital Art Collection #1",
      type: "image",
      owner: "0x1234...5678",
      totalShares: 1000,
      availableShares: 450,
      pricePerShare: 0.1,
      totalRevenue: 5.2,
      holders: 12,
      image: "https://picsum.photos/seed/art1/400/300",
      royaltyPercentage: 10,
      trending: true,
    },
    {
      id: "2",
      name: "Music Album - Ethereal Dreams",
      type: "audio",
      owner: "0x2345...6789",
      totalShares: 2000,
      availableShares: 800,
      pricePerShare: 0.05,
      totalRevenue: 8.5,
      holders: 25,
      image: "https://picsum.photos/seed/music1/400/300",
      royaltyPercentage: 15,
      trending: true,
    },
    {
      id: "3",
      name: "Documentary Film Series",
      type: "video",
      owner: "0x3456...7890",
      totalShares: 5000,
      availableShares: 1200,
      pricePerShare: 0.08,
      totalRevenue: 15.8,
      holders: 48,
      image: "https://picsum.photos/seed/video1/400/300",
      royaltyPercentage: 12,
      trending: false,
    },
    {
      id: "4",
      name: "Photography Portfolio",
      type: "image",
      owner: "0x4567...8901",
      totalShares: 1500,
      availableShares: 600,
      pricePerShare: 0.12,
      totalRevenue: 3.6,
      holders: 18,
      image: "https://picsum.photos/seed/photo1/400/300",
      royaltyPercentage: 8,
      trending: false,
    },
    {
      id: "5",
      name: "AI Generated Art Series",
      type: "image",
      owner: "0x5678...9012",
      totalShares: 3000,
      availableShares: 2100,
      pricePerShare: 0.06,
      totalRevenue: 2.1,
      holders: 8,
      image: "https://picsum.photos/seed/ai1/400/300",
      royaltyPercentage: 20,
      trending: true,
    },
    {
      id: "6",
      name: "Podcast Series - Tech Talks",
      type: "audio",
      owner: "0x6789...0123",
      totalShares: 1000,
      availableShares: 250,
      pricePerShare: 0.15,
      totalRevenue: 12.4,
      holders: 32,
      image: "https://picsum.photos/seed/podcast1/400/300",
      royaltyPercentage: 18,
      trending: false,
    },
  ];

  const categories = [
    { id: "all", name: "All Assets" },
    { id: "image", name: "Images" },
    { id: "audio", name: "Audio" },
    { id: "video", name: "Video" },
  ];

  const filteredAssets = marketplaceAssets
    .filter((asset) => {
      const matchesCategory = selectedCategory === "all" || asset.type === selectedCategory;
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.owner.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "trending":
          return b.trending ? 1 : -1;
        case "price-low":
          return a.pricePerShare - b.pricePerShare;
        case "price-high":
          return b.pricePerShare - a.pricePerShare;
        case "revenue":
          return b.totalRevenue - a.totalRevenue;
        default:
          return 0;
      }
    });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">IPFi Marketplace</h1>
          <p className="text-gray-400 mt-1">
            Buy fractional ownership in IP assets and earn passive income
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Value Locked</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">$48,250</div>
            <div className="text-green-400 text-sm mt-1">+12.5% this month</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Active Assets</span>
              <ShoppingCart className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">142</div>
            <div className="text-gray-400 text-sm mt-1">6 listed today</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Holders</span>
              <Users className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">1,234</div>
            <div className="text-gray-400 text-sm mt-1">+89 this week</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Avg. ROI</span>
              <DollarSign className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">18.5%</div>
            <div className="text-green-400 text-sm mt-1">Annual return</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search IP assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg p-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-md transition-all ${
                  selectedCategory === category.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="trending">Trending</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="revenue">Revenue: High to Low</option>
            </select>
          </div>
        </div>

        {/* Marketplace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <MarketplaceCard
              key={asset.id}
              asset={asset}
              onPurchase={() => setSelectedAsset(asset)}
            />
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No assets found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {selectedAsset && (
        <PurchaseModal
          asset={selectedAsset}
          isOpen={!!selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </DashboardLayout>
  );
}
