import { ChainKey } from './wagmi-config';
import { arbitrumSepolia, sepolia } from 'wagmi/chains';

// Official Circle USDC testnet contract addresses
export const USDC_ADDRESSES: Record<ChainKey, `0x${string}`> = {
  'arbitrum-sepolia': '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
  'ethereum-sepolia': '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
} as const;

// Chain ID to ChainKey mapping
export const CHAIN_ID_TO_KEY: Record<number, ChainKey> = {
  [arbitrumSepolia.id]: 'arbitrum-sepolia',
  [sepolia.id]: 'ethereum-sepolia',
} as const;

// Placeholder bridge contract address (to be replaced when deployed)
export const BRIDGE_CONTRACT_ADDRESS: `0x${string}` = '0x0000000000000000000000000000000000000000';

// USDC has 6 decimals
export const USDC_DECIMALS = 6;

// Standard ERC20 ABI for balance and approval functions
export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'approve',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'allowance',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'decimals',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    name: 'symbol',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
] as const;

// Testnet faucet URLs
export const FAUCET_URLS = {
  usdc: 'https://faucet.circle.com/',
  arbitrumSepolia: 'https://faucets.chain.link/arbitrum-sepolia',
  ethereumSepolia: 'https://faucets.chain.link/sepolia',
} as const;
