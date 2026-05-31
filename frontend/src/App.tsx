import { useState, useEffect } from "react"
import WalletConnect from "./pages/WalletConnect"
import CreateProject from "./pages/CreateProject"
import ProjectDetails from "./pages/ProjectDetails"

function App() {

  const [account, setAccount] = useState(null)

  const [project, setProject] = useState(() => {
    const savedProject = localStorage.getItem("project")
    return savedProject ? JSON.parse(savedProject) : null
  })

  // Save project to localStorage whenever it changes
  useEffect(() => {
    if (project) {
      localStorage.setItem("project", JSON.stringify(project))
    }
  }, [project])

  // Wallet not connected
  if (!account) {
    return <WalletConnect setAccount={setAccount} />
  }

  // No project yet
  if (!project) {
    return (
      <CreateProject
        account={account}
        setProject={setProject}
      />
    )
  }

  // Project exists → Dashboard
  return (
    <ProjectDetails
      project={project}
      account={account}
    />
  )
}

export default App