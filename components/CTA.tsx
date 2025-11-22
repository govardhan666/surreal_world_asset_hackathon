'use client';

import { ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Protect Your IP?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of creators protecting and monetizing their intellectual property with AI and blockchain
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition group"
              >
                <Shield className="h-5 w-5" />
                <span>Start Protecting Now</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/scan"
                className="flex items-center space-x-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                <span>Try Free Scan</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
