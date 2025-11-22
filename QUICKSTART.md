# 🚀 Quick Start Guide

Get IP Guardian running in under 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Python 3.9+ installed
- Git installed

## Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd surreal_world_asset_hackathon

# 2. Install frontend dependencies
npm install

# 3. Install AI service dependencies
cd ai-service
pip install -r requirements.txt
cd ..

# 4. Install contract dependencies (optional)
cd contracts
npm install
cd ..
```

## Running the Application

### Option 1: Development Mode

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Visit: http://localhost:3000

**Terminal 2 - AI Service:**
```bash
cd ai-service
python app.py
```
AI Service: http://localhost:5000

### Option 2: Production Build

```bash
npm run build
npm start
```

## Browser Extension

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder
5. Done! Extension is now active

## Environment Setup (Optional)

```bash
# Copy example env file
cp .env.example .env

# Edit with your values
# - Wallet credentials
# - API keys
# - Contract addresses
```

## Testing

```bash
# Type check
npx tsc --noEmit

# Build test
npm run build

# Run AI service
cd ai-service && python app.py

# Check contracts
cd contracts && npm run compile
```

## Features Available

### Landing Page (/)
- Hero section with value proposition
- Feature showcase
- How it works
- Call to action

### Dashboard (/dashboard)
- IP asset management
- Stats and analytics
- Recent activity
- Quick actions
- IP registration modal

### Marketplace (/marketplace)
- Browse fractional IP assets
- Search and filter
- Purchase shares
- View asset details

## Troubleshooting

### "Package not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Python packages error"
```bash
cd ai-service
pip install --upgrade pip
pip install -r requirements.txt
```

### "Port already in use"
```bash
# Frontend (default 3000)
PORT=3001 npm run dev

# AI Service (default 5000)
PORT=5001 python ai-service/app.py
```

## What's Working

✅ Frontend - All pages render correctly
✅ TypeScript - No errors
✅ Build - Completes successfully
✅ AI Service - All endpoints functional
✅ Smart Contracts - Code validated
✅ Browser Extension - Structure ready

## Next Steps

1. **Customize** - Update branding and content
2. **Deploy** - See DEPLOYMENT.md for instructions
3. **Configure** - Add your API keys and credentials
4. **Extend** - Add more features as needed

## Documentation

- [Complete README](README.md) - Full documentation
- [Test Results](TEST_RESULTS.md) - All test results
- [Testing Guide](TESTING.md) - How to test
- [Deployment](DEPLOYMENT.md) - Deploy to production
- [Hackathon](HACKATHON.md) - Submission details

## Support

Having issues? Check:
1. [TESTING.md](TESTING.md) - Common issues
2. [TEST_RESULTS.md](TEST_RESULTS.md) - Known limitations
3. GitHub Issues - Report bugs

## Demo Credentials

For testing wallet connection (use testnet):
- Network: Story Testnet
- Chain ID: 1513
- RPC: https://testnet.storyrpc.io

---

**Happy Building! 🎉**

Built for Surreal World Assets Buildathon on Story Protocol
