# 🛡️ IP Guardian

**AI-Powered Content Protection & Monetization Platform on Story Protocol**

[![Built for Surreal World Assets Buildathon](https://img.shields.io/badge/Built%20for-Surreal%20World%20Assets-purple)](https://www.hackquest.io/hackathons/Surreal-World-Assets-Buildathon)
[![Story Protocol](https://img.shields.io/badge/Powered%20by-Story%20Protocol-blue)](https://www.story.foundation/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

IP Guardian is a comprehensive platform that revolutionizes intellectual property protection by combining AI-powered detection, blockchain-based registration, and automated monetization. Built on Story Protocol, it provides creators with unprecedented control over their digital assets.

### The Problem

- **$300B+ lost annually** to IP theft globally
- Manual IP registration is time-consuming and expensive
- Detecting violations across the internet is nearly impossible
- No easy way to monetize IP or enable fractional ownership
- Enforcement is complex and costly

### Our Solution

IP Guardian provides an all-in-one ecosystem:
- 🔍 **AI-Powered Detection** - Automatically scan and detect IP violations
- ⚡ **One-Click Registration** - Register IP on Story Protocol in seconds
- 💰 **Fractional Ownership (IPFi)** - Monetize through tokenization and licensing
- 🤖 **Automated Monitoring** - 24/7 surveillance with instant alerts
- 📊 **Revenue Analytics** - Track earnings and portfolio performance

## 🏆 Hackathon Tracks

This project competes in **5 tracks** of the Surreal World Assets Buildathon:

1. **IP Detection & Enforcement** ⭐ Primary Track
   - AI-powered similarity detection
   - Automated violation monitoring
   - Smart dispute resolution

2. **IPFi**
   - Fractional IP ownership via ERC20 tokens
   - Automated royalty distribution
   - Secondary marketplace for IP trading

3. **Creative Front-End**
   - Modern, responsive UI with Tailwind CSS
   - Real-time dashboard with analytics
   - Browser extension for seamless UX

4. **GenAI IP Registration**
   - AI-assisted content analysis
   - Automated metadata generation
   - Bulk registration capabilities

5. **Data**
   - On-chain analytics and tracking
   - Violation detection algorithms
   - Revenue and usage metrics

## 🚀 Features

### Core Platform

- **Smart IP Registration**: One-click registration on Story Protocol with automated metadata
- **AI Detection Engine**: Perceptual hashing and similarity analysis for images, audio, video, and text
- **Real-Time Monitoring**: Continuous scanning across the web with instant violation alerts
- **IPFi Marketplace**: Buy and sell fractional ownership of IP assets
- **Royalty Distribution**: Automated revenue sharing via smart contracts
- **Browser Extension**: Real-time protection while browsing
- **Analytics Dashboard**: Comprehensive insights into your IP portfolio

### Technical Highlights

- **Multi-Modal AI Detection**: Supports images, videos, audio, and text
- **Blockchain Integration**: Built on Story Protocol for immutable IP records
- **Smart Contracts**: Fractionalization and royalty distribution contracts
- **Scalable Architecture**: Next.js frontend, Python AI service, Solidity contracts
- **Cross-Chain Ready**: Designed for multi-chain deployment

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, responsive styling
- **Wagmi & Viem** - Ethereum interactions
- **Framer Motion** - Smooth animations

### Backend
- **Story Protocol SDK** - IP registration and management
- **Python/Flask** - AI detection service
- **Solidity** - Smart contracts
- **Hardhat** - Contract development and deployment

### AI/ML
- **Pillow** - Image processing
- **ImageHash** - Perceptual hashing algorithms
- **Custom algorithms** - Text similarity and n-gram analysis

### Blockchain
- **Story Protocol** - L1 blockchain for IP
- **Solidity 0.8.23** - Smart contract language
- **OpenZeppelin** - Secure contract libraries

## 📦 Project Structure

```
ip-guardian/
├── app/                      # Next.js application
│   ├── dashboard/           # Main dashboard
│   ├── marketplace/         # IPFi marketplace
│   └── analytics/           # Analytics pages
├── components/              # React components
│   ├── dashboard/          # Dashboard components
│   └── marketplace/        # Marketplace components
├── lib/                    # Shared utilities
│   ├── story-protocol.ts   # Story Protocol integration
│   ├── wagmi.ts           # Wallet configuration
│   └── utils.ts           # Helper functions
├── contracts/              # Smart contracts
│   ├── contracts/         # Solidity contracts
│   ├── scripts/           # Deployment scripts
│   └── hardhat.config.js  # Hardhat configuration
├── ai-service/            # AI detection service
│   ├── app.py            # Flask application
│   └── requirements.txt   # Python dependencies
├── extension/             # Browser extension
│   ├── manifest.json     # Extension manifest
│   ├── popup.html        # Extension popup
│   └── background.js     # Service worker
└── docs/                 # Documentation

```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- MetaMask or compatible Web3 wallet
- Story Protocol testnet tokens

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-repo/ip-guardian.git
cd ip-guardian
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Install contract dependencies**
```bash
cd contracts
npm install
cd ..
```

5. **Install AI service dependencies**
```bash
cd ai-service
pip install -r requirements.txt
cd ..
```

### Running the Application

1. **Start the AI Detection Service**
```bash
cd ai-service
python app.py
```

2. **Start the Next.js Development Server**
```bash
npm run dev
```

3. **Deploy Smart Contracts** (optional)
```bash
cd contracts
cp .env.example .env
# Add your private key
npm run deploy
```

4. **Load Browser Extension** (optional)
- Open Chrome and go to `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `extension` directory

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Smart Contract Documentation](./contracts/README.md)
- [Browser Extension Guide](./extension/README.md)

## 🎯 Use Cases

### For Creators
- Register artwork, music, videos instantly
- Monitor for unauthorized usage 24/7
- Earn passive income through licensing
- Fractionally sell ownership while retaining rights

### For Businesses
- Protect brand assets and content
- Automate IP portfolio management
- Generate licensing revenue
- Enforce IP rights efficiently

### For Investors
- Buy fractional ownership in promising IP
- Earn royalties from licensed usage
- Trade IP shares on secondary market
- Diversify portfolio with digital assets

## 🎨 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Marketplace
![Marketplace](docs/screenshots/marketplace.png)

### Browser Extension
![Extension](docs/screenshots/extension.png)

## 🔒 Security

- Smart contracts audited with industry-standard tools
- No private keys stored client-side
- Content hashes verified on-chain
- Secure wallet integration via WalletConnect

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- ✅ Core IP registration
- ✅ AI detection engine
- ✅ Basic marketplace
- ✅ Browser extension

### Phase 2: Enhancement (Q1 2025)
- [ ] Advanced AI models
- [ ] Mobile applications
- [ ] API for developers
- [ ] Multi-chain support

### Phase 3: Scale (Q2 2025)
- [ ] Enterprise solutions
- [ ] Legal enforcement tools
- [ ] Global marketplace
- [ ] DAO governance

## 👥 Team

Built for the Surreal World Assets Buildathon by passionate builders committed to empowering creators in the Web3 era.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Story Protocol** - For the innovative IP infrastructure
- **Surreal World Assets Buildathon** - For the opportunity and support
- **Open Source Community** - For the amazing tools and libraries

## 📞 Contact & Support

- **Website**: [ipguardian.app](https://ipguardian.app)
- **Documentation**: [docs.ipguardian.app](https://docs.ipguardian.app)
- **Twitter**: [@IPGuardian](https://twitter.com/ipguardian)
- **Discord**: [Join our community](https://discord.gg/ipguardian)
- **Email**: support@ipguardian.app

## 🌟 Star Us!

If you find IP Guardian useful, please consider giving us a star on GitHub! It helps others discover the project.

---

**Built with ❤️ on Story Protocol for Surreal World Assets Buildathon**

[Demo](https://ipguardian.app) | [Documentation](https://docs.ipguardian.app) | [Twitter](https://twitter.com/ipguardian)
