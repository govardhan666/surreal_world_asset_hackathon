'use client';

import { Shield } from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold gradient-text">IP Guardian</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
              Dashboard
            </Link>
            <Link href="/scan" className="text-gray-300 hover:text-white transition">
              Scan
            </Link>
            <Link href="/marketplace" className="text-gray-300 hover:text-white transition">
              Marketplace
            </Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition">
              Analytics
            </Link>
          </div>

          {/* Connect Wallet */}
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
