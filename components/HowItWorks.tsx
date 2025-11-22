'use client';

import { Upload, Scan, Shield, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: Upload,
    title: 'Upload Content',
    description: 'Upload your original content or connect your social media accounts for automatic detection.',
    step: '01',
  },
  {
    icon: Shield,
    title: 'Auto-Register',
    description: 'One-click registration on Story Protocol with comprehensive metadata and provenance tracking.',
    step: '02',
  },
  {
    icon: Scan,
    title: 'AI Monitoring',
    description: 'Our AI scans the internet 24/7 to detect unauthorized usage and potential violations.',
    step: '03',
  },
  {
    icon: DollarSign,
    title: 'Monetize & Protect',
    description: 'Automated licensing, dispute resolution, and revenue distribution directly to your wallet.',
    step: '04',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
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
            How It <span className="gradient-text">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Protect your intellectual property in four simple steps
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-500 to-transparent" />
              )}

              {/* Step Card */}
              <div className="relative bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="bg-primary-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-primary-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
