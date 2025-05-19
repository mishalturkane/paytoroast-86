"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createRoast as createRoastInDb } from "@/lib/roast-service"

// Define the response type
interface CreateRoastResponse {
  success: boolean
  roastId?: string
  error?: string
  transactionId?: string
}

export async function createRoast(formData: FormData): Promise<CreateRoastResponse> {
  try {
    // Extract data from form
    const message = formData.get("message") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const currency = formData.get("currency") as string
    const senderAddress = formData.get("senderAddress") as string
    const twitterUsername = (formData.get("twitterUsername") as string) || undefined
    const shareOnTwitter = formData.get("shareOnTwitter") === "true"

    // Validate inputs
    if (!message || message.trim() === "") {
      return { success: false, error: "Roast message is required" }
    }

    if (isNaN(amount) || amount <= 0) {
      return { success: false, error: "Amount must be a positive number" }
    }

    if (!currency) {
      return { success: false, error: "Currency is required" }
    }

    if (!senderAddress) {
      return { success: false, error: "Sender address is required" }
    }

    // For demo purposes, we'll simulate a transaction ID
    const transactionId = `tx_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`

    // Create the roast in our database/service
    const roast = createRoastInDb(message, amount, currency, senderAddress)

    // Store the roast ID in a cookie for later reference
    cookies().set("lastRoastId", roast.id, {
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    // Revalidate the feed page to show the new roast
    revalidatePath("/feed")

    return {
      success: true,
      roastId: roast.id,
      transactionId,
    }
  } catch (error) {
    console.error("Error creating roast:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
