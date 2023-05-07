# Telford Bridge

The Telford Bridge is a smart contract project that enables users to bridge assets between Ethereum Layer 2 chains, specifically Optimism and Arbitrum. The Telford Bridge allows users to send assets from one chain to another, while utilizing bonder services to provide liquidity for the bridged assets.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Future Work](#future-work)
- [License](#license)

## Installation

To install the necessary dependencies, run the following command:

```bash
npm install
```

## Usage

To deploy the contracts, first compile the contracts using:

```bash
npx hardhat compile
```

Then, deploy the contracts to the desired network by running:

```bash
npx hardhat run --network <network> scripts/deploy.js
```

Replace `<network>` with the network you want to deploy to, e.g., `mainnet`, `kovan`, `rinkeby`, etc.

## Testing

To run tests for the Telford Bridge, execute the following command:

\```bash
npx hardhat test
\```

## Future Work

- Support for a bonder registry instead of a single bonder
- Support for ERC20 tokens
- Support for multiple chains, requiring chainId, interface/lib for cross-chain calls, etc.

## License

This project is licensed under the MIT License.
