import { ChainKey } from './wagmi-config';

export type TransactionStatus = 'pending' | 'encrypting' | 'confirming' | 'bridging' | 'completed' | 'failed';

export interface BridgeTransaction {
  id: string;
  hash: string;
  fromChain: ChainKey;
  toChain: ChainKey;
  amount: string;
  token: 'USDC';
  status: TransactionStatus;
  privacyEnabled: boolean;
  encryptedDataHash?: string;
  createdAt: Date;
  completedAt?: Date;
  currentStep: number;
}

export const mockStats = {
  totalVolume: '$2,847,392',
  totalTransactions: 1847,
  avgBridgeTime: '~5 min',
  chainsSupported: 2,
};

export const mockTransactions: BridgeTransaction[] = [
  {
    id: '1',
    hash: '0x8f3d2a1b4c5e6f7890abcdef1234567890abcdef1234567890abcdef12345678',
    fromChain: 'arbitrum-sepolia',
    toChain: 'ethereum-sepolia',
    amount: '1000',
    token: 'USDC',
    status: 'completed',
    privacyEnabled: true,
    encryptedDataHash: '0xabc123def456789...',
    createdAt: new Date(Date.now() - 3600000),
    completedAt: new Date(Date.now() - 3300000),
    currentStep: 5,
  },
  {
    id: '2',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    fromChain: 'ethereum-sepolia',
    toChain: 'arbitrum-sepolia',
    amount: '500',
    token: 'USDC',
    status: 'completed',
    privacyEnabled: false,
    createdAt: new Date(Date.now() - 7200000),
    completedAt: new Date(Date.now() - 6900000),
    currentStep: 5,
  },
  {
    id: '3',
    hash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    fromChain: 'arbitrum-sepolia',
    toChain: 'ethereum-sepolia',
    amount: '2500',
    token: 'USDC',
    status: 'pending',
    privacyEnabled: true,
    encryptedDataHash: '0xdef789abc123456...',
    createdAt: new Date(Date.now() - 300000),
    currentStep: 3,
  },
];

export const BRIDGE_STEPS = [
  { label: 'Wallet Signature', icon: '✓' },
  { label: 'Encrypting in TEE', icon: '🔒' },
  { label: 'Source Confirmation', icon: '⏳' },
  { label: 'Cross-Chain Messaging', icon: '🔗' },
  { label: 'Settlement', icon: '✅' },
];

// Generate a mock encrypted hash
export function generateEncryptedHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Simulate TEE encryption with delay
export async function simulateTEEEncryption(data: unknown): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
  return generateEncryptedHash();
}

// Mock USDC balances per chain
export function getMockBalance(chainKey: ChainKey): string {
  const balances: Record<ChainKey, string> = {
    'arbitrum-sepolia': '5000.00',
    'ethereum-sepolia': '3500.00',
  };
  return balances[chainKey];
}
