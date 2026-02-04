

# SolCipher-iExec: Confidential Cross-Chain Bridge

## Overview
A privacy-focused cross-chain bridge enabling confidential USDC transfers between Arbitrum Sepolia and Ethereum Sepolia with iExec TEE protection. Clean, Across Protocol-inspired design focused on trust and clarity.

---

## Pages & Features

### 1. Landing Page (`/`)
- **Hero Section**: "Confidential Cross-Chain Transfers" headline with shield icon animation
- **Value Props**: Three cards - MEV Protection, Private Transfers, TEE Security
- **Live Stats Bar**: Total Volume, Transactions, Bridge Time, Chains (mock data)
- **CTA**: Connect Wallet button leading to Bridge page

### 2. Bridge Interface (`/bridge`) - Priority Feature
- **Chain Selectors**: Arbitrum Sepolia ↔ Ethereum Sepolia with swap button
- **Token Input**: USDC amount with balance display and MAX button
- **Privacy Toggle**: Switch with lock icon + "Protected by iExec TEE" badge
- **Fee Display**: Estimated gas, bridge time (~5 min)
- **Preview Button**: Opens confirmation modal

### 3. Transaction Preview Modal
- Summary of transfer (amount, chains, recipient)
- Privacy status confirmation with TEE badge
- Encrypted data hash preview
- Confirm & Bridge button with wallet signature

### 4. Real-Time Status Dashboard - Priority Feature
- **Progress Stepper** (5 steps):
  1. ✓ Wallet Signature
  2. 🔒 Encrypting in TEE
  3. ⏳ Source Chain Confirmation
  4. 🔗 Cross-Chain Messaging
  5. ✅ Destination Settlement
- Live status updates with animated transitions
- Transaction hash (clickable to block explorer)
- Estimated time remaining

### 5. Transaction History (`/history`) - Priority Feature
- **Table View**: Date, Route, Amount, Status, Privacy, Actions
- **Status Badges**: Pending (amber), Completed (green), Failed (red)
- **Privacy Indicator**: Lock icon for encrypted transactions
- **Filters**: Chain filter, status filter
- **Actions**: View details, copy transaction hash

---

## Technical Implementation

### Wallet Integration (Wagmi + viem)
- MetaMask connection with account/network detection
- Chain switching between Arbitrum Sepolia & Ethereum Sepolia
- Mock USDC balance fetching
- Transaction signing flow

### State Management
- React Query for async state
- Local state for bridge form
- Mock transaction storage (localStorage for demo persistence)

### Mock iExec TEE Simulation
- Simulated encryption delay (2-3 seconds)
- Generated encrypted data hashes
- Privacy level indicators

---

## Design System (Across Protocol-inspired)

### Colors
- **Background**: Dark navy (#0F172A)
- **Cards**: Slate (#1E293B) with subtle borders
- **Primary Accent**: Electric blue (#3B82F6)
- **Success**: Emerald (#10B981)
- **Warning**: Amber (#F59E0B)
- **Privacy/TEE**: Purple (#8B5CF6)

### Visual Elements
- Clean, minimal card layouts
- Subtle gradients (not heavy)
- Clear status indicators
- Animated progress steppers
- Shield/lock iconography for privacy features
- Monospace font for addresses/hashes

---

## MVP Scope for < 24 Hours

### Included
✅ Landing page with hero + stats  
✅ Full bridge interface with privacy toggle  
✅ Wallet connection (Wagmi/viem)  
✅ Transaction preview modal  
✅ Real-time status tracker  
✅ Transaction history page  
✅ Mock TEE encryption simulation  
✅ Dark mode design  
✅ Toast notifications for feedback  

### Deferred (Post-MVP)
- Mobile responsive refinements
- Documentation page
- Animated explainer/tutorial
- Export to CSV feature
- Encrypted memo feature

---

## User Flow

1. **Land** → View hero, stats, understand value prop
2. **Connect** → MetaMask wallet connection
3. **Bridge** → Select chains, enter amount, enable privacy
4. **Preview** → Review transaction details in modal
5. **Confirm** → Sign transaction, watch real-time progress
6. **Complete** → View in transaction history

This delivers a polished, demo-ready prototype showcasing the privacy-first UX for your hackathon submission.

