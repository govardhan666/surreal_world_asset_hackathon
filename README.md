# IP Guardian 🛡️

AI-Powered Content Protection & Monetization Platform built on Story Protocol

## 🌟 Overview

IP Guardian is an innovative platform that combines AI-powered content detection with blockchain-based IP protection and monetization. Built for the Surreal World Assets Buildathon, it addresses the $300B+ annual IP theft problem with cutting-edge technology.

## 🏆 Hackathon Tracks

This project competes in multiple tracks:
- **IP Detection & Enforcement** - AI-powered violation detection
- **IPFi** - Fractional IP ownership and licensing marketplace
- **Creative Front-End** - Intuitive user interface with real-time monitoring
- **GenAI IP Registration** - Automated IP registration for AI-generated content
- **Data** - Analytics dashboard with comprehensive IP metrics

## 🚀 Key Features

### 1. AI-Powered Content Scanner
- Visual IP violation detection using computer vision
- Audio fingerprinting for music/sound detection
- Text similarity algorithms for written content
- Real-time monitoring across platforms

### 2. Automated IP Registration
- One-click Story Protocol registration
- Bulk registration for content creators
- Browser extension for seamless protection
- Smart metadata management

### 3. IPFi Marketplace
- Fractional IP ownership using Story's Royalty Tokens
- Automated licensing with smart contracts
- Secondary market for IP trading
- Revenue tracking and distribution

### 4. Smart Dispute Resolution
- AI-powered evidence collection
- Automated cease & desist generation
- On-chain dispute tracking
- Transparent resolution process

### 5. Real-time Dashboard
- Live tracking of IP usage
- Violation alerts with severity scoring
- Revenue analytics
- Portfolio management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Blockchain**: Story Protocol, Ethers.js, Viem
- **Smart Contracts**: Solidity, Hardhat
- **AI/ML**: Python, TensorFlow, OpenCV
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Analytics**: Recharts, Dune Analytics

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
- pnpm or npm

### Setup

1. **Clone the repository**
```bash
git clone <repo-url>
cd surreal_world_asset_hackathon
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install AI service dependencies
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Install contract dependencies
cd contracts && npm install && cd ..
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Compile smart contracts**
```bash
npm run contracts:compile
```

## 🎯 Running the Application

### Development Mode

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run backend

# Terminal 3: AI Service
npm run ai-service
```

Access the application at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Test smart contracts
npm run contracts:test

# Watch mode
npm run test:watch
```

## 📱 Browser Extension

The browser extension is located in the `extension/` directory. To install:

1. Build the extension: `cd extension && npm run build`
2. Load in Chrome: `chrome://extensions` → Enable Developer Mode → Load Unpacked
3. Select the `extension/dist` directory

## 🔗 Smart Contracts

Contracts are deployed on Story Protocol testnet:

- **IPRegistry**: `[Contract Address]`
- **IPFractionalization**: `[Contract Address]`
- **DisputeResolution**: `[Contract Address]`

View on Explorer: [Story Protocol Explorer]

## 📊 API Documentation

### REST API Endpoints

#### IP Registration
```
POST /api/ip/register
Body: { contentHash, metadata, owner }
```

#### Scan Content
```
POST /api/scan
Body: { url, type }
```

#### Get Violations
```
GET /api/violations/:ipId
```

See full API docs in `/docs/api.md`

## 🎨 Key Innovations

1. **Proactive Protection** - Scans and protects before violations occur
2. **AI-First Approach** - Cutting-edge AI for accurate detection
3. **Complete Ecosystem** - End-to-end solution from detection to monetization
4. **Developer-Friendly** - Open APIs and SDKs for easy integration
5. **Cross-Chain Compatible** - Works across multiple blockchains

## 🌐 Demo Scenario

1. Creator uploads artwork to social media
2. Extension detects original, unregistered content
3. One-click registration on Story Protocol
4. AI monitors for unauthorized usage
5. Automatic licensing offers sent to violators
6. Revenue flows back to creator wallet

## 💰 Revenue Model

- **SaaS Subscription**: $29-299/month for monitoring
- **Transaction Fees**: 2-5% on licensing deals
- **Enterprise API**: Custom pricing for platforms
- **Dispute Resolution**: Fee per case handled

## 🏗️ Project Structure

```
surreal_world_asset_hackathon/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utilities and helpers
├── backend/               # Node.js backend
├── ai-service/            # Python AI service
├── contracts/             # Smart contracts
├── extension/             # Browser extension
├── public/                # Static assets
└── tests/                 # Test files
```

## 🤝 Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with:
- Story Protocol
- Encode Club
- AngelHack
- Surreal World Assets Buildathon

## 📞 Contact

- Project Link: [GitHub Repository]
- Demo Video: [YouTube Link]
- Pitch Deck: [Presentation Link]

---

Built with ❤️ for the Surreal World Assets Buildathon
