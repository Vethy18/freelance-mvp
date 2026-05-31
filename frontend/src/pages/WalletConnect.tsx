import { useState, useEffect } from "react"

type Props = {
  setAccount: (account: string) => void
}

function WalletConnect({ setAccount }: Props) {

  const [connectedAccount, setConnectedAccount] = useState<string | null>(null)

  async function connectWallet() {
    if (!(window as any).ethereum) {
      alert("MetaMask is not installed")
      return
    }

    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      })

      const account = accounts[0]

      setConnectedAccount(account)
      setAccount(account)

    } catch (error) {
      console.error(error)
      alert("Wallet connection failed")
    }
  }

  useEffect(() => {
    if (!(window as any).ethereum) return

    ;(window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length > 0) {
        const account = accounts[0]
        setConnectedAccount(account)
        setAccount(account)
      }
    })
  }, [])

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>

      <h1>Freelance Blockchain MVP</h1>

      {!connectedAccount ? (
        <>
          <p>Connect your wallet to start</p>
          <button onClick={connectWallet}>
            Connect Wallet
          </button>
        </>
      ) : (
        <p>Connected: {connectedAccount}</p>
      )}

    </div>
  )
}

export default WalletConnect