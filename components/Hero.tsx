'use client';

import { Shield, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="h-4 w-4 text-primary-400" />
            <span className="text-sm text-primary-300">AI-Powered IP Protection Platform</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Protect Your{' '}
            <span className="gradient-text">Intellectual Property</span>
            <br />
            With AI & Blockchain
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto"
          >
            Detect violations, protect your content, and monetize your IP with our all-in-one platform
            powered by Story Protocol and advanced AI
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold transition group"
            >
              <Shield className="h-5 w-5" />
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              href="/scan"
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition border border-gray-700"
            >
              <Sparkles className="h-5 w-5" />
              <span>Try Demo</span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">$300B+</div>
              <div className="text-gray-400">Annual IP Theft</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Monitoring</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
