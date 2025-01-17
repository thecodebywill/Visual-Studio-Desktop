# Paynder - Web3 Payment Platform

## Overview

Paynder is a modern Web3 payment platform built on the Celo blockchain, enabling seamless crypto payments and invoice generation. The platform combines cutting-edge blockchain technology with an intuitive user interface.

## Tech Stack

### Frontend

- **React** with TypeScript for type-safe development
- **TanStack Router** for efficient client-side routing
- **Ethers.js** for blockchain interactions
- **Vite** as the build tool and development server
- **Lucide Icons** for consistent iconography
- **CSS Modules** for scoped styling

### Smart Contracts

- **Solidity** for smart contract development
- **Hardhat** for contract deployment and testing
- **Celo** as the target blockchain
- Custom PaynderContract handling:
  - Invoice generation
  - Payment processing
  - User tracking
  - Multi-token support (USDT, USDC, cUSD)

### Key Features

1. **Wallet Integration**

   - MetaMask connection
   - Wallet address display and management
   - Balance tracking

2. **Invoice System**

   - Automated invoice number generation
   - PDF generation and export
   - WhatsApp and Email sharing capabilities
   - Smart contract-backed invoice tracking

3. **Dashboard**

   - Real-time balance display
   - Transaction history
   - Quick actions menu
   - Payment method management

4. **UI/UX**
   - Responsive design
   - Glass morphism effects
   - Modal system for focused tasks
   - Toast notifications

## Environment Setup

Required environment variables:

- `VITE_CONTRACT_ADDRESS`: Deployed PaynderContract address
- Additional configuration for Celo testnet/mainnet

## Development Workflow

1. Connect to Celo network (Alfajores testnet for development)
2. Initialize smart contract connection
3. Handle wallet connections
4. Manage invoice generation flow
5. Process payments through the contract

## Future Considerations

- Multi-chain support
- Additional payment methods
- Enhanced analytics
- Mobile responsiveness improvements
