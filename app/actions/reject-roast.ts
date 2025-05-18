"use server"

import { revalidatePath } from "next/cache"
import { RoastStatus } from "@/types/roast"
import { getRoastById, updateRoastStatus } from "@/lib/roast-service"

interface RejectRoastResponse {
  success: boolean
  error?: string
}

export async function rejectRoast(formData: FormData): Promise<RejectRoastResponse> {
  try {
    const roastId = formData.get("roastId") as string

    if (!roastId) {
      return { success: false, error: "Roast ID is required" }
    }

    // Get the roast
    const roast = getRoastById(roastId)
    if (!roast) {
      return { success: false, error: "Roast not found" }
    }

    if (roast.status !== RoastStatus.PENDING) {
      return { success: false, error: "Roast has already been processed" }
    }

    // Update the roast status
    updateRoastStatus(roastId, RoastStatus.REJECTED)

    // Revalidate the feed page to show the updated roast
    revalidatePath("/feed")
    revalidatePath(`/roast/${roastId}`)

    return { success: true }
  } catch (error) {
    console.error("Error rejecting roast:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
