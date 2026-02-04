import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ArrowDownUp, Lock, Shield, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SUPPORTED_CHAINS, ChainKey } from '@/lib/wagmi-config';
import { getMockBalance } from '@/lib/mock-data';
import { WalletConnect } from '@/components/WalletConnect';
import { BridgePreviewModal } from '@/components/BridgePreviewModal';
import { TransactionStatus } from '@/components/TransactionStatus';
import { useTransactions } from '@/hooks/use-transactions';
import { BridgeTransaction } from '@/lib/mock-data';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function BridgePage() {
  const { isConnected } = useAccount();
  const { initiateBridge, getTransaction } = useTransactions();
  
  const [fromChain, setFromChain] = useState<ChainKey>('arbitrum-sepolia');
  const [toChain, setToChain] = useState<ChainKey>('ethereum-sepolia');
  const [amount, setAmount] = useState('');
  const [privacyEnabled, setPrivacyEnabled] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTx, setActiveTx] = useState<BridgeTransaction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const balance = getMockBalance(fromChain);
  const estimatedGas = '~$0.15';
  const bridgeTime = '~5 minutes';

  const handleSwapChains = () => {
    setFromChain(toChain);
    setToChain(fromChain);
  };

  const handleMaxClick = () => {
    setAmount(balance);
  };

  const handlePreview = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setShowPreview(true);
  };

  const handleConfirmBridge = async () => {
    setShowPreview(false);
    setIsProcessing(true);

    const tx = await initiateBridge({
      fromChain,
      toChain,
      amount,
      privacyEnabled,
    });

    setActiveTx(tx);
    setIsProcessing(false);
  };

  const handleClose = () => {
    setActiveTx(null);
    setAmount('');
  };

  const isValidAmount = amount && parseFloat(amount) > 0 && parseFloat(amount) <= parseFloat(balance);

  // Show transaction status if there's an active transaction
  if (activeTx) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <TransactionStatus 
          transactionId={activeTx.id} 
          onClose={handleClose}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="glass-card">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Bridge USDC</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Transfer USDC securely between chains
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Chain Selectors */}
            <div className="space-y-4">
              {/* From Chain */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">From</Label>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <span className="text-2xl">{SUPPORTED_CHAINS[fromChain].icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{SUPPORTED_CHAINS[fromChain].name}</div>
                    <div className="text-sm text-muted-foreground">Testnet</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwapChains}
                  className="rounded-full border-2 hover:border-primary hover:bg-primary/10"
                >
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              {/* To Chain */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">To</Label>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <span className="text-2xl">{SUPPORTED_CHAINS[toChain].icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{SUPPORTED_CHAINS[toChain].name}</div>
                    <div className="text-sm text-muted-foreground">Testnet</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground text-sm">Amount</Label>
                <span className="text-sm text-muted-foreground">
                  Balance: <span className="text-foreground font-mono">{balance} USDC</span>
                </span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-24 text-lg h-14 font-mono"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMaxClick}
                    className="h-8 px-2 text-primary hover:text-primary"
                  >
                    MAX
                  </Button>
                  <span className="text-muted-foreground font-medium">USDC</span>
                </div>
              </div>
            </div>

            {/* Privacy Toggle */}
            <div className="p-4 rounded-lg bg-privacy/5 border border-privacy/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-privacy/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-privacy" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Enable Privacy</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Transaction details are encrypted in iExec's Trusted Execution Environment, protecting you from MEV attacks.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Protected by iExec TEE
                    </span>
                  </div>
                </div>
                <Switch
                  checked={privacyEnabled}
                  onCheckedChange={setPrivacyEnabled}
                />
              </div>

              {privacyEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-privacy/20"
                >
                  <div className="flex items-center gap-2 text-sm text-privacy">
                    <Shield className="h-4 w-4" />
                    <span>Your transaction will be encrypted end-to-end</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Fee Display */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Gas</span>
                <span>{estimatedGas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bridge Time</span>
                <span>{bridgeTime}</span>
              </div>
            </div>

            {/* Action Button */}
            {!isConnected ? (
              <WalletConnect />
            ) : (
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handlePreview}
                disabled={!isValidAmount || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Preview Bridge
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Preview Modal */}
      <BridgePreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        fromChain={fromChain}
        toChain={toChain}
        amount={amount}
        privacyEnabled={privacyEnabled}
        onConfirm={handleConfirmBridge}
      />
    </div>
  );
}
