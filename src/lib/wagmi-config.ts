import { http, createConfig } from 'wagmi';
import { arbitrumSepolia, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { type Chain } from 'viem';

// iExec Bellecour sidechain definition
export const bellecour: Chain = {
  id: 134,
  name: 'iExec Bellecour',
  nativeCurrency: {
    name: 'xRLC',
    symbol: 'xRLC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://bellecour.iex.ec'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BlockScout',
      url: 'https://blockscout.bellecour.iex.ec',
    },
  },
};

export const config = createConfig({
  chains: [arbitrumSepolia, sepolia, bellecour],
  connectors: [
    injected(),
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
    [sepolia.id]: http(),
    [bellecour.id]: http('https://bellecour.iex.ec'),
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

// iExec chain info (used for privacy features)
export const IEXEC_CHAIN = {
  id: bellecour.id,
  name: 'iExec Bellecour',
  icon: '🟡',
  explorer: 'https://blockscout.bellecour.iex.ec',
  color: '#FCD900',
  faucet: 'https://faucet.bellecour.iex.ec',
} as const;

export type ChainKey = keyof typeof SUPPORTED_CHAINS;
