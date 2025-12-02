const hre = require("hardhat");

async function main() {
  console.log("Deploying IP Guardian contracts to Story Protocol testnet...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "IP\n");

  // Deploy IPFractionalization contract
  console.log("Deploying IPFractionalization contract...");
  const IPFractionalization = await hre.ethers.getContractFactory("IPFractionalization");
  const ipFractionalization = await IPFractionalization.deploy();
  await ipFractionalization.waitForDeployment();
  const ipFractionalizationAddress = await ipFractionalization.getAddress();
  console.log("✅ IPFractionalization deployed to:", ipFractionalizationAddress);

  // Deploy RoyaltyDistributor contract
  console.log("\nDeploying RoyaltyDistributor contract...");
  const RoyaltyDistributor = await hre.ethers.getContractFactory("RoyaltyDistributor");
  const royaltyDistributor = await RoyaltyDistributor.deploy();
  await royaltyDistributor.waitForDeployment();
  const royaltyDistributorAddress = await royaltyDistributor.getAddress();
  console.log("✅ RoyaltyDistributor deployed to:", royaltyDistributorAddress);

  // Print deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("📝 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("\nContract Addresses:");
  console.log("-------------------");
  console.log("IPFractionalization:", ipFractionalizationAddress);
  console.log("RoyaltyDistributor: ", royaltyDistributorAddress);
  console.log("\nNetwork: Story Protocol Testnet");
  console.log("Chain ID: 1513");
  console.log("\n" + "=".repeat(60));

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: "story-testnet",
    chainId: 1513,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      IPFractionalization: ipFractionalizationAddress,
      RoyaltyDistributor: royaltyDistributorAddress,
    },
  };

  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n✅ Deployment info saved to deployment.json");

  // Update .env file instructions
  console.log("\n" + "=".repeat(60));
  console.log("📋 NEXT STEPS");
  console.log("=".repeat(60));
  console.log("\n1. Update your .env file with these contract addresses:");
  console.log(`   NEXT_PUBLIC_IP_FRACTIONALIZATION_CONTRACT=${ipFractionalizationAddress}`);
  console.log(`   NEXT_PUBLIC_ROYALTY_DISTRIBUTOR_CONTRACT=${royaltyDistributorAddress}`);
  console.log("\n2. Verify contracts on Story Explorer:");
  console.log(`   https://testnet.storyscan.xyz/address/${ipFractionalizationAddress}`);
  console.log(`   https://testnet.storyscan.xyz/address/${royaltyDistributorAddress}`);
  console.log("\n" + "=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
