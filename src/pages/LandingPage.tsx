import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Zap, Users, ArrowRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockStats } from '@/lib/mock-data';
import { useAccount } from 'wagmi';
import { WalletConnect } from '@/components/WalletConnect';

const features = [
  {
    icon: Zap,
    title: 'MEV Protection',
    description: 'Your transactions are shielded from front-running and sandwich attacks through TEE encryption.',
  },
  {
    icon: Lock,
    title: 'Private Transfers',
    description: 'Transaction details are encrypted end-to-end. Only you and the recipient can see the data.',
  },
  {
    icon: Shield,
    title: 'TEE Security',
    description: 'Powered by iExec Trusted Execution Environments for institutional-grade confidentiality.',
  },
];

const stats = [
  { label: 'Total Volume', value: mockStats.totalVolume, icon: Activity },
  { label: 'Transactions', value: mockStats.totalTransactions.toLocaleString(), icon: ArrowRight },
  { label: 'Bridge Time', value: mockStats.avgBridgeTime, icon: Zap },
  { label: 'Chains', value: mockStats.chainsSupported.toString(), icon: Users },
];

export default function LandingPage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-privacy/10 border border-privacy/20 rounded-full px-4 py-1.5 mb-8">
              <Lock className="h-4 w-4 text-privacy" />
              <span className="text-sm text-privacy font-medium">Protected by iExec TEE</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Confidential{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Cross-Chain
              </span>{' '}
              Transfers
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Bridge USDC between Arbitrum and Ethereum with complete privacy. 
              Your transactions are encrypted and protected from MEV attacks.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isConnected ? (
                <Link to="/bridge">
                  <Button size="lg" className="gap-2 animate-pulse-glow">
                    Start Bridging
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <WalletConnect />
              )}
              <Link to="/history">
                <Button variant="outline" size="lg" className="gap-2">
                  View Transactions
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-card/50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                  <span className="text-2xl md:text-3xl font-bold">{stat.value}</span>
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose SolCipher?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the most secure cross-chain bridge with privacy-first design 
              and institutional-grade protection.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <Card className="glass-card h-full hover:border-primary/50 transition-colors">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 SolCipher. Built with iExec TEE for confidential computing.</p>
          <p className="mt-2">Testnet Demo — Arbitrum Sepolia ↔ Ethereum Sepolia</p>
        </div>
      </footer>
    </div>
  );
}
