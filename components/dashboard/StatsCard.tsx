import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  color?: "purple" | "blue" | "red" | "green";
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  color = "purple",
}: StatsCardProps) {
  const colorClasses = {
    purple: "bg-purple-500/20 text-purple-400",
    blue: "bg-blue-500/20 text-blue-400",
    red: "bg-red-500/20 text-red-400",
    green: "bg-green-500/20 text-green-400",
  };

  const isPositive = trend && trend.value >= 0;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
        {trend && (
          <p className="text-gray-500 text-xs mt-1">{trend.label}</p>
        )}
      </div>
    </div>
  );
}
