# IP Guardian - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Python 3.9+ installed
- npm or pnpm
- Git
- Story Protocol testnet account with IP tokens
- WalletConnect Project ID

## Environment Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd surreal_world_asset_hackathon

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install contract dependencies
cd contracts && npm install && cd ..

# Install AI service dependencies
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Story Protocol Configuration
NEXT_PUBLIC_STORY_API_URL=https://api.story.foundation
NEXT_PUBLIC_STORY_CHAIN_ID=1513
STORY_PRIVATE_KEY=your_private_key_here
STORY_API_KEY=your_story_api_key

# Wallet Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
BACKEND_PORT=3001

# AI Service
AI_SERVICE_URL=http://localhost:5000
AI_SERVICE_PORT=5000
```

## Smart Contract Deployment

### 1. Compile Contracts

```bash
cd contracts
npx hardhat compile
```

### 2. Deploy to Story Protocol Testnet

```bash
npx hardhat run scripts/deploy.js --network story-testnet
```

This will deploy:
- **IPRegistry** - Main IP asset registry
- **IPFractionalization** - Fractional ownership management
- **DisputeResolution** - On-chain dispute handling

Save the contract addresses from the deployment output.

### 3. Verify Contracts (Optional)

```bash
npx hardhat verify --network story-testnet <CONTRACT_ADDRESS>
```

## Application Deployment

### Option 1: Local Development

Run all services locally:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend API
npm run backend

# Terminal 3: AI Service
npm run ai-service
```

Access the application at `http://localhost:3000`

### Option 2: Production Build

#### Frontend (Vercel/Netlify)

1. Build the application:
```bash
npm run build
npm start
```

2. Deploy to Vercel:
```bash
npm i -g vercel
vercel --prod
```

Or push to GitHub and connect to Vercel/Netlify.

#### Backend API (Railway/Heroku/Fly.io)

1. **Railway**:
```bash
railway init
railway up
```

2. **Heroku**:
```bash
cd backend
heroku create ip-guardian-api
git subtree push --prefix backend heroku main
```

3. **Fly.io**:
```bash
cd backend
fly launch
fly deploy
```

#### AI Service (Python - Railway/Heroku)

1. Create `Procfile` in ai-service:
```
web: python app.py
```

2. Deploy:
```bash
cd ai-service
railway init
railway up
```

### Option 3: Docker Deployment

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
      - ai-service

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production

  ai-service:
    build: ./ai-service
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
```

Deploy:
```bash
docker-compose up -d
```

## Database Setup (Optional)

If using PostgreSQL for production:

1. Create database:
```bash
createdb ip_guardian
```

2. Update `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ip_guardian
```

3. Run migrations (if implemented):
```bash
npm run migrate
```

## Post-Deployment Checks

### 1. Verify Services

```bash
# Check frontend
curl http://localhost:3000

# Check backend
curl http://localhost:3001/health

# Check AI service
curl http://localhost:5000/health
```

### 2. Test Functionality

1. Connect wallet to Story Protocol testnet
2. Upload test content for scanning
3. Register IP asset
4. Check dashboard for registered assets
5. Browse marketplace listings
6. View analytics

### 3. Monitor Logs

```bash
# Frontend logs
npm run dev

# Backend logs
cd backend && npm run dev

# AI service logs
cd ai-service && python app.py
```

## Troubleshooting

### Common Issues

#### 1. "Failed to connect to Story Protocol"
- Ensure your private key is valid
- Check network connectivity
- Verify Story Protocol testnet is accessible

#### 2. "AI service not responding"
- Check if Python dependencies are installed
- Verify port 5000 is available
- Check AI service logs

#### 3. "Wallet connection fails"
- Verify WalletConnect Project ID is correct
- Clear browser cache
- Check network settings in wallet

#### 4. "Build errors"
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## Production Recommendations

### Security
- Use environment variables for all secrets
- Enable HTTPS/SSL certificates
- Implement rate limiting
- Add CORS restrictions
- Use secure headers

### Performance
- Enable CDN for static assets
- Implement caching strategies
- Use database connection pooling
- Optimize images and assets
- Enable compression

### Monitoring
- Set up error tracking (Sentry)
- Configure analytics (Google Analytics)
- Monitor server metrics
- Set up uptime monitoring
- Configure log aggregation

### Scaling
- Use load balancers
- Implement horizontal scaling
- Consider serverless functions
- Use managed databases
- Implement caching layers (Redis)

## Useful Links

- Story Protocol Docs: https://docs.story.foundation
- Testnet Faucet: https://faucet.story.foundation
- Block Explorer: https://testnet.storyscan.xyz
- GitHub Repository: [Your Repo URL]

## Support

For issues and questions:
- GitHub Issues: [Your Repo]/issues
- Discord: [Your Discord]
- Email: [Your Email]
