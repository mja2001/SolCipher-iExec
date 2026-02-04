import { useState, useEffect, useCallback } from 'react';
import { BridgeTransaction, mockTransactions, generateEncryptedHash, TransactionStatus } from '@/lib/mock-data';
import { ChainKey } from '@/lib/wagmi-config';

const STORAGE_KEY = 'solcipher-transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setTransactions(parsed.map((tx: BridgeTransaction) => ({
        ...tx,
        createdAt: new Date(tx.createdAt),
        completedAt: tx.completedAt ? new Date(tx.completedAt) : undefined,
      })));
    } else {
      // Initialize with mock data
      setTransactions(mockTransactions);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTransactions));
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever transactions change
  useEffect(() => {
    if (!isLoading && transactions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  const addTransaction = useCallback((tx: Omit<BridgeTransaction, 'id' | 'createdAt' | 'currentStep'>) => {
    const newTx: BridgeTransaction = {
      ...tx,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      currentStep: 1,
    };
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<BridgeTransaction>) => {
    setTransactions(prev => 
      prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx)
    );
  }, []);

  const getTransaction = useCallback((id: string) => {
    return transactions.find(tx => tx.id === id);
  }, [transactions]);

  // Simulate transaction progress
  const simulateBridgeProgress = useCallback(async (txId: string) => {
    const steps = [
      { step: 1, status: 'pending' as TransactionStatus, delay: 1000 },
      { step: 2, status: 'encrypting' as TransactionStatus, delay: 2500 },
      { step: 3, status: 'confirming' as TransactionStatus, delay: 2000 },
      { step: 4, status: 'bridging' as TransactionStatus, delay: 3000 },
      { step: 5, status: 'completed' as TransactionStatus, delay: 1500 },
    ];

    for (const { step, status, delay } of steps) {
      await new Promise(resolve => setTimeout(resolve, delay));
      updateTransaction(txId, { 
        currentStep: step, 
        status,
        ...(status === 'completed' ? { completedAt: new Date() } : {}),
      });
    }
  }, [updateTransaction]);

  const initiateBridge = useCallback(async (params: {
    fromChain: ChainKey;
    toChain: ChainKey;
    amount: string;
    privacyEnabled: boolean;
  }) => {
    const hash = generateEncryptedHash();
    const encryptedDataHash = params.privacyEnabled ? generateEncryptedHash() : undefined;

    const tx = addTransaction({
      hash,
      fromChain: params.fromChain,
      toChain: params.toChain,
      amount: params.amount,
      token: 'USDC',
      status: 'pending',
      privacyEnabled: params.privacyEnabled,
      encryptedDataHash,
    });

    // Start progress simulation
    simulateBridgeProgress(tx.id);

    return tx;
  }, [addTransaction, simulateBridgeProgress]);

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    getTransaction,
    initiateBridge,
  };
}
