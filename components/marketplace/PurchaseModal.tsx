"use client";

import { useState } from "react";
import { X, ShoppingCart, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PurchaseModalProps {
  asset: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchaseModal({ asset, isOpen, onClose }: PurchaseModalProps) {
  const [shares, setShares] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCost = shares * asset.pricePerShare;
  const estimatedAnnualReturn = totalCost * (asset.royaltyPercentage / 100);

  const handlePurchase = async () => {
    if (shares > asset.availableShares) {
      setError("Not enough shares available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate purchase transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(true);
      setTimeout(() => {
        onClose();
        resetModal();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setShares(1);
    setSuccess(false);
    setError(null);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 rounded-xl border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Purchase Shares</h2>
          <button
            onClick={() => {
              onClose();
              resetModal();
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Purchase Successful!
              </h3>
              <p className="text-gray-400 text-center">
                You now own {shares} shares of {asset.name}
              </p>
            </div>
          ) : (
            <>
              {/* Asset Info */}
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{asset.name}</h3>
                  <p className="text-gray-400 text-sm">{asset.owner}</p>
                </div>
              </div>

              {/* Shares Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Shares
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShares(Math.max(1, shares - 1))}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
                    disabled={loading}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                    max={asset.availableShares}
                    disabled={loading}
                  />
                  <button
                    onClick={() => setShares(Math.min(asset.availableShares, shares + 1))}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Max available: {asset.availableShares.toLocaleString()} shares
                </p>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Price per share</span>
                  <span className="text-white font-semibold">
                    {formatCurrency(asset.pricePerShare, "ETH")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Shares</span>
                  <span className="text-white font-semibold">{shares}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Royalty Rate</span>
                  <span className="text-purple-400 font-semibold">
                    {asset.royaltyPercentage}%
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">Total Cost</span>
                    <span className="text-xl font-bold text-white">
                      {formatCurrency(totalCost, "ETH")}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-green-400 text-sm">
                    Est. Annual Return: {formatCurrency(estimatedAnnualReturn, "ETH")}
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-white/10">
            <button
              onClick={() => {
                onClose();
                resetModal();
              }}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={loading || shares > asset.availableShares}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <ShoppingCart className="w-4 h-4" />
              <span>{loading ? "Processing..." : "Purchase"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
