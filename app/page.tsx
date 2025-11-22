'use client';

import { Shield, Scan, DollarSign, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Stats } from '@/components/Stats';
import { HowItWorks } from '@/components/HowItWorks';
import { CTA } from '@/components/CTA';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
