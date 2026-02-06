import { useState, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, maxUint256 } from 'viem';
import { USDC_ADDRESSES, ERC20_ABI, USDC_DECIMALS, BRIDGE_CONTRACT_ADDRESS } from '@/lib/contracts';
import { ChainKey } from '@/lib/wagmi-config';

interface UseTokenApprovalOptions {
  chainKey: ChainKey;
  amount: string;
  spender?: `0x${string}`;
}

interface UseTokenApprovalReturn {
  allowance: bigint | undefined;
  needsApproval: boolean;
  isCheckingAllowance: boolean;
  isApproving: boolean;
  isWaitingForApproval: boolean;
  approvalTxHash: `0x${string}` | undefined;
  approve: () => Promise<void>;
  approveMax: () => Promise<void>;
  error: Error | null;
  reset: () => void;
}

export function useTokenApproval({
  chainKey,
  amount,
  spender = BRIDGE_CONTRACT_ADDRESS,
}: UseTokenApprovalOptions): UseTokenApprovalReturn {
  const { address } = useAccount();
  const [error, setError] = useState<Error | null>(null);

  const usdcAddress = USDC_ADDRESSES[chainKey];
  const amountInWei = amount ? parseUnits(amount, USDC_DECIMALS) : BigInt(0);

  // Check current allowance
  const {
    data: allowance,
    isLoading: isCheckingAllowance,
    refetch: refetchAllowance,
  } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && spender ? [address, spender] : undefined,
    query: {
      enabled: !!address && !!spender,
      refetchInterval: 10000,
    },
  });

  // Check if approval is needed
  const needsApproval = allowance !== undefined && amountInWei > 0 
    ? allowance < amountInWei 
    : false;

  // Write contract for approval
  const {
    writeContractAsync,
    isPending: isApproving,
    data: approvalTxHash,
    reset: resetWrite,
  } = useWriteContract();

  // Wait for approval transaction
  const { isLoading: isWaitingForApproval } = useWaitForTransactionReceipt({
    hash: approvalTxHash,
    query: {
      enabled: !!approvalTxHash,
    },
  });

  // Approve exact amount
  const approve = useCallback(async () => {
    if (!address || !spender) {
      setError(new Error('Wallet not connected'));
      return;
    }

    try {
      setError(null);
      await writeContractAsync({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spender, amountInWei],
      });
      // Refetch allowance after approval
      await refetchAllowance();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [address, spender, usdcAddress, amountInWei, writeContractAsync, refetchAllowance]);

  // Approve max amount (unlimited)
  const approveMax = useCallback(async () => {
    if (!address || !spender) {
      setError(new Error('Wallet not connected'));
      return;
    }

    try {
      setError(null);
      await writeContractAsync({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spender, maxUint256],
      });
      // Refetch allowance after approval
      await refetchAllowance();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [address, spender, usdcAddress, writeContractAsync, refetchAllowance]);

  const reset = useCallback(() => {
    setError(null);
    resetWrite();
  }, [resetWrite]);

  return {
    allowance,
    needsApproval,
    isCheckingAllowance,
    isApproving,
    isWaitingForApproval,
    approvalTxHash,
    approve,
    approveMax,
    error,
    reset,
  };
}
