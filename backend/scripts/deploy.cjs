const hre = require("hardhat")

async function main() {

  // 👇 GET 2 ACCOUNTS
  const [client, freelancer] = await hre.ethers.getSigners()

  console.log("Client:", client.address)
  console.log("Freelancer:", freelancer.address)

  // 👇 LOAD CONTRACT
  const Contract = await hre.ethers.getContractFactory("FreelanceEscrow")

  // 👇 DEPLOY FROM CLIENT
  const contract = await Contract.connect(client).deploy(
    freelancer.address, // freelancer address
    3, // milestones
    {
      value: hre.ethers.parseEther("1") // budget
    }
  )

  await contract.waitForDeployment()

  console.log("Contract deployed to:", contract.target)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})