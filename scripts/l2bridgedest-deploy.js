async function main() {
  const [,,,deployer] = await ethers.getSigners();
  console.log(deployer);

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const L2BridgeDest = await ethers.getContractFactory("L2BridgeDest");
  const l2bridgedest = await L2BridgeDest.deploy();

  console.log("L2BridgeDest address:", l2bridgedest.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
