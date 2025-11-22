'use client';

import { TrendingUp, Users, Shield, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  {
    icon: Shield,
    value: '10K+',
    label: 'Protected Assets',
    color: 'text-blue-400',
  },
  {
    icon: Users,
    value: '5K+',
    label: 'Active Creators',
    color: 'text-green-400',
  },
  {
    icon: TrendingUp,
    value: '99.9%',
    label: 'Accuracy Rate',
    color: 'text-purple-400',
  },
  {
    icon: DollarSign,
    value: '$2M+',
    label: 'Revenue Protected',
    color: 'text-yellow-400',
  },
];

export function Stats() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-gray-700/50 w-16 h-16 rounded-full flex items-center justify-center">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
