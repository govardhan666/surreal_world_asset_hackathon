import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { defineChain } from 'viem';

// Story Protocol Testnet Chain Configuration
export const storyTestnet = defineChain({
  id: 1513,
  name: 'Story Protocol Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.storyrpc.io'],
    },
    public: {
      http: ['https://testnet.storyrpc.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://testnet.storyscan.xyz' },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'IP Guardian',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [storyTestnet],
  transports: {
    [storyTestnet.id]: http(),
  },
  ssr: true,
});
