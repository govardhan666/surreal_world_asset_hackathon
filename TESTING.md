# IP Guardian - Testing Guide

## Overview

This document outlines the testing procedures for the IP Guardian platform to ensure all features work correctly before deployment.

## Test Environment Setup

### 1. Prerequisites
- Story Protocol testnet account with test IP tokens
- Test wallet (MetaMask or similar) configured for Story Protocol testnet
- Node.js 18+
- Python 3.9+

### 2. Get Testnet Tokens
1. Visit Story Protocol faucet: https://faucet.story.foundation
2. Enter your wallet address
3. Request testnet IP tokens
4. Wait for confirmation

### 3. Configure Test Environment
```bash
# Copy environment file
cp .env.example .env

# Update with test credentials
# Use testnet RPC and test private keys only
```

## Component Testing

### Frontend Testing

#### 1. Landing Page
**Test Cases:**
- [ ] Page loads without errors
- [ ] Navigation menu is visible and functional
- [ ] Hero section displays correctly
- [ ] Features section renders all 6 features
- [ ] Stats display correct placeholder values
- [ ] How It Works section shows 4 steps
- [ ] CTA buttons link to correct pages
- [ ] Footer links are accessible
- [ ] Responsive design works on mobile/tablet/desktop

**How to Test:**
```bash
npm run dev
# Visit http://localhost:3000
```

#### 2. Wallet Connection
**Test Cases:**
- [ ] Connect button opens wallet modal
- [ ] Successfully connects to Story Protocol testnet
- [ ] Displays correct wallet address
- [ ] Shows account balance
- [ ] Disconnect works properly
- [ ] Reconnects on page refresh

**Steps:**
1. Click "Connect Wallet"
2. Select MetaMask
3. Approve connection
4. Verify address displayed
5. Check network (Story Protocol Testnet)

#### 3. Dashboard
**Test Cases:**
- [ ] Redirects to connect wallet if not connected
- [ ] Displays user stats (Protected Assets, Violations, Revenue, Growth)
- [ ] Shows empty state when no assets registered
- [ ] Lists registered IP assets when available
- [ ] "Register New IP" button navigates to scan page
- [ ] Asset cards display correct information
- [ ] Loading states work correctly

**Steps:**
1. Connect wallet
2. Navigate to /dashboard
3. Verify stats display
4. Register test IP via scan page
5. Return to dashboard
6. Verify IP appears in list

#### 4. Scan Page
**Test Cases:**
- [ ] File upload works for images
- [ ] URL input accepts valid URLs
- [ ] Content type selector works
- [ ] Scan button disabled without input
- [ ] Loading state displays during scan
- [ ] Scan results show correctly
- [ ] Original content shows green indicator
- [ ] Similar matches display with percentage
- [ ] Register button appears for original content
- [ ] Registration completes successfully

**Steps:**
1. Navigate to /scan
2. Upload test image
3. Select "Image" content type
4. Click "Scan Content"
5. Wait for results
6. Verify similarity detection
7. Click "Register IP Protection"
8. Confirm registration success

#### 5. Marketplace
**Test Cases:**
- [ ] Listings display correctly
- [ ] Filter buttons work (all, image, audio, video, text)
- [ ] Marketplace stats show placeholder data
- [ ] Listing cards show all information
- [ ] Purchase button requires wallet connection
- [ ] Empty state displays when no listings

**Steps:**
1. Navigate to /marketplace
2. Browse listings
3. Test filter buttons
4. Click on listing card
5. Attempt purchase (toast notification)

#### 6. Analytics
**Test Cases:**
- [ ] Requires wallet connection
- [ ] Key metrics display (Revenue, Views, Users, Licenses)
- [ ] Revenue chart renders correctly
- [ ] Usage chart displays properly
- [ ] Timeframe selector works (7d, 30d, 90d)
- [ ] Charts update when timeframe changes

**Steps:**
1. Navigate to /analytics
2. Connect wallet if needed
3. Verify all metrics display
4. Check chart rendering
5. Switch timeframes
6. Verify data updates

### Backend API Testing

#### 1. Health Check
```bash
curl http://localhost:3001/health
```
**Expected:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

#### 2. IP Registration
```bash
curl -X POST http://localhost:3001/api/ip/register \
  -H "Content-Type: application/json" \
  -d '{
    "contentHash": "test_hash_123",
    "metadata": {
      "name": "Test IP",
      "description": "Test description",
      "contentType": "image",
      "creator": "0x123..."
    },
    "owner": "0x123..."
  }'
```
**Expected:**
```json
{
  "success": true,
  "ipId": "ip_...",
  "ipAsset": { ... }
}
```

#### 3. Content Scanning
```bash
curl -X POST http://localhost:3001/api/scan \
  -F "file=@test-image.jpg" \
  -F "type=image"
```
**Expected:**
```json
{
  "contentHash": "hash_...",
  "similarity": 0.15,
  "matches": [],
  "isOriginal": true
}
```

#### 4. Get User IPs
```bash
curl http://localhost:3001/api/user/0x123.../ips
```
**Expected:**
```json
{
  "ips": [ ... ],
  "count": 1
}
```

