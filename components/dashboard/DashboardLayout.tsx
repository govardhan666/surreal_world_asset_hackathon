"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  Shield,
  LayoutDashboard,
  ShoppingCart,
  Activity,
  Settings,
  Menu,
  X,
  Wallet,
  LogOut,
} from "lucide-react";
import { formatAddress } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Marketplace", href: "/marketplace", icon: <ShoppingCart className="w-5 h-5" /> },
    { name: "Analytics", href: "/analytics", icon: <Activity className="w-5 h-5" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const handleConnect = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full px-4 py-6 bg-black/20 backdrop-blur-xl border-r border-white/10">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8 px-2">
            <Shield className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">IP Guardian</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Wallet Section */}
          <div className="absolute bottom-6 left-4 right-4">
            {isConnected && address ? (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Connected</span>
                  <button
                    onClick={() => disconnect()}
                    className="text-red-400 hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-mono text-sm">
                    {formatAddress(address)}
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <Wallet className="w-5 h-5" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white hover:text-purple-400"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex-1 lg:flex-none"></div>

            <div className="flex items-center space-x-4">
              {isConnected && address && (
                <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Wallet className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-mono text-sm">
                    {formatAddress(address)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 relative z-10">{children}</main>
      </div>
    </div>
  );
}
