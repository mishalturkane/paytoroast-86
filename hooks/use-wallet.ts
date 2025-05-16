"use client"

import { useContext } from "react"
import { WalletContext } from "@/components/wallet-provider"

export const useWallet = () => useContext(WalletContext)
