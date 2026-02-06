import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Clock, Link as LinkIcon, CheckCircle2, ExternalLink, Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BRIDGE_STEPS } from '@/lib/mock-data';
import { useTransactions } from '@/hooks/use-transactions';
import { SUPPORTED_CHAINS } from '@/lib/wagmi-config';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface TransactionStatusProps {
  transactionId: string;
  onClose: () => void;
}

export function TransactionStatus({ transactionId, onClose }: TransactionStatusProps) {
  const { getTransaction, transactions } = useTransactions();
  const [tx, setTx] = useState(getTransaction(transactionId));

  // Update tx when transactions change
  useEffect(() => {
    const updated = transactions.find(t => t.id === transactionId);
    if (updated) {
      setTx(updated);
    }
  }, [transactions, transactionId]);

  if (!tx) {
    return null;
  }

  const progress = (tx.currentStep / BRIDGE_STEPS.length) * 100;
  const isComplete = tx.status === 'completed';
  const explorer = SUPPORTED_CHAINS[tx.fromChain].explorer;

  const copyHash = () => {
    navigator.clipboard.writeText(tx.hash);
    toast({
      title: 'Copied!',
      description: 'Transaction hash copied to clipboard',
    });
  };

  const stepIcons: Record<number, React.ReactNode> = {
    1: <Check className="h-4 w-4" />,
    2: <Lock className="h-4 w-4" />,
    3: <Clock className="h-4 w-4" />,
    4: <LinkIcon className="h-4 w-4" />,
    5: <CheckCircle2 className="h-4 w-4" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">
            {isComplete ? 'Bridge Complete!' : 'Bridging in Progress'}
          </CardTitle>
          {isComplete && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {tx.currentStep} of {BRIDGE_STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Transfer Summary */}
          <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-secondary/50">
            <div className="text-center">
              <span className="text-2xl">{SUPPORTED_CHAINS[tx.fromChain].icon}</span>
            </div>
            <div className="text-2xl font-bold font-mono">{tx.amount} USDC</div>
            <div className="text-center">
              <span className="text-2xl">{SUPPORTED_CHAINS[tx.toChain].icon}</span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {BRIDGE_STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = tx.currentStep === stepNumber;
              const isCompleted = tx.currentStep > stepNumber;

              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'flex items-center gap-4 p-3 rounded-lg transition-colors',
                    isActive && 'bg-primary/10 border border-primary/30',
                    isCompleted && 'bg-success/10',
                    !isActive && !isCompleted && 'opacity-50'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                      isCompleted && 'bg-success text-success-foreground',
                      isActive && 'bg-primary text-primary-foreground animate-pulse',
                      !isActive && !isCompleted && 'bg-secondary'
                    )}
                  >
                    {stepIcons[stepNumber]}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{step.label}</div>
                    {isActive && (
                      <div className="text-sm text-muted-foreground">Processing...</div>
                    )}
                    {isCompleted && (
                      <div className="text-sm text-success">Completed</div>
                    )}
                  </div>
                  {isActive && (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Transaction Hash */}
          <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
            <div className="text-sm text-muted-foreground">Transaction Hash</div>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono flex-1 truncate">{tx.hash}</code>
              <Button variant="ghost" size="icon" onClick={copyHash}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={`${explorer}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Privacy Badge */}
          {tx.privacyEnabled && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-privacy/10 border border-privacy/20">
              <Lock className="h-5 w-5 text-privacy" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-privacy">Privacy Protected by iExec TEE</div>
                <div className="text-sm text-muted-foreground">
                  Protected Data Address:
                </div>
                <a 
                  href={`https://blockscout.bellecour.iex.ec/address/${tx.encryptedDataHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-primary hover:underline truncate block"
                >
                  {tx.encryptedDataHash?.slice(0, 24)}...
                </a>
              </div>
            </div>
          )}

          {/* Actions */}
          {isComplete && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Bridge Again
              </Button>
              <Button asChild className="flex-1">
                <a href="/history">View History</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
