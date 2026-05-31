import { ethers } from "ethers"
import { CONTRACT_ABI } from "./contractData"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any
  }
}

export const getContract = async (address: string) => {
  if (!window.ethereum) {
    alert("MetaMask not found")
    return null
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  const contract = new ethers.Contract(
    address, // 🔥 dynamic
    CONTRACT_ABI,
    signer
  )

  return contract
}