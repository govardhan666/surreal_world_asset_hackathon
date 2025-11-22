const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy IPRegistry
  console.log("📜 Deploying IPRegistry...");
  const IPRegistry = await hre.ethers.getContractFactory("IPRegistry");
  const ipRegistry = await IPRegistry.deploy();
  await ipRegistry.waitForDeployment();
  const ipRegistryAddress = await ipRegistry.getAddress();
  console.log("✅ IPRegistry deployed to:", ipRegistryAddress);

  // Deploy IPFractionalization
  console.log("\n📜 Deploying IPFractionalization...");
  const IPFractionalization = await hre.ethers.getContractFactory("IPFractionalization");
  const ipFractionalization = await IPFractionalization.deploy();
  await ipFractionalization.waitForDeployment();
  const ipFractionalizationAddress = await ipFractionalization.getAddress();
  console.log("✅ IPFractionalization deployed to:", ipFractionalizationAddress);

  // Deploy DisputeResolution
  console.log("\n📜 Deploying DisputeResolution...");
  const DisputeResolution = await hre.ethers.getContractFactory("DisputeResolution");
  const disputeResolution = await DisputeResolution.deploy();
  await disputeResolution.waitForDeployment();
  const disputeResolutionAddress = await disputeResolution.getAddress();
  console.log("✅ DisputeResolution deployed to:", disputeResolutionAddress);

  // Summary
  console.log("\n🎉 Deployment Complete!\n");
  console.log("==================================");
  console.log("Contract Addresses:");
  console.log("==================================");
  console.log("IPRegistry:          ", ipRegistryAddress);
  console.log("IPFractionalization: ", ipFractionalizationAddress);
  console.log("DisputeResolution:   ", disputeResolutionAddress);
  console.log("==================================\n");

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      IPRegistry: ipRegistryAddress,
      IPFractionalization: ipFractionalizationAddress,
      DisputeResolution: disputeResolutionAddress,
    },
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
