require("@nomiclabs/hardhat-waffle");
require("hardhat-watcher");
require("hardhat-tracer");
require('solidity-coverage');
require('dotenv').config();

// Web3 Provider Keys
const ETH_MAINNET_ALCHEMY_KEY = process.env.ETH_MAINNET_ALCHEMY_API_KEY;
const ROPSTEN_INFURA_KEY = process.env.ROPSTEN_INFURA_API_KEY;
const ARBITRUM_RINKEBY_ALCHEMY_KEY = process.env.ARBITRUM_RINKEBY_ALCHEMY_API_KEY;
const OPTIMISM_KOVAN_ALCHEMY_KEY = process.env.OPTIMISM_KOVAN_ALCHEMY_API_KEY;
const KOVAN_INFURA_KEY = process.env.KOVAN_INFURA_API_KEY;

// Wallet Private Keys
const WALLET_PRIVATE_KEY = process.env.DEV_WALLET_PRIVATE_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  watcher: {
    c: {
      tasks: ['compile'],
    },
    c: {
      tasks: ['test'],
    },
    cct: {
      tasks: ['clean', 'compile', 'test'],
    },
  },
  networks: {
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${ETH_MAINNET_ALCHEMY_KEY}`,
      accounts: [`${WALLET_PRIVATE_KEY}`]
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${KOVAN_INFURA_KEY}`,
      accounts: [`${WALLET_PRIVATE_KEY}`]
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${ROPSTEN_INFURA_KEY}`,
      accounts: [`${WALLET_PRIVATE_KEY}`]
    },
    arbitrum_rinkeby: {
      url: `https://arb-rinkeby.g.alchemy.com/v2/${ARBITRUM_RINKEBY_ALCHEMY_KEY}`,
      accounts: [`${WALLET_PRIVATE_KEY}`]
    },
    optimism_kovan: {
      url: `https://opt-kovan.g.alchemy.com/v2/${OPTIMISM_KOVAN_ALCHEMY_KEY}`,
      accounts: [`${WALLET_PRIVATE_KEY}`]
    }
  }
};