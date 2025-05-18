"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createRoast as createRoastInDb } from "@/lib/roast-service"
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"

// Define the input type for the create roast action
interface CreateRoastInput {
  message: string
  amount: number
  currency: string
  senderAddress: string
  receiverAddress?: string
}

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
    const receiverAddress = (formData.get("receiverAddress") as string) || undefined

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
    // In a real implementation, this would be a real Solana transaction
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

// Function to create a real Solana transaction (for future implementation)
async function createSolanaTransaction(
  senderAddress: string,
  receiverAddress: string,
  amount: number,
  currency: string,
): Promise<string> {
  try {
    // Only handle SOL for now
    if (currency.toLowerCase() !== "sol") {
      throw new Error("Only SOL transactions are supported at this time")
    }

    // Connect to Solana
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
      "confirmed",
    )

    // Create a new transaction
    const transaction = new Transaction()

    // Add a transfer instruction to the transaction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(senderAddress),
        toPubkey: new PublicKey(receiverAddress),
        lamports: amount * LAMPORTS_PER_SOL,
      }),
    )

    // Get a recent blockhash to include in the transaction
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = new PublicKey(senderAddress)

    // Serialize the transaction to base64
    const serializedTransaction = transaction.serialize({ requireAllSignatures: false })
    const base64Transaction = serializedTransaction.toString("base64")

    // In a real implementation, you would return this to be signed by the client
    return base64Transaction
  } catch (error) {
    console.error("Error creating Solana transaction:", error)
    throw error
  }
}
