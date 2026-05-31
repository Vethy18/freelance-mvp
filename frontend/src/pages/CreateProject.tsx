import { useState } from "react"
import { ethers } from "ethers"
import { CONTRACT_ABI, CONTRACT_BYTECODE } from "../web3/contractData"
import "../styles/projects.css"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CreateProject({ account, setProject }: any) {

  const [title, setTitle] = useState("")
  const [freelancer, setFreelancer] = useState("")
  const [budget, setBudget] = useState("")
  const [milestones, setMilestones] = useState("")
  const [error, setError] = useState("")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError("")

    if (!title || !freelancer || !budget || !milestones) {
      setError("Please fill all fields")
      return
    }

    if (account.toLowerCase() === freelancer.toLowerCase()) {
      setError("Freelancer must be different from client")
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const factory = new ethers.ContractFactory(
        CONTRACT_ABI,
        CONTRACT_BYTECODE,
        signer
      )

      const contract = await factory.deploy(
        freelancer,
        Number(milestones),
        {
          value: ethers.parseEther(budget)
        }
      )

      await contract.waitForDeployment()

      const contractAddress = await contract.getAddress()

      const newProject = {
        title,
        client: account,
        freelancer,
        budget: Number(budget),
        milestones: Number(milestones),
        contractAddress
      }

      localStorage.setItem("project", JSON.stringify(newProject))
      setProject(newProject)

    } catch (err) {
      console.error(err)
      setError("Transaction failed")
    }
  }

  return (
    <div className="container">
      <h1>Create Project</h1>

      <p className="wallet">Connected wallet:</p>
      <p className="address">{account}</p>

      <form onSubmit={handleSubmit} className="form">

        <input
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Freelancer Wallet Address"
          value={freelancer}
          onChange={(e) => setFreelancer(e.target.value)}
        />

        <input
          placeholder="Total Budget (ETH)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <input
          placeholder="Milestones Count"
          value={milestones}
          onChange={(e) => setMilestones(e.target.value)}
        />

        <button className="btn-primary">
          Create Project
        </button>

        {/* ✅ Inline error (like your screenshot) */}
        {error && <p className="error">❌ {error}</p>}

      </form>
    </div>
  )
}

export default CreateProject