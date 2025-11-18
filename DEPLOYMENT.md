# 🚀 Deployment Guide

Complete guide to deploying IP Guardian to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Smart Contract Deployment](#smart-contract-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [AI Service Deployment](#ai-service-deployment)
6. [Browser Extension Deployment](#browser-extension-deployment)
7. [Domain & SSL Setup](#domain--ssl-setup)
8. [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

### Required Accounts
- [Vercel](https://vercel.com) account (for frontend)
- [Railway](https://railway.app) or [Render](https://render.com) account (for AI service)
- Story Protocol testnet/mainnet wallet with funds
- [Pinata](https://pinata.cloud) account (for IPFS)
- [WalletConnect](https://walletconnect.com) Project ID

### Required Tools
- Node.js 18+
- Python 3.9+
- Git
- Hardhat
- Vercel CLI (optional)

## Environment Setup

### 1. Clone and Install

```bash
git clone https://github.com/your-repo/ip-guardian.git
cd ip-guardian
npm install
```

### 2. Configure Environment Variables

Create `.env` file in the root directory:

```bash
# Story Protocol
NEXT_PUBLIC_STORY_API_KEY=your_story_api_key
NEXT_PUBLIC_STORY_CHAIN_ID=1513
NEXT_PUBLIC_RPC_URL=https://testnet.storyrpc.io

# Wallet Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_id

# AI Service
NEXT_PUBLIC_AI_SERVICE_URL=https://your-ai-service.railway.app

# IPFS
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret

# OpenAI (optional)
OPENAI_API_KEY=your_openai_key
```

## Smart Contract Deployment

### 1. Configure Hardhat

```bash
cd contracts
cp .env.example .env
```

Edit `contracts/.env`:
```bash
PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://testnet.storyrpc.io
```

### 2. Compile Contracts

```bash
npm run compile
```

### 3. Deploy to Story Testnet

```bash
npm run deploy
```

Expected output:
```
Deploying IPFractionalization contract...
✅ IPFractionalization deployed to: 0x1234...5678

Deploying RoyaltyDistributor contract...
✅ RoyaltyDistributor deployed to: 0x2345...6789
```

### 4. Update Frontend Environment

Add contract addresses to `.env`:
```bash
NEXT_PUBLIC_IP_FRACTIONALIZATION_CONTRACT=0x1234...5678
NEXT_PUBLIC_ROYALTY_DISTRIBUTOR_CONTRACT=0x2345...6789
```

### 5. Verify Contracts (Optional)

```bash
npx hardhat verify --network story-testnet DEPLOYED_CONTRACT_ADDRESS
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### A. Using Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables from `.env`
6. Click "Deploy"

#### B. Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: Self-Hosted

#### Using Docker

1. Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. Build and run:
```bash
docker build -t ip-guardian .
docker run -p 3000:3000 --env-file .env ip-guardian
```

#### Using PM2

```bash
npm install -g pm2
npm run build
pm2 start npm --name "ip-guardian" -- start
pm2 save
pm2 startup
```

## AI Service Deployment

### Option 1: Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Configure:
   - Root Directory: `ai-service`
   - Start Command: `python app.py`
5. Add environment variables:
   ```
   PORT=5000
   DEBUG=False
   FLASK_ENV=production
   ```
6. Deploy

### Option 2: Render

1. Go to [Render](https://render.com)
2. Click "New Web Service"
3. Connect repository
4. Configure:
   - Environment: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
   - Root Directory: `ai-service`
5. Add environment variables
6. Deploy

### Option 3: DigitalOcean App Platform

```bash
# Install doctl
brew install doctl  # macOS
# or
snap install doctl  # Linux

# Authenticate
doctl auth init

# Create app
doctl apps create --spec .do/app.yaml
```

Create `.do/app.yaml`:
```yaml
name: ip-guardian-ai
services:
- name: ai-service
  github:
    repo: your-username/ip-guardian
    branch: main
    deploy_on_push: true
  source_dir: /ai-service
  run_command: python app.py
  envs:
  - key: PORT
    value: "5000"
  - key: DEBUG
    value: "False"
```

## Browser Extension Deployment

### 1. Prepare Extension Package

```bash
cd extension
zip -r ip-guardian-extension.zip * -x "*.git*" -x "*node_modules*"
```

### 2. Chrome Web Store Submission

1. Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay one-time $5 developer fee (if first time)
3. Click "New Item"
4. Upload `ip-guardian-extension.zip`
5. Fill in:
   - Name: IP Guardian
   - Description: (from extension/README.md)
   - Category: Productivity
   - Language: English
6. Add screenshots (1280x800 or 640x400)
7. Add promotional images
8. Set privacy policy URL
9. Submit for review

### 3. Firefox Add-ons (Optional)

1. Go to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
2. Click "Submit a New Add-on"
3. Upload the extension
4. Complete listing information
5. Submit for review

## Domain & SSL Setup

### 1. Domain Configuration

Point your domain to deployment:

**For Vercel:**
```bash
# In Vercel dashboard:
# Settings → Domains → Add Domain
# Add: ipguardian.app
```

**For Self-Hosted:**
```bash
# Add A record:
# Type: A
# Name: @
# Value: YOUR_SERVER_IP
# TTL: 3600

# Add CNAME for www:
# Type: CNAME
# Name: www
# Value: ipguardian.app
# TTL: 3600
```

### 2. SSL Certificate

**Vercel** - Automatic SSL via Let's Encrypt

**Self-Hosted with Nginx:**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d ipguardian.app -d www.ipguardian.app

# Auto-renewal
sudo certbot renew --dry-run
```

## Post-Deployment Checklist

### Frontend
- [ ] Site accessible at production URL
- [ ] Wallet connection working
- [ ] All environment variables set
- [ ] Smart contract interactions working
- [ ] AI service endpoint responding
- [ ] Images loading correctly
- [ ] Navigation working
- [ ] Mobile responsive

### Smart Contracts
- [ ] Contracts deployed successfully
- [ ] Addresses updated in frontend
- [ ] Contracts verified on explorer
- [ ] Test transactions working
- [ ] Gas optimizations applied

### AI Service
- [ ] Service responding to health checks
- [ ] Image detection working
- [ ] Text detection working
- [ ] Proper error handling
- [ ] Rate limiting configured
- [ ] CORS configured correctly

### Browser Extension
- [ ] Extension loads without errors
- [ ] Popup displays correctly
- [ ] Content scripts injecting
- [ ] Background worker running
- [ ] API communication working
- [ ] Notifications working

## Monitoring & Maintenance

### 1. Application Monitoring

**Vercel Analytics:**
```bash
# Enable in Vercel dashboard:
# Project → Analytics → Enable
```

**Custom Monitoring:**
```javascript
// Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Error Tracking

Install Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 3. Performance Monitoring

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=https://ipguardian.app
```

### 4. Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

### 5. Log Management

**For AI Service:**
```python
# Add to app.py
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

## Scaling Considerations

### Frontend
- Enable Next.js incremental static regeneration
- Implement CDN caching
- Use image optimization
- Code splitting

### AI Service
- Implement caching for frequent requests
- Use load balancer for multiple instances
- Add rate limiting
- Consider serverless functions

### Smart Contracts
- Monitor gas costs
- Optimize contract calls
- Implement batch operations
- Use events for indexing

## Troubleshooting

### Common Issues

**"Transaction Failed"**
- Check wallet has sufficient funds
- Verify correct network (Story Testnet)
- Check contract addresses
- Review gas limits

**"AI Service Not Responding"**
- Verify service URL in environment
- Check CORS configuration
- Verify service is running
- Check logs for errors

**"Extension Not Loading"**
- Verify manifest.json syntax
- Check content security policy
- Review browser console errors
- Verify permissions

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/your-repo/ip-guardian/issues)
- Join [Discord](https://discord.gg/ipguardian)
- Email: support@ipguardian.app

---

**Last Updated**: November 2024

For the latest deployment information, visit our [documentation](https://docs.ipguardian.app/deployment).
