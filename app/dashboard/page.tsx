"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import {
  Shield,
  Upload,
  Scan,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import IPAssetCard from "@/components/dashboard/IPAssetCard";
import RegisterIPModal from "@/components/dashboard/RegisterIPModal";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  const { address } = useAccount();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Mock data - replace with real data from blockchain/API
  const stats = {
    totalAssets: 12,
    activeMonitoring: 12,
    violations: 3,
    totalRevenue: 2450.50,
    monthlyRevenue: 892.30,
    revenueGrowth: 23.5,
  };

  const recentAssets = [
    {
      id: "1",
      name: "Digital Artwork #1",
      type: "image" as const,
      status: "protected" as const,
      registrationDate: new Date("2024-11-15"),
      revenue: 450.00,
      violations: 0,
      thumbnail: "https://picsum.photos/seed/art1/400/300",
    },
    {
      id: "2",
      name: "Music Track - Sunset Dreams",
      type: "audio" as const,
      status: "monitoring" as const,
      registrationDate: new Date("2024-11-14"),
      revenue: 1200.50,
      violations: 1,
      thumbnail: "https://picsum.photos/seed/music1/400/300",
    },
    {
      id: "3",
      name: "Video Tutorial Series",
      type: "video" as const,
      status: "violation" as const,
      registrationDate: new Date("2024-11-10"),
      revenue: 800.00,
      violations: 2,
      thumbnail: "https://picsum.photos/seed/video1/400/300",
    },
  ];

  const recentActivity = [
    {
      id: "1",
      type: "registration",
      message: "New IP asset registered: Digital Artwork #1",
      timestamp: new Date("2024-11-15T10:30:00"),
    },
    {
      id: "2",
      type: "violation",
      message: "Violation detected on Music Track - Sunset Dreams",
      timestamp: new Date("2024-11-15T09:15:00"),
    },
    {
      id: "3",
      type: "revenue",
      message: "Royalty payment received: $150.00",
      timestamp: new Date("2024-11-14T16:45:00"),
    },
    {
      id: "4",
      type: "license",
      message: "License purchased for Video Tutorial Series",
      timestamp: new Date("2024-11-14T14:20:00"),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Manage and monitor your intellectual property
            </p>
          </div>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all flex items-center space-x-2 shadow-lg shadow-purple-500/30"
          >
            <Upload className="w-5 h-5" />
            <span>Register New IP</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total IP Assets"
            value={formatNumber(stats.totalAssets)}
            icon={<Shield className="w-6 h-6" />}
            trend={{ value: 12, label: "this month" }}
            color="purple"
          />
          <StatsCard
            title="Active Monitoring"
            value={formatNumber(stats.activeMonitoring)}
            icon={<Eye className="w-6 h-6" />}
            trend={{ value: 100, label: "coverage" }}
            color="blue"
          />
          <StatsCard
            title="Violations Detected"
            value={formatNumber(stats.violations)}
            icon={<AlertTriangle className="w-6 h-6" />}
            trend={{ value: -25, label: "vs last month" }}
            color="red"
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={<DollarSign className="w-6 h-6" />}
            trend={{ value: stats.revenueGrowth, label: "this month" }}
            color="green"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent IP Assets */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent IP Assets</h2>
                <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentAssets.map((asset) => (
                  <IPAssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activity.type === "registration"
                          ? "bg-green-500/20 text-green-400"
                          : activity.type === "violation"
                          ? "bg-red-500/20 text-red-400"
                          : activity.type === "revenue"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {activity.type === "registration" && <CheckCircle className="w-5 h-5" />}
                      {activity.type === "violation" && <AlertTriangle className="w-5 h-5" />}
                      {activity.type === "revenue" && <DollarSign className="w-5 h-5" />}
                      {activity.type === "license" && <FileText className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{activity.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.timestamp.toLocaleTimeString()} •{" "}
                        {activity.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl text-left hover:transform hover:scale-105 transition-all shadow-lg shadow-purple-500/30">
            <Scan className="w-8 h-8 text-white mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Scan for Violations</h3>
            <p className="text-purple-100 text-sm">
              Run AI-powered scan to detect unauthorized usage
            </p>
          </button>

          <button className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl text-left hover:transform hover:scale-105 transition-all shadow-lg shadow-blue-500/30">
            <TrendingUp className="w-8 h-8 text-white mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">View Analytics</h3>
            <p className="text-blue-100 text-sm">
              Detailed insights on your IP portfolio performance
            </p>
          </button>

          <button className="p-6 bg-gradient-to-br from-green-600 to-green-700 rounded-xl text-left hover:transform hover:scale-105 transition-all shadow-lg shadow-green-500/30">
            <DollarSign className="w-8 h-8 text-white mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Claim Revenue</h3>
            <p className="text-green-100 text-sm">
              Withdraw your accumulated royalty payments
            </p>
          </button>
        </div>
      </div>

      {/* Register IP Modal */}
      <RegisterIPModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </DashboardLayout>
  );
}
