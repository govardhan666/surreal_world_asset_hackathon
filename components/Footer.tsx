'use client';

import { Shield, Github, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">IP Guardian</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Protecting and monetizing intellectual property with AI and blockchain technology.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              <li><Link href="/scan" className="hover:text-white transition">Scanner</Link></li>
              <li><Link href="/marketplace" className="hover:text-white transition">Marketplace</Link></li>
              <li><Link href="/analytics" className="hover:text-white transition">Analytics</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/docs" className="hover:text-white transition">Documentation</Link></li>
              <li><Link href="/api" className="hover:text-white transition">API Reference</Link></li>
              <li><Link href="/guides" className="hover:text-white transition">Guides</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 IP Guardian. Built for Surreal World Assets Buildathon.
          </p>
          <div className="flex items-center space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="mailto:contact@ipguardian.io" className="text-gray-400 hover:text-white transition">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
