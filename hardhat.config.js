require("@nomiclabs/hardhat-waffle");
require('solidity-coverage');
require('dotenv').config();
require('hardhat-watcher');

// Web3 Provider Keys
const ARBITRUM_RINKEBY_ALCHEMY_KEY = process.env.ARBITRUM_RINKEBY_ALCHEMY_API_KEY;
const OPTIMISM_KOVAN_ALCHEMY_KEY = process.env.OPTIMISM_KOVAN_ALCHEMY_API_KEY;

// Wallet Private Keys
const WALLET_PRIVATE_KEY = process.env.DEV_WALLET_PRIVATE_KEY;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  watcher: {
    compilation: {
      tasks: ['compile'],
    },
  },
  networks: {
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
