import { ExternalLink, Coins, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FAUCET_URLS } from '@/lib/contracts';
import { IEXEC_CHAIN } from '@/lib/wagmi-config';

interface FaucetInfoProps {
  className?: string;
  compact?: boolean;
}

export function FaucetInfo({ className, compact = false }: FaucetInfoProps) {
  if (compact) {
    return (
      <div className={className}>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Need testnet tokens?</span>
          <a
            href={FAUCET_URLS.usdc}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Get USDC <ExternalLink className="h-3 w-3" />
          </a>
          <span>|</span>
          <a
            href={FAUCET_URLS.arbitrumSepolia}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Get ETH <ExternalLink className="h-3 w-3" />
          </a>
          <span>|</span>
          <a
            href={IEXEC_CHAIN.faucet}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Get xRLC <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <Coins className="h-4 w-4 text-primary" />
        <span>Get Testnet Tokens</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
              💵
            </div>
            <div>
              <div className="text-sm font-medium">USDC</div>
              <div className="text-xs text-muted-foreground">Circle Faucet (10 USDC/request)</div>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a
              href={FAUCET_URLS.usdc}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-1"
            >
              Get <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Fuel className="h-3 w-3 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">ETH (Gas)</div>
              <div className="text-xs text-muted-foreground">Chainlink Faucet</div>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a
              href={FAUCET_URLS.arbitrumSepolia}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-1"
            >
              Get <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-privacy/20 flex items-center justify-center text-xs">
              🟡
            </div>
            <div>
              <div className="text-sm font-medium">xRLC (Privacy)</div>
              <div className="text-xs text-muted-foreground">iExec Bellecour Faucet</div>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a
              href={IEXEC_CHAIN.faucet}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-1"
            >
              Get <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        You'll need testnet ETH for gas, USDC to bridge, and xRLC for privacy features.
      </p>
    </div>
  );
}
