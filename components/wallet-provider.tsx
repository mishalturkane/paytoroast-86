"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// Mock Solana types and utilities
type PublicKey = { toString: () => string }

// Context type
interface WalletContextType {
  isConnected: boolean
  walletAddress: string
  balance: number
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  sendTransaction: (amount: number, currency: string, recipient: string) => Promise<string>
  walletName: string | null
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  walletAddress: "",
  balance: 0,
  connect: async () => {},
  disconnect: async () => {},
  sendTransaction: async () => "",
  walletName: null,
})

// Mock wallet detection
const detectWallets = () => {
  if (typeof window === "undefined") return []

  const wallets = []

  // Check for Phantom
  if (window.phantom) {
    wallets.push({ name: "Phantom", adapter: "phantom" })
  }

  // Check for Solflare
  if (window.solflare) {
    wallets.push({ name: "Solflare", adapter: "solflare" })
  }

  // Add a mock wallet for demo purposes
  wallets.push({ name: "Demo Wallet", adapter: "demo" })

  return wallets
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [balance, setBalance] = useState(10) // Default 10 SOL for demo
  const [walletName, setWalletName] = useState<string | null>(null)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Connect wallet
  const connect = async () => {
    if (mounted) {
      try {
        // In a real implementation, we would use the wallet adapter to connect
        // For demo purposes, we'll simulate a connection

        // Detect available wallets
        const availableWallets = detectWallets()

        if (availableWallets.length === 0) {
          toast({
            title: "No wallets found",
            description: "Please install a Solana wallet like Phantom or Solflare",
            variant: "destructive",
          })
          return
        }

        // Use the first available wallet
        const selectedWallet = availableWallets[0]

        // Generate a random wallet address for demo purposes
        const randomAddress = "sol" + Math.random().toString(36).substring(2, 10)

        setWalletAddress(randomAddress)
        setIsConnected(true)
        setWalletName(selectedWallet.name)

        toast({
          title: "Wallet Connected",
          description: `Connected to ${selectedWallet.name}`,
        })
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: error instanceof Error ? error.message : "Failed to connect wallet",
          variant: "destructive",
        })
      }
    }
  }

  // Disconnect wallet
  const disconnect = async () => {
    try {
      setWalletAddress("")
      setIsConnected(false)
      setWalletName(null)

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      })
    } catch (error) {
      toast({
        title: "Disconnect Failed",
        description: error instanceof Error ? error.message : "Failed to disconnect wallet",
        variant: "destructive",
      })
    }
  }

  // Send transaction
  const sendTransaction = async (amount: number, currency: string, recipient: string): Promise<string> => {
    try {
      if (!isConnected) {
        throw new Error("Wallet not connected")
      }

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if balance is sufficient (simplified for demo)
      if (balance < amount && currency === "sol") {
        throw new Error("Insufficient balance")
      }

      // Update balance (only for SOL for simplicity)
      if (currency === "sol") {
        setBalance((prev) => prev - amount)
      }

      // Generate fake transaction ID
      const txId = "tx" + Math.random().toString(36).substring(2, 15)

      toast({
        title: "Transaction Sent",
        description: `Sent ${amount} ${currency.toUpperCase()} to ${recipient.slice(0, 4)}...${recipient.slice(-4)}`,
      })

      return txId
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
      return ""
    }
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        balance,
        connect,
        disconnect,
        sendTransaction,
        walletName,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export { WalletContext }
export const useWallet = () => useContext(WalletContext)
