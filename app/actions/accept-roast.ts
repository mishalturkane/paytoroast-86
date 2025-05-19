"use server"

import { revalidatePath } from "next/cache"
import { RoastStatus } from "@/types/roast"
import { getRoastById, updateRoastStatus } from "@/lib/roast-service"

interface AcceptRoastResponse {
  success: boolean
  error?: string
  transactionId?: string
  tweetPosted?: boolean
}

export async function acceptRoast(formData: FormData): Promise<AcceptRoastResponse> {
  try {
    const roastId = formData.get("roastId") as string
    const receiverAddress = formData.get("receiverAddress") as string
    const shareOnX = formData.get("shareOnX") === "true"
    const twitterUsername = formData.get("twitterUsername") as string
    const twitterId = formData.get("twitterId") as string

    if (!roastId) {
      return { success: false, error: "Roast ID is required" }
    }

    if (!receiverAddress) {
      return { success: false, error: "Receiver address is required" }
    }

    // Get the roast
    const roast = getRoastById(roastId)
    if (!roast) {
      return { success: false, error: "Roast not found" }
    }

    if (roast.status !== RoastStatus.PENDING) {
      return { success: false, error: "Roast has already been processed" }
    }

    // For demo purposes, we'll simulate a transaction ID
    // In a real implementation, this would be a real Solana transaction
    const transactionId = `tx_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`

    // Update the roast status
    updateRoastStatus(roastId, RoastStatus.ACCEPTED, transactionId)

    // Handle Twitter posting
    let tweetPosted = false
    if (shareOnX && twitterUsername) {
      // In a real implementation, this would call the Twitter API to post a tweet
      // For demo purposes, we'll just simulate a successful tweet
      console.log(`Tweet posted by @${twitterUsername} about accepting roast ${roastId}`)
      tweetPosted = true
    }

    // Revalidate the feed page to show the updated roast
    revalidatePath("/feed")
    revalidatePath(`/roast/${roastId}`)
    revalidatePath("/x-posts")

    return {
      success: true,
      transactionId,
      tweetPosted,
    }
  } catch (error) {
    console.error("Error accepting roast:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
