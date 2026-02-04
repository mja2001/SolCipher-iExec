import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { Button } from '@/components/ui/button';
import { SUPPORTED_CHAINS, ChainKey } from '@/lib/wagmi-config';
import { Wallet, LogOut, ChevronDown, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const currentChain = chain ? Object.values(SUPPORTED_CHAINS).find(c => c.id === chain.id) : null;

  const handleConnect = () => {
    const injectedConnector = connectors.find(c => c.id === 'injected');
    
    if (!injectedConnector) {
      toast({
        title: 'No Wallet Found',
        description: 'Please install MetaMask or another Web3 wallet to continue.',
        variant: 'destructive',
      });
      return;
    }

    // Check if MetaMask/wallet is available
    if (typeof window !== 'undefined' && !window.ethereum) {
      toast({
        title: 'MetaMask Not Detected',
        description: 'Please install MetaMask browser extension to connect.',
        variant: 'destructive',
      });
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    connect(
      { connector: injectedConnector },
      {
        onError: (err) => {
          console.error('Connection error:', err);
          toast({
            title: 'Connection Failed',
            description: err.message || 'Failed to connect wallet. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {/* Chain Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <span className="text-lg">{currentChain?.icon || '🔗'}</span>
              <span className="hidden sm:inline">{currentChain?.name || 'Unknown'}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(SUPPORTED_CHAINS).map(([key, chain]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => switchChain({ chainId: chain.id })}
                className="gap-2"
              >
                <span>{chain.icon}</span>
                <span>{chain.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="gap-2">
              <Wallet className="h-4 w-4" />
              <span className="font-mono">{formatAddress(address)}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => disconnect()}
              className="gap-2 text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isPending}
      className="gap-2"
    >
      {isPending ? (
        <>
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}
