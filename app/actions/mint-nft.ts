"use server"

import { revalidatePath } from "next/cache"
import { getRoastById } from "@/lib/roast-service"
import { createNFT, isRoastMinted } from "@/lib/nft-service"

interface MintNFTResponse {
  success: boolean
  error?: string
  nftId?: string
  transactionId?: string
}

export async function mintNFT(formData: FormData): Promise<MintNFTResponse> {
  try {
    const roastId = formData.get("roastId") as string
    const buyerAddress = formData.get("buyerAddress") as string
    const price = Number.parseFloat(formData.get("price") as string)

    if (!roastId) {
      return { success: false, error: "Roast ID is required" }
    }

    if (!buyerAddress) {
      return { success: false, error: "Buyer address is required" }
    }

    if (isNaN(price) || price <= 0) {
      return { success: false, error: "Price must be a positive number" }
    }

    // Get the roast
    const roast = getRoastById(roastId)
    if (!roast) {
      return { success: false, error: "Roast not found" }
    }

    // Check if the roast has already been minted
    if (isRoastMinted(roastId)) {
      return { success: false, error: "This roast has already been minted as an NFT" }
    }

    // For demo purposes, we'll simulate a successful mint
    // In a real implementation, this would create an NFT on the Solana blockchain

    // Generate a fake transaction ID
    const transactionId = `tx_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`

    // Create the NFT in our database
    const nft = createNFT(roastId, buyerAddress, price, transactionId)

    // Revalidate the NFT marketplace page
    revalidatePath("/nft-marketplace")

    return {
      success: true,
      nftId: nft.id,
      transactionId,
    }
  } catch (error) {
    console.error("Error minting NFT:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
