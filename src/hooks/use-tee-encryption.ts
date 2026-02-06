import { useState, useCallback } from 'react';
import { useAccount, useSwitchChain, useChainId } from 'wagmi';
import { IExecDataProtector } from '@iexec/dataprotector';

// iExec Bellecour chain ID
const BELLECOUR_CHAIN_ID = 134;

// TEE encryption data structure
interface TEEEncryptionData {
  fromChain: string;
  toChain: string;
  amount: string;
  recipient: string;
  timestamp: number;
}

interface UseTEEEncryptionReturn {
  encrypt: (data: TEEEncryptionData) => Promise<string>;
  isEncrypting: boolean;
  error: Error | null;
  protectedDataAddress: string | null;
  needsChainSwitch: boolean;
  switchToBellecour: () => Promise<void>;
}

/**
 * Hook for encrypting transaction data using iExec TEE
 * 
 * Uses the real iExec DataProtector SDK to protect transaction data.
 * Requires the user to be on the iExec Bellecour sidechain (Chain ID 134).
 */
export function useTEEEncryption(): UseTEEEncryptionReturn {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [protectedDataAddress, setProtectedDataAddress] = useState<string | null>(null);
  
  // Check if user needs to switch to Bellecour
  const needsChainSwitch = chainId !== BELLECOUR_CHAIN_ID;

  const switchToBellecour = useCallback(async () => {
    if (!switchChainAsync) {
      throw new Error('Chain switching not available');
    }
    await switchChainAsync({ chainId: BELLECOUR_CHAIN_ID });
  }, [switchChainAsync]);

  const encrypt = useCallback(async (data: TEEEncryptionData): Promise<string> => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    setIsEncrypting(true);
    setError(null);

    try {
      // Ensure we're on Bellecour chain
      if (chainId !== BELLECOUR_CHAIN_ID) {
        console.log('[TEE] Switching to Bellecour chain...');
        await switchToBellecour();
        // Wait a moment for chain switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('[TEE] Initializing iExec DataProtector...');
      
      // Initialize the DataProtector with the browser's web3 provider
      // @ts-expect-error - window.ethereum is available when wallet is connected
      const web3Provider = window.ethereum;
      
      if (!web3Provider) {
        throw new Error('No web3 provider found. Please ensure MetaMask or another wallet is installed.');
      }

      const dataProtector = new IExecDataProtector(web3Provider);

      console.log('[TEE] Protecting transaction data...');
      
      // Protect the transaction data
      const protectedData = await dataProtector.protectData({
        data: {
          bridgeTransaction: JSON.stringify({
            fromChain: data.fromChain,
            toChain: data.toChain,
            amount: data.amount,
            recipient: data.recipient,
            timestamp: data.timestamp,
          }),
        },
        name: `SolCipher Bridge - ${data.amount} USDC`,
      });

      console.log('[TEE] Data protected successfully:', protectedData);
      
      setProtectedDataAddress(protectedData.address);
      
      return protectedData.address;
    } catch (err) {
      const error = err as Error;
      console.error('[TEE] Encryption failed:', error);
      setError(error);
      throw error;
    } finally {
      setIsEncrypting(false);
    }
  }, [isConnected, chainId, switchToBellecour]);

  return {
    encrypt,
    isEncrypting,
    error,
    protectedDataAddress,
    needsChainSwitch,
    switchToBellecour,
  };
}