### AI Service Testing

#### 1. Health Check
```bash
curl http://localhost:5000/health
```
**Expected:**
```json
{
  "status": "ok",
  "service": "IP Detection AI"
}
```

#### 2. Image Scanning
```bash
curl -X POST http://localhost:5000/api/scan/image \
  -F "file=@test-image.jpg"
```
**Expected:**
```json
{
  "success": true,
  "contentHash": "...",
  "perceptualHashes": { ... },
  "scanResults": { ... }
}
```

#### 3. Image Comparison
```bash
curl -X POST http://localhost:5000/api/compare/images \
  -F "file1=@image1.jpg" \
  -F "file2=@image2.jpg"
```
**Expected:**
```json
{
  "success": true,
  "similarity": 0.95,
  "match": true
}
```

### Smart Contract Testing

#### 1. Compile Contracts
```bash
cd contracts
npx hardhat compile
```
**Expected:** No compilation errors

#### 2. Run Tests
```bash
npx hardhat test
```
**Expected:** All tests pass

#### 3. Deploy to Testnet
```bash
npx hardhat run scripts/deploy.js --network story-testnet
```
**Expected:** Contracts deployed with addresses

## Integration Testing

### End-to-End User Flow

#### Scenario 1: Register Original Content
1. **Setup:**
   - User has wallet with testnet tokens
   - Original image file ready

2. **Steps:**
   - [ ] Connect wallet on homepage
   - [ ] Navigate to Scan page
   - [ ] Upload original image
   - [ ] Click "Scan Content"
   - [ ] Verify "Content appears to be original" message
   - [ ] Click "Register IP Protection"
   - [ ] Confirm transaction in wallet
   - [ ] Wait for confirmation
   - [ ] Navigate to Dashboard
   - [ ] Verify IP appears in list

3. **Expected Result:**
   - IP registered successfully
   - Appears in dashboard
   - Has unique IP ID
   - Shows in marketplace

#### Scenario 2: Detect Similar Content
1. **Setup:**
   - Original content already registered
   - Similar/modified version of content

2. **Steps:**
   - [ ] Connect wallet
   - [ ] Navigate to Scan page
   - [ ] Upload similar content
   - [ ] Click "Scan Content"
   - [ ] Verify matches found
   - [ ] Check similarity percentage
   - [ ] Review match details

3. **Expected Result:**
   - Similar content detected
   - Similarity score shown
   - Original registration displayed

#### Scenario 3: Browse and License IP
1. **Steps:**
   - [ ] Navigate to Marketplace
   - [ ] Browse available IPs
   - [ ] Filter by content type
   - [ ] View IP details
   - [ ] Click "Purchase License"
   - [ ] Complete transaction

2. **Expected Result:**
   - Marketplace displays IPs
   - Filters work correctly
   - Purchase flow initiates

## Performance Testing

### Load Testing
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test API endpoint
ab -n 1000 -c 10 http://localhost:3001/health

# Test frontend
ab -n 100 -c 5 http://localhost:3000/
```

**Metrics to Check:**
- Response time < 200ms
- No failed requests
- Consistent performance under load

### Browser Performance
**Tools:** Chrome DevTools Lighthouse

**Metrics:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

## Security Testing

### 1. Wallet Security
- [ ] Private keys never exposed in frontend
- [ ] Transactions require user approval
- [ ] No sensitive data in localStorage without encryption

### 2. API Security
- [ ] Input validation on all endpoints
- [ ] No SQL injection vulnerabilities
- [ ] Rate limiting implemented
- [ ] CORS configured properly

### 3. Smart Contract Security
- [ ] Reentrancy protection
- [ ] Access controls properly implemented
- [ ] Integer overflow protection
- [ ] Gas optimization

## Automated Testing

### Frontend Unit Tests
```bash
npm test
```

### API Tests
```bash
cd backend
npm test
```

### Contract Tests
```bash
cd contracts
npx hardhat test
```

## Bug Reporting

When reporting bugs, include:
1. Environment (browser, OS, Node version)
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots/logs
5. Network conditions

## Test Checklist Summary

### Pre-Deployment
- [ ] All frontend pages load without errors
- [ ] Wallet connection works
- [ ] All API endpoints respond correctly
- [ ] AI service processes requests
- [ ] Smart contracts compile
- [ ] Integration tests pass
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Loading states work
- [ ] Error handling works

### Post-Deployment
- [ ] Production URL accessible
- [ ] SSL certificate valid
- [ ] API endpoints reachable
- [ ] Database connections work
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Error tracking active

## Continuous Testing

### Daily Checks
- Health endpoints respond
- Key user flows work
- No critical errors in logs

### Weekly Checks
- Performance metrics
- Security scans
- Dependency updates
- User feedback review

### Monthly Checks
- Comprehensive security audit
- Load testing
- Database optimization
- Feature testing

## Support

For testing issues:
- GitHub Issues: [repo]/issues
- Discord: [channel]
- Email: support@ipguardian.io
