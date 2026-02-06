import { useAccount, useReadContract, useChainId } from 'wagmi';
import { formatUnits } from 'viem';
import { USDC_ADDRESSES, ERC20_ABI, USDC_DECIMALS, CHAIN_ID_TO_KEY } from '@/lib/contracts';
import { ChainKey } from '@/lib/wagmi-config';
import { getMockBalance } from '@/lib/mock-data';

interface UseUSDCBalanceOptions {
  chainKey?: ChainKey;
  enabled?: boolean;
}

interface UseUSDCBalanceReturn {
  balance: string;
  rawBalance: bigint | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isUsingMock: boolean;
}

export function useUSDCBalance(options: UseUSDCBalanceOptions = {}): UseUSDCBalanceReturn {
  const { address, isConnected } = useAccount();
  const connectedChainId = useChainId();
  
  // Determine which chain to read balance from
  const chainKey = options.chainKey;
  const usdcAddress = chainKey ? USDC_ADDRESSES[chainKey] : undefined;
  
  // Only fetch if we have address, chain, and enabled is not false
  const shouldFetch = isConnected && !!address && !!usdcAddress && options.enabled !== false;

  const {
    data: rawBalance,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: shouldFetch,
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 10000, // Consider data stale after 10 seconds
    },
  });

  // Format the balance
  const formattedBalance = rawBalance !== undefined
    ? formatUnits(rawBalance, USDC_DECIMALS)
    : undefined;

  // Use mock balance as fallback when not connected or balance unavailable
  const isUsingMock = !shouldFetch || formattedBalance === undefined;
  const balance = formattedBalance ?? (chainKey ? getMockBalance(chainKey) : '0.00');

  return {
    balance: parseFloat(balance).toFixed(2),
    rawBalance,
    isLoading: shouldFetch && isLoading,
    isError,
    error: error as Error | null,
    refetch,
    isUsingMock,
  };
}
