'use client';

import { Shield, Scan, DollarSign, AlertTriangle, BarChart3, Gavel } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Scan,
    title: 'AI-Powered Detection',
    description: 'Advanced computer vision and audio fingerprinting to detect IP violations across the internet in real-time.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Shield,
    title: 'Automated Protection',
    description: 'One-click IP registration on Story Protocol with smart metadata management and bulk registration support.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: DollarSign,
    title: 'IPFi Marketplace',
    description: 'Fractional ownership, automated licensing, and secondary markets for IP trading with transparent royalties.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: AlertTriangle,
    title: 'Violation Alerts',
    description: 'Real-time monitoring with severity scoring and instant notifications when your content is used without permission.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: Gavel,
    title: 'Smart Disputes',
    description: 'AI-powered evidence collection, automated cease & desist, and on-chain dispute resolution.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive insights on IP usage, revenue tracking, portfolio management, and performance metrics.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
];

export function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Powerful Features for{' '}
            <span className="gradient-text">Complete Protection</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Everything you need to protect, monitor, and monetize your intellectual property
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition card-hover"
            >
              <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
