const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TelfordSource", function () {
	let telfordSource;
	let owner;
	let account1;

	beforeEach("deploy contract", async () => {
		const accounts = await ethers.getSigners();

		owner = accounts[0];
		account1 = accounts[1];

		const TelfordSource = await ethers.getContractFactory("TelfordSource");
		telfordSource = await TelfordSource.deploy();
		await telfordSource.deployed();
	});

	describe("bridge", function () {
		it("should emit an event when a bridge is requested", async function () {
			await expect(telfordSource.bridge(12345, owner.address, account1.address))
				.to.emit(telfordSource, "BridgeRequested")
				.withArgs(12345);
		});
	});
});
