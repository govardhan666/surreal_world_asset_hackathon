'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Upload, Link as LinkIcon, Scan, Shield, Check } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { scanContent, registerIP } from '@/lib/api-client';
import toast from 'react-hot-toast';

type ScanResult = {
  similarity: number;
  matches: Array<{
    url: string;
    similarity: number;
    platform: string;
  }>;
  isOriginal: boolean;
  contentHash: string;
};

export default function ScanPage() {
  const { address, isConnected } = useAccount();
  const [scanType, setScanType] = useState<'upload' | 'url'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [contentType, setContentType] = useState<'image' | 'audio' | 'text' | 'video'>('image');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [registering, setRegistering] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleScan = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (scanType === 'upload' && !file) {
      toast.error('Please select a file to scan');
      return;
    }

    if (scanType === 'url' && !url) {
      toast.error('Please enter a URL to scan');
      return;
    }

    try {
      setScanning(true);
      const result = await scanContent({
        file: scanType === 'upload' ? file! : undefined,
        url: scanType === 'url' ? url : undefined,
        type: contentType,
      });

      setScanResult(result);

      if (result.isOriginal) {
        toast.success('Content appears to be original!');
      } else {
        toast(`Found ${result.matches?.length || 0} similar matches`, {
          icon: '⚠️',
        });
      }
    } catch (error) {
      console.error('Error scanning content:', error);
      toast.error('Failed to scan content');
    } finally {
      setScanning(false);
    }
  };

  const handleRegister = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!scanResult) {
      toast.error('Please scan content first');
      return;
    }

    try {
      setRegistering(true);

      const metadata = {
        name: file?.name || url || 'Untitled',
        description: 'IP Asset registered via IP Guardian',
        contentType,
        creator: address,
      };

      const result = await registerIP({
        contentHash: scanResult.contentHash,
        metadata,
        owner: address,
      });

      if (result.success) {
        toast.success('IP registered successfully!');
        setScanResult(null);
        setFile(null);
        setUrl('');
      } else {
        toast.error('Failed to register IP');
      }
    } catch (error) {
      console.error('Error registering IP:', error);
      toast.error('Failed to register IP');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Scan & Protect Your <span className="gradient-text">Content</span>
            </h1>
            <p className="text-xl text-gray-400">
              Upload or link to your content to check for violations and register IP protection
            </p>
          </div>

          {/* Scan Type Selection */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setScanType('upload')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                  scanType === 'upload'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Upload className="h-5 w-5 inline mr-2" />
                Upload File
              </button>
              <button
                onClick={() => setScanType('url')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                  scanType === 'url'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <LinkIcon className="h-5 w-5 inline mr-2" />
                Enter URL
              </button>
            </div>

            {/* Content Type Selection */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Content Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['image', 'audio', 'text', 'video'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setContentType(type)}
                    className={`py-2 px-4 rounded-lg font-semibold capitalize transition ${
                      contentType === type
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload/URL Input */}
            {scanType === 'upload' ? (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={
                    contentType === 'image' ? 'image/*' :
                    contentType === 'audio' ? 'audio/*' :
                    contentType === 'video' ? 'video/*' :
                    '.txt,.pdf,.doc,.docx'
                  }
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white font-semibold mb-2">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {contentType.toUpperCase()} files only
                  </p>
                </label>
              </div>
            ) : (
              <div>
                <label className="block text-white font-semibold mb-2">Content URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/content"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
              </div>
            )}

            {/* Scan Button */}
            <button
              onClick={handleScan}
              disabled={scanning || (!file && !url)}
              className="w-full mt-6 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition flex items-center justify-center"
            >
              {scanning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="h-5 w-5 mr-2" />
                  Scan Content
                </>
              )}
            </button>
          </div>

          {/* Scan Results */}
          {scanResult && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Scan Results</h2>

              {/* Original Status */}
              <div className={`p-4 rounded-lg mb-6 ${
                scanResult.isOriginal
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-yellow-500/10 border border-yellow-500/20'
              }`}>
                <div className="flex items-center">
                  {scanResult.isOriginal ? (
                    <Check className="h-6 w-6 text-green-400 mr-2" />
                  ) : (
                    <Scan className="h-6 w-6 text-yellow-400 mr-2" />
                  )}
                  <div>
                    <h3 className={`font-semibold ${
                      scanResult.isOriginal ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {scanResult.isOriginal
                        ? 'Content appears to be original!'
                        : `Found ${scanResult.matches?.length || 0} similar matches`}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Similarity score: {(scanResult.similarity * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Matches */}
              {scanResult.matches && scanResult.matches.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-4">Similar Content Found:</h3>
                  <div className="space-y-3">
                    {scanResult.matches.map((match, index) => (
                      <div key={index} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-white font-medium">{match.platform}</p>
                            <a
                              href={match.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-400 text-sm hover:underline truncate block"
                            >
                              {match.url}
                            </a>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-white font-semibold">
                              {(match.similarity * 100).toFixed(1)}%
                            </div>
                            <div className="text-gray-400 text-sm">Match</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Register Button */}
              {scanResult.isOriginal && (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition flex items-center justify-center"
                >
                  {registering ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Registering...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      Register IP Protection
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
