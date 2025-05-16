"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function WalletButton() {
  const { publicKey, connected, connecting } = useWallet()
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show toast when successfully connected
  useEffect(() => {
    if (mounted && connected && publicKey) {
      toast({
        title: "Wallet Connected",
        description: `Connected to ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`,
      })
    }
  }, [connected, publicKey, mounted, toast])

  if (!mounted) {
    return null
  }

  return (
    <div className="wallet-button-container">
      <WalletMultiButton />

      {/* Custom styles for the wallet button */}
      <style jsx global>{`
        .wallet-adapter-button {
          background-color: #F26119;
          color: white;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 500;
          height: 2.5rem;
          transition: all 0.2s ease;
        }
        
        .wallet-adapter-button:hover {
          background-color: rgba(242, 97, 25, 0.9);
          opacity: 0.9;
        }
        
        .wallet-adapter-button:not([disabled]):hover {
          background-color: rgba(242, 97, 25, 0.9);
        }
        
        .wallet-adapter-button-trigger {
          background-color: #F26119;
        }
        
        .wallet-adapter-button-trigger:not([disabled]):hover {
          background-color: rgba(242, 97, 25, 0.9);
        }
        
        .wallet-adapter-modal-wrapper {
          background-color: var(--background);
        }
        
        .wallet-adapter-modal-button-close {
          background-color: var(--background);
        }
        
        .wallet-adapter-modal-title {
          color: var(--foreground);
        }
        
        .wallet-adapter-modal-content {
          color: var(--foreground);
        }
        
        .wallet-adapter-modal-list .wallet-adapter-button {
          background-color: var(--muted);
          color: var(--foreground);
        }
        
        .wallet-adapter-dropdown-list {
          background-color: var(--background);
        }
        
        .wallet-adapter-dropdown-list-item {
          color: var(--foreground);
        }
        
        .wallet-adapter-dropdown-list-item:hover {
          background-color: var(--muted);
        }
        
        :root {
          --background: hsl(0, 0%, 100%);
          --foreground: hsl(20, 14.3%, 4.1%);
          --muted: hsl(60, 4.8%, 95.9%);
        }
        
        .dark {
          --background: hsl(20, 14.3%, 4.1%);
          --foreground: hsl(60, 9.1%, 97.8%);
          --muted: hsl(12, 6.5%, 15.1%);
        }
      `}</style>
    </div>
  )
}
