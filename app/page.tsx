"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Scan,
  Coins,
  TrendingUp,
  Lock,
  Zap,
  CheckCircle,
  ArrowRight,
  Play
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const features = [
    {
      icon: <Scan className="w-6 h-6" />,
      title: "AI-Powered Detection",
      description: "Advanced computer vision and audio fingerprinting to detect IP violations across the internet"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Automated Protection",
      description: "One-click registration on Story Protocol with real-time monitoring and enforcement"
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Fractional Ownership",
      description: "Monetize your IP through fractionalization and automated royalty distribution"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Revenue Analytics",
      description: "Track licensing revenue, usage metrics, and portfolio performance in real-time"
    }
  ];

  const stats = [
    { value: "$300B+", label: "Annual IP Theft" },
    { value: "99%", label: "Detection Accuracy" },
    { value: "<60s", label: "Registration Time" },
    { value: "24/7", label: "Monitoring" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">IP Guardian</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-white hover:text-purple-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/marketplace" className="text-white hover:text-purple-400 transition-colors">
                Marketplace
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Launch App
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full mb-8 border border-purple-500/30">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm">Powered by Story Protocol & AI</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              Protect Your IP with
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI-Powered Detection
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Detect violations, register instantly, and monetize your intellectual property
              with the most advanced protection platform on Web3.
            </p>

            <div className="flex items-center justify-center space-x-4">
              <Link
                href="/dashboard"
                className="group px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all flex items-center space-x-2 shadow-lg shadow-purple-500/50"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all flex items-center space-x-2 backdrop-blur-sm">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Complete IP Protection Ecosystem
          </h2>
          <p className="text-gray-400 text-lg">
            From detection to monetization, everything you need in one platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg">
            Protect your content in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: "01",
              title: "Upload & Scan",
              description: "Upload your content or install our browser extension. AI automatically scans for originality and registration status."
            },
            {
              step: "02",
              title: "Register & Protect",
              description: "One-click registration on Story Protocol. Real-time monitoring begins immediately across all platforms."
            },
            {
              step: "03",
              title: "Monetize & Earn",
              description: "Automated licensing, fractional ownership, and instant royalty distribution to your wallet."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              <div className="text-6xl font-bold text-purple-500/20 mb-4">{item.step}</div>
              <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
              {index < 2 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-purple-500/30"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Protect Your Content?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators protecting and monetizing their intellectual property with IP Guardian.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
          >
            <span>Start Protecting Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold text-white">IP Guardian</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered content protection on Story Protocol
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link></li>
                <li><Link href="/marketplace" className="hover:text-purple-400 transition-colors">Marketplace</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Browser Extension</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 IP Guardian. Built for Surreal World Assets Buildathon on Story Protocol.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
