import { http, createConfig } from "wagmi";
import { story } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

// Story Network Configuration
export const storyTestnet = {
  id: 1513,
  name: "Story Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "IP",
    symbol: "IP",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.storyrpc.io"],
    },
    public: {
      http: ["https://testnet.storyrpc.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Story Explorer",
      url: "https://testnet.storyscan.xyz",
    },
  },
  testnet: true,
};

export const config = createConfig({
  chains: [storyTestnet as any],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "IP Guardian",
      appLogoUrl: "https://ipguardian.app/logo.png",
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "demo",
    }),
  ],
  transports: {
    [storyTestnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
