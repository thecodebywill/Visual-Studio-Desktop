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
- `PRIVATE_KEY`: Your wallet private key (never share or commit this)
- Additional configuration for Celo testnet/mainnet

## Development Workflow

1. **Connecting to Celo Network**

   First, create a `.env` file in your project root:

   ```plaintext:.env
   VITE_PRIVATE_KEY=your_wallet_private_key_here
   VITE_CONTRACT_ADDRESS=your_deployed_contract_address
   ```

   Then set up the network connection using the private key:

```Typescript
import { ethers } from 'ethers';

  const provider = new ethers.providers.JsonRpcProvider(
   process.env.VITE_NETWORK === 'mainnet'
   ? 'https://forno.celo.org'
   : 'https://alfajores-forno.celo-testnet.org'
);

const wallet = new ethers.Wallet(
 process.env.VITE_PRIVATE_KEY as string,
 provider
);
```

2. **Initialize Smart Contract Connection**

- Import contract ABI
- Create contract instance using the wallet
- Validate network connection
- Handle Wallet Connections

3. **Connect using initialized wallet instance**

- Implement wallet connection state management
- Handle network changes
- Manage Invoice Generation Flow

For local development:

```bash
npm run dev
```

For contract deployment using your private key:

```bash
npx hardhat run scripts/deploy.ts --network alfajores
```

## Future Considerations

- Multi-chain support
- Additional payment methods
- Enhanced analytics
- Mobile responsiveness improvements
