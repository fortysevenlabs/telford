// const { EtherscanProvider } = require("@ethersproject/providers");
const { use, expect } = require("chai");
const { ethers, waffle } = require("hardhat");
// const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("L1Relayer", async () => {
    let L1Relayer;
    let owner, telfordDestination, bonder, user, randomEOA;
    let telfordSource = "0xD2dB8075693aA6A0D5C026cdf319D517516c1D40";
    let optimismMessenger = "0x4361d0F75A0186C05f971c566dC6bEa5957483fD";
    let arbitrumMessenger = "0x578BAde599406A8fE3d24Fd7f7211c0911F5B29e";
    let maxSubmissionCost = "10000000000000000";
    let maxGas = "0";
    let gasPriceBid = "0";

    let amount = ethers.utils.parseEther("1");
    let transferId = 1;

    beforeEach("deploy contract", async () => {
        // get accounts using signers
        [owner, telfordDestination, bonder, user, randomEOA] = await ethers.getSigners();

        // get contract using ContractFactory
        const L1Relayer = await ethers.getContractFactory("L1Relayer");

        // deployed instance
        l1Relayer = await L1Relayer.deploy();

        await l1Relayer.deployed();
    });

    describe("receiveDestinationTransferConfirmation", () => {

        it("should revert when not called by optimismMessenger contract via the telfordDestination contract", async () => {
            await expect(
                l1Relayer.connect(randomEOA).receiveDestinationTransferConfirmation(bonder.address, user.address, amount, transferId)
            ).to.be.revertedWith("Only the Telford Destination Contract can perform this operation!");
        });

        it("should emit an event", async () => {
            await expect(l1Relayer.connect(optimismMessenger).receiveDestinationTransferConfirmation(bonder.address, user.address, amount, transferId))
                .to.emit(l1Relayer, "updatedInfo")
                .withArgs(bonder.address, user.address, amount, transferId);
        });

        it("should call on the relayToArbitrum contract", async () => {
            await l1Relayer.connect(optimismMessenger).receiveDestinationTransferConfirmation(bonder.address, user.address, amount, transferId)
            expect("relayToArbitrum").to.be.calledOnContractWith(maxSubmissionCost, maxGas, gasPriceBid);
        });
    });

    describe("relayToArbitrum", () => {

        it("should emit an event", async () => {
            await expect(l1Relayer.connect(optimismMessenger).relayToArbitrum(maxSubmissionCost, maxGas, gasPriceBid))
                .to.emit(l1Relayer, "RetryableTicketCreated")
                .withArgs(); // TO DO: mock the function that returns the ticketID
        });

        it("should return ticketID", async () => {
            await expect(l1Relayer.connect(optimismMessenger).relayToArbitrum(maxSubmissionCost, maxGas, gasPriceBid))
                .to.equal() // TO DO: mock the function that returns the ticketID
        });
    });


});