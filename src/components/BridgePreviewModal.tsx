import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { SUPPORTED_CHAINS, ChainKey } from '@/lib/wagmi-config';

interface BridgePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromChain: ChainKey;
  toChain: ChainKey;
  amount: string;
  privacyEnabled: boolean;
  onConfirm: () => void;
}

export function BridgePreviewModal({
  open,
  onOpenChange,
  fromChain,
  toChain,
  amount,
  privacyEnabled,
  onConfirm,
}: BridgePreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Confirm Bridge
          </DialogTitle>
          <DialogDescription>
            Review your transaction details before confirming
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Transfer Summary */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
            <div className="text-center">
              <span className="text-2xl">{SUPPORTED_CHAINS[fromChain].icon}</span>
              <div className="text-sm text-muted-foreground mt-1">
                {SUPPORTED_CHAINS[fromChain].name}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div className="text-center">
              <span className="text-2xl">{SUPPORTED_CHAINS[toChain].icon}</span>
              <div className="text-sm text-muted-foreground mt-1">
                {SUPPORTED_CHAINS[toChain].name}
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center">
            <div className="text-3xl font-bold font-mono">{amount} USDC</div>
            <div className="text-sm text-muted-foreground mt-1">
              ≈ ${parseFloat(amount).toFixed(2)} USD
            </div>
          </div>

          {/* Privacy Status */}
          {privacyEnabled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-lg bg-privacy/10 border border-privacy/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-privacy/20 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-privacy" />
                </div>
                <div>
                  <div className="font-medium text-privacy">Privacy Protected</div>
                  <div className="text-sm text-muted-foreground">
                    Encrypted via iExec TEE
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network Fee</span>
              <span>~$0.15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Time</span>
              <span>~5 minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">You'll Receive</span>
              <span className="font-mono font-medium">{amount} USDC</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="flex-1 gap-2">
            <Shield className="h-4 w-4" />
            Confirm & Bridge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
