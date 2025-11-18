import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(date: Date | number): string {
  const d = typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function calculateSimilarity(hash1: string, hash2: string): number {
  // Simple Hamming distance calculation for demo
  if (hash1.length !== hash2.length) return 0;

  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++;
  }

  const similarity = ((hash1.length - distance) / hash1.length) * 100;
  return Math.round(similarity * 100) / 100;
}

export function generateContentHash(content: string): string {
  // Simple hash function for demo - in production, use proper cryptographic hash
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export async function uploadToIPFS(file: File): Promise<string> {
  // Mock IPFS upload - replace with actual IPFS/Pinata integration
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockCID = `Qm${Math.random().toString(36).substring(2, 15)}`;
      resolve(`ipfs://${mockCID}`);
    }, 1000);
  });
}

export function validateIPContent(content: any): boolean {
  if (!content) return false;

  if (content.name && content.name.length < 3) return false;
  if (content.description && content.description.length < 10) return false;

  return true;
}

export function getContentType(file: File): "image" | "video" | "audio" | "text" | "other" {
  const type = file.type.split("/")[0];

  switch (type) {
    case "image":
      return "image";
    case "video":
      return "video";
    case "audio":
      return "audio";
    case "text":
      return "text";
    default:
      return "other";
  }
}

export function calculateRoyalty(revenue: number, percentage: number): number {
  return (revenue * percentage) / 100;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
