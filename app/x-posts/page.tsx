"use client"

import { useState, useEffect } from "react"
import XPostPreview from "@/components/x-post-preview"
import NFTRoastCard from "@/components/nft-roast-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { getAcceptedRoasts } from "@/lib/roast-service"
import type { Roast } from "@/types/roast"

export default function XPostsPage() {
  const [viewMode, setViewMode] = useState<"standard" | "nft">("standard")
  const [roasts, setRoasts] = useState<Roast[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch accepted roasts
    const fetchRoasts = () => {
      try {
        const acceptedRoasts = getAcceptedRoasts()
        setRoasts(acceptedRoasts)
      } catch (error) {
        console.error("Failed to fetch roasts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoasts()
  }, [])

  // Generate roaster and roastee names based on sender address
  const getRoasterName = (address: string) => `User ${address.slice(0, 4)}`
  const getRoasteeName = (address: string) =>
    `User ${(Number.parseInt(address.slice(0, 4), 16) + 1).toString(16).slice(0, 4)}`

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Twitter Posts</h1>
              <p className="text-muted-foreground mt-2">
                When roasts are accepted, they are automatically shared on Twitter.
              </p>
            </div>
            <div className="flex items-center bg-muted rounded-md p-1">
              <button
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === "standard" ? "bg-white shadow" : "hover:bg-white/50"
                }`}
                onClick={() => setViewMode("standard")}
              >
                Standard
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === "nft" ? "bg-white shadow" : "hover:bg-white/50"
                }`}
                onClick={() => setViewMode("nft")}
              >
                NFT Cards
              </button>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Twitter Posts</CardTitle>
            <CardDescription>Check out the latest roasts that have been shared on Twitter.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {roasts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No roasts have been accepted and shared on Twitter yet.</p>
                <Link href="/feed" className="inline-flex items-center mt-4 text-sm text-primary hover:underline">
                  Browse roasts in the feed
                </Link>
              </div>
            ) : viewMode === "standard" ? (
              <>
                {roasts.map((roast) => (
                  <XPostPreview
                    key={roast.id}
                    roasterName={getRoasterName(roast.senderAddress)}
                    receiverName={getRoasteeName(roast.senderAddress)}
                    message={roast.message}
                    amount={roast.amount}
                    currency={roast.currency}
                  />
                ))}
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roasts.map((roast) => (
                  <NFTRoastCard
                    key={roast.id}
                    roast={roast}
                    roasterName={getRoasterName(roast.senderAddress)}
                    roasteeName={getRoasteeName(roast.senderAddress)}
                    xPostLink={`https://x.com/paytoroast/status/${roast.id}`}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
