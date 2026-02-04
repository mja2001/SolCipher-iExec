import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Lock, ExternalLink, Copy, ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTransactions } from '@/hooks/use-transactions';
import { SUPPORTED_CHAINS, ChainKey } from '@/lib/wagmi-config';
import { TransactionStatus } from '@/lib/mock-data';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const statusColors: Record<TransactionStatus, string> = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  encrypting: 'bg-privacy/20 text-privacy border-privacy/30',
  confirming: 'bg-primary/20 text-primary border-primary/30',
  bridging: 'bg-primary/20 text-primary border-primary/30',
  completed: 'bg-success/20 text-success border-success/30',
  failed: 'bg-destructive/20 text-destructive border-destructive/30',
};

const statusLabels: Record<TransactionStatus, string> = {
  pending: 'Pending',
  encrypting: 'Encrypting',
  confirming: 'Confirming',
  bridging: 'Bridging',
  completed: 'Completed',
  failed: 'Failed',
};

export default function HistoryPage() {
  const { transactions, isLoading } = useTransactions();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [chainFilter, setChainFilter] = useState<string>('all');

  const filteredTransactions = transactions.filter(tx => {
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    if (chainFilter !== 'all' && tx.fromChain !== chainFilter && tx.toChain !== chainFilter) return false;
    return true;
  });

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: 'Copied!',
      description: 'Transaction hash copied to clipboard',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="glass-card">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-2xl">Transaction History</CardTitle>
            
            {/* Filters */}
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={chainFilter} onValueChange={setChainFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chains</SelectItem>
                  <SelectItem value="arbitrum-sepolia">Arbitrum Sepolia</SelectItem>
                  <SelectItem value="ethereum-sepolia">Ethereum Sepolia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">No transactions found</div>
                <Button asChild>
                  <a href="/bridge">Start Bridging</a>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Privacy</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx, index) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="text-sm">
                          {formatDistanceToNow(tx.createdAt, { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{SUPPORTED_CHAINS[tx.fromChain].icon}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span>{SUPPORTED_CHAINS[tx.toChain].icon}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono font-medium">{tx.amount} USDC</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn('border', statusColors[tx.status])}
                        >
                          {statusLabels[tx.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {tx.privacyEnabled ? (
                          <div className="flex items-center gap-1 text-privacy">
                            <Lock className="h-4 w-4" />
                            <span className="text-sm">Protected</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Public</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyHash(tx.hash)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <a
                              href={`${SUPPORTED_CHAINS[tx.fromChain].explorer}/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
