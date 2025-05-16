"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"

export function useSolanaWallet() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connected, wallet, connecting } = useWallet()
  const { toast } = useToast()
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch balance when connected
  useEffect(() => {
    if (!publicKey || !connection) return

    const fetchBalance = async () => {
      try {
        const balance = await connection.getBalance(publicKey)
        setBalance(balance / LAMPORTS_PER_SOL)
      } catch (error) {
        console.error("Failed to fetch balance:", error)
        setBalance(null)
      }
    }

    fetchBalance()
    const intervalId = setInterval(fetchBalance, 30000) // Update every 30 seconds

    return () => clearInterval(intervalId)
  }, [publicKey, connection])

  // Send SOL to recipient
  const sendSol = async (amount: number, recipientAddress: string): Promise<string> => {
    if (!publicKey || !connection) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send SOL",
        variant: "destructive",
      })
      return ""
    }

    setIsLoading(true)

    try {
      // Convert recipient address string to PublicKey
      let recipient: PublicKey
      try {
        recipient = new PublicKey(recipientAddress)
      } catch (error) {
        toast({
          title: "Invalid recipient address",
          description: "The recipient address is not valid",
          variant: "destructive",
        })
        setIsLoading(false)
        return ""
      }

      // Create a transaction to send SOL
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      )

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      // Send the transaction
      const signature = await sendTransaction(transaction, connection)

      // Wait for confirmation
      await connection.confirmTransaction(signature)

      // Update balance
      const newBalance = await connection.getBalance(publicKey)
      setBalance(newBalance / LAMPORTS_PER_SOL)

      toast({
        title: "Transaction successful",
        description: `Sent ${amount} SOL to ${recipientAddress.slice(0, 4)}...${recipientAddress.slice(-4)}`,
      })

      return signature
    } catch (error: any) {
      console.error("Transaction error:", error)

      // Don't show error toast for user rejections (code 4001)
      if (error?.code !== 4001) {
        toast({
          title: "Transaction failed",
          description: error?.message || "Unknown error occurred",
          variant: "destructive",
        })
      }

      return ""
    } finally {
      setIsLoading(false)
    }
  }

  return {
    publicKey: publicKey?.toString() || "",
    connected,
    connecting,
    isLoading,
    balance,
    walletName: wallet?.adapter.name || null,
    sendSol,
  }
}
