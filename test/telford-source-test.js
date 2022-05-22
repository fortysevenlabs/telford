const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TelfordSource", function () {
	let telfordSource;
	let owner;
	let account1;
	let stubbedAddress1;
	let stubbedAddress2;

	beforeEach("setup accounts", async () => {
		const accounts = await ethers.getSigners();

		owner = accounts[0];
		account1 = accounts[1]; // how can I access more than 2 accounts from ethers.getSigners()? stack overflow says I should be able to access up to 20, but it won't let me set more than 2...
		stubbedAddress1 = "0xc0ffee254729296a45a3885639AC7E10F9d54979"; 
		stubbedAddress2 = "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E";
	});

	describe("bridge", function () {
		it("should emit an event", async function () {
			const TelfordSource = await ethers.getContractFactory("TelfordSource");
			telfordSource = await TelfordSource.deploy(stubbedAddress1, stubbedAddress2);
			await telfordSource.deployed();

			await expect(telfordSource.connect(owner).bridge(12345))
				.to.emit(telfordSource, "BridgeRequested")
				.withArgs(12345);
		});
	});

	describe("bond", function () {
		it("should revert when not called by a bonder", async function () {
			const TelfordSource = await ethers.getContractFactory("TelfordSource");
			telfordSource = await TelfordSource.deploy(owner.address, stubbedAddress2);
			await telfordSource.deployed();

			await expect(telfordSource.connect(account1).bond())
				.to.be.revertedWith("Sorry pal, I can only be called by the Bonder!");
		});

		it("should emit an event", async function () {
			const TelfordSource = await ethers.getContractFactory("TelfordSource");
			telfordSource = await TelfordSource.deploy(owner.address, stubbedAddress2);  
			await telfordSource.deployed();

			await telfordSource.connect(account1).bridge(12345);

			await expect(telfordSource.connect(owner).bond())
				.to.emit(telfordSource, "TransferRequestBonded")
				.withArgs(account1.address);
		});
	});

	describe("fundsReceivedOnDestination", function () {
		it("should revert when not called by the L1Relayer", async function () {
			const TelfordSource = await ethers.getContractFactory("TelfordSource");
			telfordSource = await TelfordSource.deploy(account1.address, stubbedAddress2);
			await telfordSource.deployed();

			await telfordSource.connect(owner).bridge(12345);
			await telfordSource.connect(account1).bond()

			await expect(telfordSource.connect(account1).fundsReceivedOnDestination())
				.to.be.revertedWith("Sorry pal, I can only be called by the L1Relayer!");
		});

		it("should emit an event", async function () {
			const TelfordSource = await ethers.getContractFactory("TelfordSource");
			telfordSource = await TelfordSource.deploy(account1.address, owner.address);
			await telfordSource.deployed();

			await telfordSource.connect(owner).bridge(12345); // doesnt make sense, need third address for L1Relayer...but this gets it to pass
			await telfordSource.connect(account1).bond()

			await expect(telfordSource.connect(owner).fundsReceivedOnDestination())
				.to.emit(telfordSource, "BonderReimbursed")
				.withArgs(200000000000012345n);
		});
	});
});
