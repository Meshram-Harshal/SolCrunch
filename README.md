# SolCrunch

SPL Token rent claiming Platform.

## Introduction

SolCrunch provides a scalable solution for Solana by minimizing rent-exempt requirements and offering advanced zk-compression technology for token compression and decompression. It facilitates the minting of compressed tokens and calculates rent exemptions based on the SPL tokens you hold. Aimed at addressing Solana's rent-exempt issue, where over 2% of the SOL supply is locked, SolCrunch reduces inefficiencies by offering rent calculation and optimization tools. By leveraging zk-compression and the Light protocol, SolCrunch enhances scalability and efficiency, providing a unique solution to Solana's rent-exemption problem.

### Blockchain Technology

- **Solana**: High-performance blockchain supporting builders around the world.
- **Helius**: RPC provider.
- **Light Protocol**: Zero-Knowledge Compression.

## Environment Variables

SolCrunch requires certain environment variables to be set for proper configuration. Create a `.env` file in the root directory based on the provided `.env.example` files.

| Variable                         | Description                                     | Example                                                          |
| -------------------------------- | ------------------------------------------------| ---------------------------------------------------------------- |
| `VITE_DEVNET_RPC`                | RPC URL for Solana Devnet                       | `https://devnet.helius-rpc.com?api-key=<YOUR_API_KEY>`           |
| `VITE_MAINNET_RPC`               | RPC URL for Solana Mainnet                      | `https://mainnet.helius-rpc.com?api-key=<YOUR_API_KEY>`          |

## Installation

### Prerequisites

- **Node.js** (v14 or later)
- **npm** or **yarn**