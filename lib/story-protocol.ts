import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { http, Address, createPublicClient, createWalletClient, custom } from "viem";
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
  private client: any | null = null;

  async initialize(account: Address, walletClient?: any) {
    try {
      // For demo purposes, we'll use a mock client
      // In production, initialize with proper wallet client
      this.client = {
        ipAsset: {
          register: async (params: any) => ({
            txHash: `0x${Math.random().toString(16).slice(2)}`,
            ipId: `0x${Math.random().toString(16).slice(2, 42)}` as Address
          }),
          get: async (ipId: Address) => ({
            id: ipId,
            metadata: {},
            owner: account
          })
        },
        license: {
          attachLicenseTerms: async (params: any) => ({
            txHash: `0x${Math.random().toString(16).slice(2)}`
          }),
          mintLicenseTokens: async (params: any) => ({
            txHash: `0x${Math.random().toString(16).slice(2)}`
          })
        },
        royalty: {
          getRoyaltyData: async (params: any) => ({
            royaltyAmount: "0",
            currency: "0x0000000000000000000000000000000000000000" as Address
          }),
          claimRevenue: async (params: any) => ({
            txHash: `0x${Math.random().toString(16).slice(2)}`
          })
        }
      };

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
      // Mock registration for demo
      const response = await this.client.ipAsset.register({
        nftContract: "0x1234567890123456789012345678901234567890" as Address,
        tokenId: BigInt(Date.now()),
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
        licenseTemplate: "0x1234567890123456789012345678901234567890" as Address,
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
