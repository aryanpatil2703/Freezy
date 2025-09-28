# HumanWork Protocol

A decentralized freelancing platform built on blockchain technology that enables secure, trustless work agreements between clients and freelancers. The protocol leverages World ID for human verification and IPFS for decentralized storage of project details and deliverables.

## 🌟 Features

- **Human Verification**: Integration with World ID to ensure only verified humans can participate
- **Decentralized Storage**: IPFS integration for storing project descriptions and deliverables
- **Smart Contract Escrow**: Secure fund management with automatic payment upon work completion
- **Reputation System**: Built-in reputation tracking for freelancers based on completed projects
- **Multi-Chain Support**: Deployed on World Chain and Hedera networks
- **Modern Frontend**: React/Next.js application with Tailwind CSS for a beautiful user experience

## 🏗️ Architecture

The project consists of two main components:

### Smart Contracts (`humanwork-protocol-contracts/`)
- **UserRegistry**: Manages user registration with World ID verification
- **SimpleEscrow**: Handles project creation, work submission, and payment processing

### Frontend Application (`humanwork-protocol-frontend/`)
- **Next.js Application**: Modern React-based web interface
- **Wallet Integration**: MetaMask connectivity for blockchain interactions
- **IPFS Integration**: Decentralized storage for project data

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Foundry (for smart contract development)
- MetaMask wallet
- World ID app (for human verification)

### Smart Contract Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Freezy/humanwork-protocol-contracts
   ```

2. **Install dependencies**
   ```bash
   forge install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your private key and API keys to .env
   ```

4. **Build contracts**
   ```bash
   forge build
   ```

5. **Run tests**
   ```bash
   forge test
   ```

6. **Deploy contracts**
   ```bash
   # Deploy to World Chain
   forge script script/Deploy.s.sol --rpc-url worldchain --broadcast --verify
   
   # Deploy to Hedera
   forge script script/DeployHedera.s.sol --rpc-url hedera --broadcast
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../humanwork-protocol-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📋 Smart Contract Details

### UserRegistry Contract

The UserRegistry contract manages user registration and verification:

- **World ID Integration**: Verifies human identity using World ID proofs
- **User Profiles**: Stores user information including reputation and credentials
- **Reputation Management**: Tracks user reputation based on completed projects

**Key Functions:**
- `registerUser()`: Register a new user with World ID verification
- `addGitHubProof()`: Add GitHub proof for additional verification
- `updateReputation()`: Update user reputation after project completion

### SimpleEscrow Contract

The SimpleEscrow contract handles the core freelancing functionality:

- **Project Management**: Create and manage freelance projects
- **Escrow System**: Secure fund holding until work completion
- **Workflow Management**: Handle work submission and approval process

**Key Functions:**
- `createProject()`: Create a new project with escrow funding
- `submitWork()`: Submit completed work for review
- `approveWork()`: Approve work and release payment

## 🌐 Supported Networks

### World Chain (Testnet)
- **Chain ID**: 424242
- **RPC URL**: `https://worldchain-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
- **Explorer**: https://testnet.worlds.org

### Hedera (Testnet)
- **Chain ID**: 296
- **RPC URL**: `https://testnet.hashio.io/api`
- **Explorer**: https://hashscan.io/testnet

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the contracts directory with:

```env
# Private key for deployment
PRIVATE_KEY=your_private_key_here

# API keys
ALCHEMY_API_KEY=your_alchemy_key
WORLDC_ETHERSCAN_API_KEY=your_worldscan_key

# Network configurations
WORLD_ID_ROUTER=0x93a311A2958A436288f836264B4476a454E5A7eC
```

### Frontend Configuration

Update the contract addresses in the frontend components to match your deployed contracts.

## 📱 Usage

### For Clients

1. **Connect Wallet**: Connect your MetaMask wallet
2. **Register**: Complete World ID verification to register
3. **Post Jobs**: Create projects with descriptions and budgets
4. **Review Work**: Review submitted work and approve payments

### For Freelancers

1. **Connect Wallet**: Connect your MetaMask wallet
2. **Register**: Complete World ID verification to register
3. **Browse Jobs**: View available projects
4. **Submit Work**: Submit completed work for review
5. **Receive Payment**: Get paid automatically upon approval

## 🧪 Testing

### Smart Contract Tests

```bash
# Run all tests
forge test

# Run with verbose output
forge test -vvv

# Run specific test
forge test --match-test testCreateProject
```

### Frontend Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build
```

## 📦 Deployment

### Smart Contracts

The contracts are deployed using Foundry scripts:

- **Deploy.s.sol**: Deploys to World Chain
- **DeployHedera.s.sol**: Deploys to Hedera

### Frontend

Deploy the frontend to your preferred hosting platform:

```bash
npm run build
npm run start
```

## 🔒 Security Considerations

- **World ID Verification**: Ensures only verified humans can participate
- **Smart Contract Audits**: Contracts should be audited before mainnet deployment
- **Access Control**: Proper access controls implemented for all functions
- **Input Validation**: All inputs are validated to prevent attacks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🗺️ Roadmap

- [ ] Multi-token support (ETH, HBAR, etc.)
- [ ] Dispute resolution mechanism
- [ ] Advanced reputation algorithms
- [ ] Mobile application
- [ ] Integration with more identity providers
- [ ] Cross-chain functionality

## 🙏 Acknowledgments

- [World ID](https://worldcoin.org/world-id) for human verification
- [IPFS](https://ipfs.io/) for decentralized storage
- [Foundry](https://book.getfoundry.sh/) for smart contract development
- [Next.js](https://nextjs.org/) for the frontend framework

---

**Built with ❤️ for the decentralized future of work**
