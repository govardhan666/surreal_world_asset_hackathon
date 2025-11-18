import { Image, Music, Video, AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface IPAsset {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "text";
  status: "protected" | "monitoring" | "violation";
  registrationDate: Date;
  revenue: number;
  violations: number;
  thumbnail?: string;
}

interface IPAssetCardProps {
  asset: IPAsset;
}

export default function IPAssetCard({ asset }: IPAssetCardProps) {
  const getTypeIcon = () => {
    switch (asset.type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "audio":
        return <Music className="w-4 h-4" />;
      default:
        return <Image className="w-4 h-4" />;
    }
  };

  const getStatusBadge = () => {
    switch (asset.status) {
      case "protected":
        return (
          <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
            <CheckCircle className="w-3 h-3" />
            <span>Protected</span>
          </div>
        );
      case "monitoring":
        return (
          <div className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
            <Eye className="w-3 h-3" />
            <span>Monitoring</span>
          </div>
        );
      case "violation":
        return (
          <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
            <AlertTriangle className="w-3 h-3" />
            <span>Violation</span>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all">
      {/* Thumbnail */}
      <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
        {asset.thumbnail ? (
          <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
        ) : (
          getTypeIcon()
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-white font-medium truncate">{asset.name}</h3>
            <p className="text-gray-400 text-sm">
              Registered {formatDate(asset.registrationDate)}
            </p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-green-400">
            Revenue: {formatCurrency(asset.revenue)}
          </div>
          {asset.violations > 0 && (
            <div className="text-red-400">
              {asset.violations} violation{asset.violations > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
