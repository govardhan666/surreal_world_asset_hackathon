import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { http, Address } from "viem";
import { storyTestnet } from "./wagmi";

export interface IPMetadata {
  name: string;
  description: string;
  ipType: "image" | "video" | "audio" | "text" | "other";
  hash: string;
  url?: string;
  attributes?: Record<string, any>;
}

export interface IPAsset {
  ipId: Address;
  tokenId: bigint;
  owner: Address;
  metadata: IPMetadata;
  registered: boolean;
  timestamp: number;
}

export interface LicenseTerms {
  commercialUse: boolean;
  royaltyPercentage: number;
  currency: Address;
  uri: string;
}

export class StoryProtocolService {
  private client: StoryClient | null = null;
  private config: StoryConfig;

  constructor() {
    this.config = {
      account: process.env.NEXT_PUBLIC_WALLET_ADDRESS as Address || "0x0",
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
      chainId: "story-testnet",
    };
  }

  async initialize(account: Address) {
    try {
      this.config.account = account;
      this.client = StoryClient.newClient(this.config);
      return this.client;
    } catch (error) {
      console.error("Failed to initialize Story Protocol client:", error);
      throw error;
    }
  }

  async registerIPAsset(metadata: IPMetadata, ownerAddress: Address): Promise<string> {
    if (!this.client) {
      throw new Error("Story client not initialized");
    }

    try {
      // Register IP Asset on Story Protocol
      const response = await this.client.ipAsset.register({
        nftContract: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address,
        tokenId: BigInt(Date.now()), // Use timestamp as unique tokenId
        metadata: {
          name: metadata.name,
          description: metadata.description,
          attributes: [
            {
              key: "ipType",
              value: metadata.ipType,
            },
            {
              key: "hash",
              value: metadata.hash,
            },
            {
              key: "url",
              value: metadata.url || "",
            },
          ],
        },
      });

      return response.ipId || "";
    } catch (error) {
      console.error("Failed to register IP asset:", error);
      throw error;
    }
  }

  async attachLicenseTerms(
    ipId: Address,
    licenseTerms: LicenseTerms
  ): Promise<string> {
    if (!this.client) {
      throw new Error("Story client not initialized");
    }

    try {
      const response = await this.client.license.attachLicenseTerms({
        ipId,
        licenseTemplate: process.env.NEXT_PUBLIC_LICENSE_TEMPLATE as Address,
        licenseTermsId: BigInt(1),
      });

      return response.txHash || "";
    } catch (error) {
      console.error("Failed to attach license terms:", error);
      throw error;
    }
  }

  async mintLicenseTokens(
    ipId: Address,
    amount: number,
    receiver: Address
  ): Promise<string> {
    if (!this.client) {
      throw new Error("Story client not initialized");
    }

    try {
      const response = await this.client.license.mintLicenseTokens({
        licenseTermsId: BigInt(1),
        licensorIpId: ipId,
        receiver,
        amount: BigInt(amount),
      });

      return response.txHash || "";
    } catch (error) {
      console.error("Failed to mint license tokens:", error);
      throw error;
    }
  }

  async getIPAssetDetails(ipId: Address): Promise<any> {
    if (!this.client) {
      throw new Error("Story client not initialized");
    }

    try {
      const details = await this.client.ipAsset.get(ipId);
      return details;
    } catch (error) {
      console.error("Failed to get IP asset details:", error);
      throw error;
    }
  }

  async getRoyaltyData(ipId: Address): Promise<any> {
    if (!this.client) {
      throw new Error("Story client not initialized");
    }

    try {
      // Get royalty information for an IP asset
      const royaltyData = await this.client.royalty.getRoyaltyData({
        ipId,
      });

      return royaltyData;
    } catch (error) {
      console.error("Failed to get royalty data:", error);
      throw error;
    }
  }

  async claimRevenue(ipId: Address, tokenList: Address[]): Promise<string> {
    if (!this.client) {
      throw new Error("Story client not initialized");
    }

    try {
      const response = await this.client.royalty.claimRevenue({
        snapshotIds: [BigInt(1)],
        royaltyVaultIpId: ipId,
        token: tokenList[0],
      });

      return response.txHash || "";
    } catch (error) {
      console.error("Failed to claim revenue:", error);
      throw error;
    }
  }
}

// Singleton instance
let storyProtocolService: StoryProtocolService | null = null;

export function getStoryProtocolService(): StoryProtocolService {
  if (!storyProtocolService) {
    storyProtocolService = new StoryProtocolService();
  }
  return storyProtocolService;
}
