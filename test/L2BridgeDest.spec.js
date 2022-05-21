const { EtherscanProvider } = require("@ethersproject/providers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

beforeEach("deploy contract", async () => {
    // get accounts using signers
    const [owner] = await ethers.getSigners();

    // get contract using ContractFactory
    const L2BridgeDest = await ethers.getContractFactory("L2BridgeDest");

    // deployed instance
    const l2BridgeDest = await L2BridgeDest.deploy();
    await l2BridgeDest.deployed(); // is this required?
});

// describe("withdrawal from bonder", function() {
//     it("should reduce bonder balance", async function () {});
//     it("should increase contract balance", async function () {});
//     // emit event
// });

// describe("deposit to the user", function() {
//     it("should reduce bonder balance", async function () {});
//     it("should increase contract balance", async function () {});
//     // emit event
// });