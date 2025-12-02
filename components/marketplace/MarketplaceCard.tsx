import { Image, Music, Video, TrendingUp, Users, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MarketplaceAsset {
  id: string;
  name: string;
  type: string;
  owner: string;
  totalShares: number;
  availableShares: number;
  pricePerShare: number;
  totalRevenue: number;
  holders: number;
  image: string;
  royaltyPercentage: number;
  trending: boolean;
}

interface MarketplaceCardProps {
  asset: MarketplaceAsset;
  onPurchase: () => void;
}

export default function MarketplaceCard({ asset, onPurchase }: MarketplaceCardProps) {
  const availabilityPercentage = (asset.availableShares / asset.totalShares) * 100;

  const getTypeIcon = () => {
    switch (asset.type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "audio":
        return <Music className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      default:
        return <Image className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/50 transition-all overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-900 to-pink-900">
        <img
          src={asset.image}
          alt={asset.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {asset.trending && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-purple-600 rounded-full flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-white" />
            <span className="text-white text-xs font-semibold">Trending</span>
          </div>
        )}
        <div className="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center space-x-1 text-white">
          {getTypeIcon()}
          <span className="text-xs capitalize">{asset.type}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 truncate">
            {asset.name}
          </h3>
          <p className="text-gray-400 text-sm">by {asset.owner}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-gray-400 text-xs mb-1">Price/Share</div>
            <div className="text-white font-semibold">
              {formatCurrency(asset.pricePerShare, "ETH")}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">Revenue</div>
            <div className="text-green-400 font-semibold">
              {formatCurrency(asset.totalRevenue, "ETH")}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">Holders</div>
            <div className="text-white font-semibold flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{asset.holders}</span>
            </div>
          </div>
        </div>

        {/* Availability Bar */}
        <div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-gray-400">
              {asset.availableShares.toLocaleString()} / {asset.totalShares.toLocaleString()} available
            </span>
            <span className="text-white font-semibold">
              {availabilityPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
              style={{ width: `${availabilityPercentage}%` }}
            />
          </div>
        </div>

        {/* Royalty */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Royalty Rate</span>
          <span className="text-purple-400 font-semibold">
            {asset.royaltyPercentage}%
          </span>
        </div>

        {/* Purchase Button */}
        <button
          onClick={onPurchase}
          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
        >
          <DollarSign className="w-4 h-4" />
          <span>Purchase Shares</span>
        </button>
      </div>
    </div>
  );
}
