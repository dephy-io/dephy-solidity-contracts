const standalone = process.env['HARDHAT'] === undefined;
if (standalone) {
  console.log("Running in standalone mode");
}

const { Command } = require('commander');
const program = new Command();

program
  .option("-d, --dry", "dry run")
  .option("-c, --compile", "compile the contract", standalone);

program.parse(process.argv);

const defaultContractName = "DePhy";
const contractName = program.args[0] ?? defaultContractName;
if (!contractName || contractName.trim().length === 0) {
  console.error("`--contract` must provide.");
  process.exit(1);
}
const options = program.opts();
const compile = options.compile;
const dryRun = options.dry;

const hre = require("hardhat");

async function main() {
  if (compile) {
    await hre.run("compile");
  }

  if (dryRun) {
    console.log("Dry run mode, the contract won't actual deploy to the network");
    process.exit(0);
  }

  const ContractFactory = await hre.ethers.getContractFactory("DePhy");

  const instance = await hre.upgrades.deployProxy(ContractFactory);
  await instance.waitForDeployment();

  console.log(`Proxy deployed to ${await instance.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
