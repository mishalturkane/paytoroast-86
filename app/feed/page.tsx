"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, TrendingUp, Clock, DollarSign, Loader2 } from "lucide-react"
import { getRecentRoasts, getTrendingRoasts, getHighestPaidRoasts, generateSampleRoasts } from "@/lib/roast-service"
import RoastCard from "@/components/roast-card"
import type { Roast, FeedCategory } from "@/types/roast"
import Link from "next/link"

export default function FeedPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams.get("tab") as FeedCategory | null
  const [activeTab, setActiveTab] = useState<FeedCategory>(tabParam || "trending")
  const [roasts, setRoasts] = useState<Roast[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate sample roasts for demo
    generateSampleRoasts()

    // Set active tab from URL if present
    if (tabParam && (tabParam === "trending" || tabParam === "recent" || tabParam === "highest-paid")) {
      setActiveTab(tabParam)
    }

    // Fetch roasts based on active tab
    fetchRoasts(activeTab)
  }, [activeTab, tabParam])

  const fetchRoasts = (category: FeedCategory) => {
    setLoading(true)

    try {
      let fetchedRoasts: Roast[] = []

      switch (category) {
        case "trending":
          fetchedRoasts = getTrendingRoasts()
          break
        case "recent":
          fetchedRoasts = getRecentRoasts()
          break
        case "highest-paid":
          fetchedRoasts = getHighestPaidRoasts()
          break
        default:
          fetchedRoasts = getTrendingRoasts()
      }

      setRoasts(fetchedRoasts)
    } catch (error) {
      console.error("Failed to fetch roasts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    const category = value as FeedCategory
    setActiveTab(category)
    router.push(`/feed?tab=${category}`)
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Roast Feed</h1>
            <p className="text-muted-foreground">Check out the hottest roasts on the platform</p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-1 rounded-md bg-[#F26119] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#F26119]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <Flame className="mr-2 h-4 w-4" />
            Create Roast
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Recent</span>
            </TabsTrigger>
            <TabsTrigger value="highest-paid" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Highest Paid</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending">{renderRoastList(roasts, loading, "trending")}</TabsContent>

          <TabsContent value="recent">{renderRoastList(roasts, loading, "recent")}</TabsContent>

          <TabsContent value="highest-paid">{renderRoastList(roasts, loading, "highest-paid")}</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function renderRoastList(roasts: Roast[], loading: boolean, category: FeedCategory) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading roasts...</p>
        </div>
      </div>
    )
  }

  if (roasts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Roasts Yet</CardTitle>
          <CardDescription>Be the first to create a roast that gets accepted!</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-1 rounded-md bg-[#F26119] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#F26119]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <Flame className="mr-2 h-4 w-4" />
            Create First Roast
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {roasts.map((roast) => (
        <RoastCard
          key={roast.id}
          roast={roast}
          isTrending={category === "trending"}
          isHighestPaid={category === "highest-paid"}
        />
      ))}
    </div>
  )
}
