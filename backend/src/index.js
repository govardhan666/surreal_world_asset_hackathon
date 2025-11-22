const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// In-memory storage (replace with database in production)
const ipAssets = new Map();
const violations = new Map();
const disputes = new Map();
const marketplaceListings = new Map();

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register IP
app.post('/api/ip/register', async (req, res) => {
  try {
    const { contentHash, metadata, owner } = req.body;

    if (!contentHash || !metadata || !owner) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ipId = `ip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const ipAsset = {
      id: ipId,
      contentHash,
      metadata,
      owner,
      createdAt: new Date().toISOString(),
      status: 'registered',
    };

    ipAssets.set(ipId, ipAsset);

    // Add to marketplace
    marketplaceListings.set(ipId, {
      id: ipId,
      name: metadata.name,
      description: metadata.description,
      type: metadata.contentType,
      price: '100.00',
      royalty: '10',
      views: 0,
      owner,
    });

    res.json({
      success: true,
      ipId,
      ipAsset,
    });
  } catch (error) {
    console.error('Error registering IP:', error);
    res.status(500).json({ error: 'Failed to register IP' });
  }
});

// Scan content
app.post('/api/scan', upload.single('file'), async (req, res) => {
  try {
    const { url, type } = req.body;
    const file = req.file;

    if (!file && !url) {
      return res.status(400).json({ error: 'File or URL required' });
    }

    // Simulate AI scanning
    const contentHash = `hash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate checking for matches
    const matches = [];
    const similarity = Math.random();

    // Randomly generate some matches for demo
    if (similarity > 0.7) {
      matches.push({
        url: 'https://example.com/similar-content-1',
        similarity: 0.85,
        platform: 'Example Platform 1',
      });
    }

    const scanResult = {
      contentHash,
      similarity,
      matches,
      isOriginal: matches.length === 0,
      scannedAt: new Date().toISOString(),
    };

    res.json(scanResult);
  } catch (error) {
    console.error('Error scanning content:', error);
    res.status(500).json({ error: 'Failed to scan content' });
  }
});

// Get violations for IP
app.get('/api/violations/:ipId', (req, res) => {
  try {
    const { ipId } = req.params;
    const ipViolations = Array.from(violations.values()).filter(
      (v) => v.ipId === ipId
    );

    res.json({
      violations: ipViolations,
      count: ipViolations.length,
    });
  } catch (error) {
    console.error('Error getting violations:', error);
    res.status(500).json({ error: 'Failed to get violations' });
  }
});

// Get user IPs
app.get('/api/user/:address/ips', (req, res) => {
  try {
    const { address } = req.params;
    const userIPs = Array.from(ipAssets.values()).filter(
      (ip) => ip.owner.toLowerCase() === address.toLowerCase()
    );

    res.json({
      ips: userIPs,
      count: userIPs.length,
    });
  } catch (error) {
    console.error('Error getting user IPs:', error);
    res.status(500).json({ error: 'Failed to get user IPs' });
  }
});

// Get analytics
app.get('/api/analytics/:address', (req, res) => {
  try {
    const { address } = req.params;

    // Mock analytics data
    const analytics = {
      violations: Math.floor(Math.random() * 10),
      revenue: (Math.random() * 1000).toFixed(2),
      growth: (Math.random() * 50).toFixed(1),
      views: Math.floor(Math.random() * 10000),
      licenses: Math.floor(Math.random() * 100),
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Create dispute
app.post('/api/disputes/create', (req, res) => {
  try {
    const { ipId, violationId, evidence } = req.body;

    if (!ipId || !violationId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const disputeId = `dispute_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const dispute = {
      id: disputeId,
      ipId,
      violationId,
      evidence: evidence || [],
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    disputes.set(disputeId, dispute);

    res.json({
      success: true,
      disputeId,
      dispute,
    });
  } catch (error) {
    console.error('Error creating dispute:', error);
    res.status(500).json({ error: 'Failed to create dispute' });
  }
});

// Get marketplace listings
app.get('/api/marketplace/listings', (req, res) => {
  try {
    const listings = Array.from(marketplaceListings.values());

    res.json({
      listings,
      count: listings.length,
    });
  } catch (error) {
    console.error('Error getting marketplace listings:', error);
    res.status(500).json({ error: 'Failed to get marketplace listings' });
  }
});

// Create license offer
app.post('/api/marketplace/license', (req, res) => {
  try {
    const { ipId, terms } = req.body;

    if (!ipId || !terms) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const licenseId = `license_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const license = {
      id: licenseId,
      ipId,
      terms,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    res.json({
      success: true,
      licenseId,
      license,
    });
  } catch (error) {
    console.error('Error creating license:', error);
    res.status(500).json({ error: 'Failed to create license' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend API server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});
