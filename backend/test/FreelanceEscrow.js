import { expect } from "chai";
import hre from "hardhat";

describe("FreelanceEscrow", function () {

  it(" Успешное развертывание смарт-контракта", async function () {

    const FreelanceEscrow =
      await hre.ethers.getContractFactory("FreelanceEscrow");

    const contract = await FreelanceEscrow.deploy(
  "0x0000000000000000000000000000000000000001",
  3
);

    await contract.waitForDeployment();

    expect(await contract.getAddress()).to.not.equal(undefined);

  });

});