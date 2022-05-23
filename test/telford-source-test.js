const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TelfordSource", function () {
	let telfordSource;
	let user;
	let bonder;
	let l1Relayer;
	let otherAccount;

	beforeEach("setup accounts", async () => {
		const accounts = await ethers.getSigners();

		user = accounts[0];
		bonder = accounts[1];
		l1Relayer = accounts[2];
		otherAccount = accounts[3];

		const TelfordSource = await ethers.getContractFactory("TelfordSource");
		telfordSource = await TelfordSource.deploy(bonder.address, l1Relayer.address);
		
		await telfordSource.deployed();
	});

	describe("bridge", function () {
		it("should revert when ether sent is less than or equal to the bonder fee", async function () {
			await expect(telfordSource.connect(user).bridge())
				.to.be.revertedWith("Ether sent must be greater than the bonder fee!");
		});

		it("should emit an event", async function () {
			await expect(telfordSource.connect(user).bridge({value: 1000000000000000000n}))
				.to.emit(telfordSource, "BridgeRequested")
				.withArgs(user.address, 800000000000000000n);
		});
	});

	describe("fundsReceivedOnDestination", function () {
		it("should revert when not called by the L1Relayer", async function () {
			await telfordSource.connect(user).bridge({value: 1000000000000000000n});

			await expect(telfordSource.connect(otherAccount).fundsReceivedOnDestination())
				.to.be.revertedWith("Sorry pal, I can only be called by the L1Relayer!");
		});

		it("should emit an event", async function () {
			await telfordSource.connect(user).bridge({value: 1000000000000000000n});

			await expect(telfordSource.connect(l1Relayer).fundsReceivedOnDestination())
				.to.emit(telfordSource, "BonderReimbursed")
				.withArgs(1000000000000000000n);
		});
	});
});
