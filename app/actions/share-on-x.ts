"use server"

import { revalidatePath } from "next/cache"
import { getRoastById } from "@/lib/roast-service"

interface ShareOnXResponse {
  success: boolean
  error?: string
  postUrl?: string
}

export async function shareOnX(formData: FormData): Promise<ShareOnXResponse> {
  try {
    const roastId = formData.get("roastId") as string
    const roasterName = formData.get("roasterName") as string
    const roasteeName = formData.get("roasteeName") as string
    const includeFullText = formData.get("includeFullText") === "true"
    const twitterUsername = formData.get("twitterUsername") as string

    if (!roastId) {
      return { success: false, error: "Roast ID is required" }
    }

    // Get the roast
    const roast = getRoastById(roastId)
    if (!roast) {
      return { success: false, error: "Roast not found" }
    }

    // In a real implementation, this would call the Twitter/X API to create a post
    // For demo purposes, we'll simulate a successful post
    console.log(`Tweet posted by ${twitterUsername || roasteeName} about roast ${roastId}`)

    // Generate a fake post URL
    const postId = Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
    const postUrl = `https://x.com/paytoroast/status/${postId}`

    // Revalidate the X posts page
    revalidatePath("/x-posts")

    return {
      success: true,
      postUrl,
    }
  } catch (error) {
    console.error("Error sharing on X:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
