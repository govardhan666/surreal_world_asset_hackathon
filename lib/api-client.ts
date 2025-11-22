import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// IP Registration
export async function registerIP(data: {
  contentHash: string;
  metadata: {
    name: string;
    description: string;
    contentType: string;
    creator: string;
  };
  owner: string;
}) {
  const response = await apiClient.post('/api/ip/register', data);
  return response.data;
}

// Scan Content
export async function scanContent(data: {
  url?: string;
  file?: File;
  type: 'image' | 'audio' | 'text' | 'video';
}) {
  const formData = new FormData();
  if (data.file) {
    formData.append('file', data.file);
  }
  if (data.url) {
    formData.append('url', data.url);
  }
  formData.append('type', data.type);

  const response = await apiClient.post('/api/scan', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// Get Violations
export async function getViolations(ipId: string) {
  const response = await apiClient.get(`/api/violations/${ipId}`);
  return response.data;
}

// Get User IPs
export async function getUserIPs(address: string) {
  const response = await apiClient.get(`/api/user/${address}/ips`);
  return response.data;
}

// Get Analytics
export async function getAnalytics(address: string) {
  const response = await apiClient.get(`/api/analytics/${address}`);
  return response.data;
}

// Create Dispute
export async function createDispute(data: {
  ipId: string;
  violationId: string;
  evidence: string[];
}) {
  const response = await apiClient.post('/api/disputes/create', data);
  return response.data;
}

// Get Marketplace Listings
export async function getMarketplaceListings() {
  const response = await apiClient.get('/api/marketplace/listings');
  return response.data;
}

// Create License Offer
export async function createLicenseOffer(data: {
  ipId: string;
  terms: {
    price: string;
    duration: number;
    usage: string;
  };
}) {
  const response = await apiClient.post('/api/marketplace/license', data);
  return response.data;
}

export default apiClient;
