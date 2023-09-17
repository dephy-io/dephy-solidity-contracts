const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DePhy", function () {
  it("Test contract", async function () {
    const ContractFactory = await ethers.getContractFactory("DePhy");

    const instance = await upgrades.deployProxy(ContractFactory);
    await instance.waitForDeployment();

    expect(await instance.name()).to.equal("DePhy");
  });
});
