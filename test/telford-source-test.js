const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TelfordSource", function () {
	let telfordSource;
	let owner;
	let account1;
	let userSourceAddr;
	let userDestinationAddr;
	let remimbursementAddress;

	beforeEach("setup accounts", async () => {
		const accounts = await ethers.getSigners();

		owner = accounts[0];
		account1 = accounts[1];

		userSourceAddr = "0x6aaE91d02706065833D3AA032c9eeBe8F2996c72";
		userDestinationAddr = "0xc0ffee254729296a45a3885639AC7E10F9d54979";
		remimbursementAddress = "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E";
	});

	describe("bridge", function () {
		it("should emit an event", async function () {
			const TelfordSource = await ethers.getContractFactory("TelfordSource");
			telfordSource = await TelfordSource.deploy(owner.address, account1.address);
			await telfordSource.deployed();

			await expect(telfordSource.connect(owner).bridge(12345, userSourceAddr, userDestinationAddr))
				.to.emit(telfordSource, "BridgeRequested")
				.withArgs(12345);
		});
	});

	describe("bond", function () {
		it("should revert when not called by a bonder", async function () {
			const TelfordSource = await ethers.getContractFactory("TelfordSource");
			telfordSource = await TelfordSource.deploy(owner.address, account1.address);
			await telfordSource.deployed();

			await expect(telfordSource.connect(account1).bond(remimbursementAddress))
				.to.be.revertedWith("Sorry pal, I can only be called by the Bonder!");
		});

		it("should emit an event", async function () {
			const TelfordSource = await ethers.getContractFactory("TelfordSource");
			telfordSource = await TelfordSource.deploy(owner.address, account1.address);
			await telfordSource.deployed();

			await telfordSource.connect(owner).bridge(12345, userSourceAddr, userDestinationAddr);

			await expect(telfordSource.connect(owner).bond(remimbursementAddress))
				.to.emit(telfordSource, "TransferRequestBonded")
				.withArgs(userDestinationAddr);
		});
	});

	describe("fundsReceivedOnDestination", function () {
		it("should revert when not called by the L1Relayer", async function () {
			const TelfordSource = await ethers.getContractFactory("TelfordSource");
			telfordSource = await TelfordSource.deploy(account1.address, owner.address);
			await telfordSource.deployed();

			await telfordSource.connect(owner).bridge(12345, userSourceAddr, userDestinationAddr);
			await telfordSource.connect(account1).bond(remimbursementAddress)

			await expect(telfordSource.connect(account1).fundsReceivedOnDestination())
				.to.be.revertedWith("Sorry pal, I can only be called by the L1Relayer!");
		});

		it("should emit an event", async function () {
			const TelfordSource = await ethers.getContractFactory("TelfordSource");
			telfordSource = await TelfordSource.deploy(account1.address, owner.address);
			await telfordSource.deployed();

			await telfordSource.connect(owner).bridge(12345, userSourceAddr, userDestinationAddr);
			await telfordSource.connect(account1).bond(remimbursementAddress)

			await expect(telfordSource.connect(owner).fundsReceivedOnDestination())
				.to.emit(telfordSource, "BonderReimbursed")
				.withArgs(200000000000012345n);
		});
	});
});
