// const { EtherscanProvider } = require("@ethersproject/providers");
const { use, expect } = require("chai");
const { ethers, waffle } = require("hardhat");
// const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("TelfordDestination", async () => {
    let telfordDestination;
    let owner, bonder, user, randomEOA;

    let bridgeRequestId = 1;
    let depositAmount = ethers.utils.parseEther("1");
    
    beforeEach("deploy contract", async () => {
        // get accounts using signers
        [owner, bonder, user, randomEOA] = await ethers.getSigners();

        // get contract using ContractFactory
        const TelfordDestination = await ethers.getContractFactory("TelfordDestination");

        // deployed instance
        telfordDestination = await TelfordDestination.deploy(
            bonder.address,
            "0x4200000000000000000000000000000000000007",
            "0xb5cf88Df79CfdFe52572C5F015017fe486979b61"
        );

        await telfordDestination.deployed();
    });

    describe("depositAndDistribute", () => {

        it("should revert when not called by registered bonder", async () => {
            const non_bonder_deposit_tx = telfordDestination.depositAndDistribute(user.address, bridgeRequestId, {value: depositAmount });

            await expect(non_bonder_deposit_tx)
                .to.be.revertedWith("You must be a bonder to initiate withdrawAndDistribute!");
        });

         it("should successfully deposit depositAmount from bonder to user", async () => {
            const contractAddress = telfordDestination.address;
            
            // pre-tx balances
            const bonderPrevBalance = await bonder.getBalance();
            const contractPrevBalance = await ethers.provider.getBalance(contractAddress);;
            const userPrevBalance = await bonder.getBalance();

            const tx = await telfordDestination.connect(bonder).depositAndDistribute(user.address, bridgeRequestId, {value: depositAmount});

            // post-tx balances
            const bonderCurrBalance = await bonder.getBalance();
            const contractCurrBalance = await ethers.provider.getBalance(contractAddress);;
            const userCurrBalance = await user.getBalance();

            // changeEtherBalances doesn't work when there are multiple transactions mined in the block
            // seems to work, but is this ok? does bonder -> contract, contract -> user not count as multiple txns?
            expect(tx).to.changeEtherBalances([bonder, user], [ethers.utils.parseEther("-1"), depositAmount]);
        });

        it("should emit a TransferFromBonder event", async () => {
            const tx = telfordDestination.connect(bonder).depositAndDistribute(user.address, bridgeRequestId, {value: depositAmount});
            const contractAddress = telfordDestination.address;

            
            await expect(tx)
                .to.emit(telfordDestination, "TransferFromBonder")
                .withArgs(bridgeRequestId, depositAmount, bonder.address, contractAddress, user.address)
        });


    });
});

// todo: How should we approach unit tests for private methods?
// - test _distribute()
// - test emitted event TransferToUser()
// - test _relayTransferConfirmation()
// - test emitted event RelayTransferConfirmation()
// 
// https://ethereum.stackexchange.com/a/38162
// internal - inhert and test
// private - (option 1) make them public/internal, test and change them back
//           (option 2) move private funcs to library, import to contract. this makes them public to contract but not exposed in actual contract

// todo: How do we stub calls to x-chain?
// - x-chain contract call "relayTransferConfirmation" fail in the above unit tests
// - x-chain contract doesn't exist from the perspective of the testing lib