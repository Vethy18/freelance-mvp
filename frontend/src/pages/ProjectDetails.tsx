import { useState, useEffect } from "react"
import { getContract } from "../web3/contract"
import "../styles/projects.css"

type Project = {
  title: string
  client: string
  freelancer: string
  budget: number
  milestones: number
  contractAddress: string
}

type Props = {
  project: Project
  account: string
}

function ProjectDetails({ project, account }: Props) {

  const isClient =
    account?.toLowerCase() === project.client?.toLowerCase()

  const isFreelancer =
    account?.toLowerCase() === project.freelancer?.toLowerCase()

  const [milestoneStatus, setMilestoneStatus] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const loadMilestones = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const contract: any = await getContract(project.contractAddress)
      if (!contract) return

      const count = await contract.milestones()
      const total = Number(count)

      const statuses: string[] = []

      for (let i = 0; i < total; i++) {
        const status = await contract.milestoneStatus(i)

        const s = Number(status)

        if (s === 0) statuses.push("Pending")
        else if (s === 1) statuses.push("Submitted")
        else if (s === 2) statuses.push("Approved")
        else if (s === 3) statuses.push("Paid")
      }

      setMilestoneStatus(statuses)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMilestones()
  }, [])

  const submit = async (i: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contract: any = await getContract(project.contractAddress)
    const tx = await contract.submitWork(i)
    await tx.wait()
    loadMilestones()
  }

  const approve = async (i: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contract: any = await getContract(project.contractAddress)
    const tx = await contract.approveWork(i)
    await tx.wait()
    loadMilestones()
  }

  const pay = async (i: number) => {
  try {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contract: any = await getContract(project.contractAddress)

    // release payment
    const tx = await contract.releasePayment(i)

    // wait for confirmation
    await tx.wait()

    // calculate ETH per milestone
    const ethAmount = project.budget / project.milestones

    // example ETH price
    // you can later replace it with real API price
    const ethPriceUSD = 3500

    // convert to USD
    const usdAmount = ethAmount * ethPriceUSD

    // show alert
    alert(
      `✅ Payment Released Successfully!\n\n` +
      `Milestone ID: ${i + 1}\n\n` +
      `Freelancer Wallet:\n${project.freelancer}\n\n` +
      `ETH Sent: ${ethAmount} ETH\n` +
      `USD Value: $${usdAmount.toFixed(2)}`
    )

    // reload statuses
    loadMilestones()

  } catch (err) {

    console.error(err)

    alert(" Payment failed")

  }
}

  return (
    <div className="container">

      <h1>Project Dashboard</h1>
 {/* ✅ ONLY CLIENT SEES THIS */}
    {isClient && (
      <button
        className="btn-primary"
        style={{ marginBottom: "20px" }}
        onClick={() => {
          localStorage.removeItem("project")
          window.location.reload()
        }}
      >
        Create New Project
      </button>
    )}
      <div className="card">
        <h3>{project.title}</h3>
        <p><b>Client:</b> {project.client}</p>
        <p><b>Freelancer:</b> {project.freelancer}</p>
        <p><b>Budget:</b> {project.budget} ETH</p>
      </div>

      <h2>Milestones</h2>

      {loading && <p>Loading...</p>}

      {!loading && milestoneStatus.length === 0 && (
        <p>No milestones found</p>
      )}

      {milestoneStatus.map((status, i) => (
        <div key={i} className="milestone-card">

          <div className="milestone-header">
            <h4>Milestone #{i + 1}</h4>
            <span className={`badge ${status.toLowerCase()}`}>
              {status}
            </span>
          </div>

          {status === "Pending" && isFreelancer && (
            <button className="btn" onClick={() => submit(i)}>
              Submit Work
            </button>
          )}

          {status === "Submitted" && isClient && (
            <button className="btn" onClick={() => approve(i)}>
              Approve Work
            </button>
          )}

          {status === "Approved" && isClient && (
            <button className="btn-success" onClick={() => pay(i)}>
              Release Payment 💰
            </button>
          )}

          {status === "Paid" && (
            <p className="paid">Payment Released ✅</p>
          )}

        </div>
      ))}
    </div>
  )
}

export default ProjectDetails