"use client"

import { useSolanaWallet } from "@/hooks/use-solana-wallet"
import { Wallet, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function WalletBalance() {
  const { balance, connected, connecting } = useSolanaWallet()
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !connected) {
    return null
  }

  if (connecting || balance === null) {
    return (
      <div className="flex items-center gap-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1.5 rounded-full">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1.5 rounded-full">
      <Wallet className="h-3.5 w-3.5" />
      <span>{balance.toFixed(4)} SOL</span>
    </div>
  )
}
