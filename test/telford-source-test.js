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
		it("should emit an event", async function () {
			await expect(telfordSource.connect(owner).bridge(12345))
				.to.emit(telfordSource, "BridgeRequested")
				.withArgs(12345);
		});
	});

	describe("bond", function () {
		it("should revert when not called by a bonder", async function () {
			await expect(telfordSource.connect(owner).bond())
				.to.be.revertedWith("Sorry pal, I can only be called by the Bonder!");
		});

		it("should emit an event", async function () {
			await telfordSource.connect(owner).bridge(12345);

			await expect(telfordSource.connect(account1).bond())
				.to.emit(telfordSource, "TransferRequestBonded")
				.withArgs(owner.address);
		});
	});

	describe("fundsReceivedOnDestination", function () {
		it("should revert when not called by the L1Relayer", async function () {
			await telfordSource.connect(owner).bridge(12345);
			await telfordSource.connect(account1).bond()

			await expect(telfordSource.connect(account3).fundsReceivedOnDestination())
				.to.be.revertedWith("Sorry pal, I can only be called by the L1Relayer!");
		});

		it("should emit an event", async function () {
			await telfordSource.connect(owner).bridge(12345);
			await telfordSource.connect(account1).bond()

			await expect(telfordSource.connect(account2).fundsReceivedOnDestination())
				.to.emit(telfordSource, "BonderReimbursed")
				.withArgs(200000000000012345n);
		});
	});
});
