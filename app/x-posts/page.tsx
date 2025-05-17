"use client"

import { useState } from "react"
import XPostPreview from "@/components/x-post-preview"
import NFTRoastCard from "@/components/nft-roast-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Sample roasts for the page
const sampleRoasts = [
  {
    id: "roast1",
    message: "Bob is very dumb, then these duncky.",
    amount: 0.5,
    currency: "sol",
    senderAddress: "Alice",
    status: "accepted" as any,
    createdAt: new Date().toISOString(),
    transactionId: "tx123",
    likes: 24,
    comments: 5,
    views: 142,
  },
  {
    id: "roast2",
    message: "Your crypto portfolio is so bad, even LUNA investors feel sorry for you.",
    amount: 0.75,
    currency: "sol",
    senderAddress: "Charlie",
    status: "accepted" as any,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    transactionId: "tx456",
    likes: 18,
    comments: 3,
    views: 89,
  },
  {
    id: "roast3",
    message: "You HODL your opinions like you HODL your shitcoins - way past their expiration date.",
    amount: 50,
    currency: "usdc",
    senderAddress: "Eve",
    status: "accepted" as any,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    transactionId: "tx789",
    likes: 42,
    comments: 7,
    views: 231,
  },
]

// Update the roaster and roastee names
const roasteeNames = ["Bob", "Dave", "Frank"]

export default function XPostsPage() {
  const [viewMode, setViewMode] = useState<"standard" | "nft">("standard")

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
              <h1 className="text-3xl font-bold">X (Twitter) Posts</h1>
              <p className="text-muted-foreground mt-2">
                When roasts are accepted, they can be automatically shared on X (Twitter).
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
            <CardTitle>Recent X Posts</CardTitle>
            <CardDescription>Check out the latest roasts that have been shared on X (Twitter).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {viewMode === "standard" ? (
              <>
                <XPostPreview
                  roasterName="Alice"
                  receiverName="Bob"
                  message="Bob is very dumb, then these duncky."
                  amount={0.5}
                  currency="SOL"
                />

                <XPostPreview
                  roasterName="Charlie"
                  receiverName="Dave"
                  message="Your crypto portfolio is so bad, even LUNA investors feel sorry for you."
                  amount={1.2}
                  currency="SOL"
                />

                <XPostPreview
                  roasterName="Eve"
                  receiverName="Frank"
                  message="You HODL your opinions like you HODL your shitcoins - way past their expiration date."
                  amount={50}
                  currency="USDC"
                />
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sampleRoasts.map((roast, index) => (
                  <NFTRoastCard
                    key={roast.id}
                    roast={roast}
                    roasterName={roast.senderAddress}
                    roasteeName={roasteeNames[index]}
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
