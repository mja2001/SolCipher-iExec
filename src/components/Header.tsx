import { Link, useLocation } from 'react-router-dom';
import { WalletConnect } from './WalletConnect';
import { Shield, History, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: null },
    { path: '/bridge', label: 'Bridge', icon: ArrowLeftRight },
    { path: '/history', label: 'History', icon: History },
  ];

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <Shield className="h-8 w-8 text-primary animate-shield-pulse" />
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
          </div>
          <span className="font-bold text-xl">
            Sol<span className="text-primary">Cipher</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Wallet */}
        <WalletConnect />
      </div>
    </header>
  );
}
