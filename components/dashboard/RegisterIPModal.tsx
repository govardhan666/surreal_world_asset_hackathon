"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { getStoryProtocolService } from "@/lib/story-protocol";
import { generateContentHash, uploadToIPFS, getContentType } from "@/lib/utils";

interface RegisterIPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterIPModal({ isOpen, onClose }: RegisterIPModalProps) {
  const { address } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    commercialUse: true,
    royaltyPercentage: 10,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setFormData((prev) => ({
        ...prev,
        name: prev.name || acceptedFiles[0].name,
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
      'text/*': ['.txt', '.md'],
    },
  });

  const handleRegister = async () => {
    if (!file || !address) {
      setError("Please connect your wallet and upload a file");
      return;
    }

    if (!formData.name || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Upload to IPFS
      const ipfsUrl = await uploadToIPFS(file);

      // Step 2: Generate content hash
      const contentHash = generateContentHash(await file.text());

      // Step 3: Register on Story Protocol
      const storyService = getStoryProtocolService();
      await storyService.initialize(address);

      const ipId = await storyService.registerIPAsset(
        {
          name: formData.name,
          description: formData.description,
          ipType: getContentType(file),
          hash: contentHash,
          url: ipfsUrl,
          attributes: {
            commercialUse: formData.commercialUse,
            royaltyPercentage: formData.royaltyPercentage,
          },
        },
        address
      );

      // Step 4: Attach license terms
      await storyService.attachLicenseTerms(ipId as any, {
        commercialUse: formData.commercialUse,
        royaltyPercentage: formData.royaltyPercentage,
        currency: "0x0000000000000000000000000000000000000000" as any,
        uri: ipfsUrl,
      });

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register IP asset");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setFormData({
      name: "",
      description: "",
      commercialUse: true,
      royaltyPercentage: 10,
    });
    setSuccess(false);
    setError(null);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-xl border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Register IP Asset</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                IP Asset Registered Successfully!
              </h3>
              <p className="text-gray-400 text-center">
                Your content is now protected on Story Protocol
              </p>
            </div>
          ) : (
            <>
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Content *
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-white/20 hover:border-purple-500/50 bg-white/5"
                  }`}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <div className="space-y-2">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="text-white">
                        {isDragActive
                          ? "Drop your file here"
                          : "Drag & drop your file, or click to browse"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Supports images, videos, audio, and text files
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Asset Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="My Digital Artwork"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe your intellectual property..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Royalty Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.royaltyPercentage}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        royaltyPercentage: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Commercial Use
                  </label>
                  <select
                    value={formData.commercialUse.toString()}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        commercialUse: e.target.value === "true",
                      }))
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="true">Allowed</option>
                    <option value="false">Not Allowed</option>
                  </select>
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
              onClick={handleClose}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleRegister}
              disabled={!file || !address || loading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Registering..." : "Register IP Asset"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
