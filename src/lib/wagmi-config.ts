import { http, createConfig } from 'wagmi';
import { arbitrumSepolia, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [arbitrumSepolia, sepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
    [sepolia.id]: http(),
  },
});

export const SUPPORTED_CHAINS = {
  'arbitrum-sepolia': {
    id: arbitrumSepolia.id,
    name: 'Arbitrum Sepolia',
    icon: '🔵',
    explorer: 'https://sepolia.arbiscan.io',
    color: '#3B82F6',
  },
  'ethereum-sepolia': {
    id: sepolia.id,
    name: 'Ethereum Sepolia',
    icon: '⟠',
    explorer: 'https://sepolia.etherscan.io',
    color: '#627EEA',
  },
} as const;

export type ChainKey = keyof typeof SUPPORTED_CHAINS;
