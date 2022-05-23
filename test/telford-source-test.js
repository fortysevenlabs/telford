const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TelfordSource", function () {
	let telfordSource;
	let owner;
	let account1;
	let account2;
	let account3;

	beforeEach("setup accounts", async () => {
		const accounts = await ethers.getSigners();

		owner = accounts[0];
		account1 = accounts[1];
		account2 = accounts[2];
		account3 = accounts[3];

		const TelfordSource = await ethers.getContractFactory("TelfordSource");
		telfordSource = await TelfordSource.deploy(account1.address, account2.address);
		
		await telfordSource.deployed();
	});

	describe("bridge", function () {
		it("should revert when not called by a bonder", async function () {
			await expect(telfordSource.connect(owner).bridge({value: 0}))
				.to.be.revertedWith("Sorry pal, you gotta send more ether to cover the bonder fee!");
		});

		it("should emit an event", async function () {
			await expect(telfordSource.connect(owner).bridge({value: 1000000000000000000n}))
				.to.emit(telfordSource, "BridgeRequested")
				.withArgs(owner.address, 1000000000000000000n);
		});
	});

	describe("fundsReceivedOnDestination", function () {
		it("should revert when not called by the L1Relayer", async function () {
			await telfordSource.connect(owner).bridge({value: 1000000000000000000n});

			await expect(telfordSource.connect(account3).fundsReceivedOnDestination())
				.to.be.revertedWith("Sorry pal, I can only be called by the L1Relayer!");
		});

		it("should emit an event", async function () {
			await telfordSource.connect(owner).bridge({value: 1000000000000000000n});

			await expect(telfordSource.connect(account2).fundsReceivedOnDestination())
				.to.emit(telfordSource, "BonderReimbursed")
				.withArgs(1000000000000000000n);
		});
	});
});
