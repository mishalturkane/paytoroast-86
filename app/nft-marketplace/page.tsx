"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Flame, TrendingUp, DollarSign } from "lucide-react"
import NFTRoastCard from "@/components/nft-roast-card"
import { getRecentRoasts, getTrendingRoasts, getHighestPaidRoasts } from "@/lib/roast-service"

export default function NFTMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  // Get roasts based on the selected sort option
  const roasts = (() => {
    switch (sortBy) {
      case "trending":
        return getTrendingRoasts(12)
      case "price-high":
        return getHighestPaidRoasts(12)
      case "price-low":
        return getHighestPaidRoasts(12).reverse()
      case "recent":
      default:
        return getRecentRoasts(12)
    }
  })()

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">NFT Marketplace</h1>
            <p className="text-muted-foreground">Collect and trade unique roast NFTs</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search NFTs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All NFTs</TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="h-4 w-4 mr-1" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="new">
              <Flame className="h-4 w-4 mr-1" />
              New
            </TabsTrigger>
            <TabsTrigger value="premium">
              <DollarSign className="h-4 w-4 mr-1" />
              Premium
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {roasts.map((roast, index) => (
                <NFTRoastCard
                  key={roast.id}
                  roast={roast}
                  roasterName={`User ${roast.senderAddress.slice(0, 4)}`}
                  roasteeName={`User ${(Number.parseInt(roast.senderAddress.slice(0, 4), 16) + 1).toString(16).slice(0, 4)}`}
                  xPostLink={`https://x.com/paytoroast/status/${roast.id}`}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {getTrendingRoasts(6).map((roast, index) => (
                <NFTRoastCard
                  key={roast.id}
                  roast={roast}
                  roasterName={`User ${roast.senderAddress.slice(0, 4)}`}
                  roasteeName={`User ${(Number.parseInt(roast.senderAddress.slice(0, 4), 16) + 1).toString(16).slice(0, 4)}`}
                  xPostLink={`https://x.com/paytoroast/status/${roast.id}`}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {getRecentRoasts(6).map((roast, index) => (
                <NFTRoastCard
                  key={roast.id}
                  roast={roast}
                  roasterName={`User ${roast.senderAddress.slice(0, 4)}`}
                  roasteeName={`User ${(Number.parseInt(roast.senderAddress.slice(0, 4), 16) + 1).toString(16).slice(0, 4)}`}
                  xPostLink={`https://x.com/paytoroast/status/${roast.id}`}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="premium" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {getHighestPaidRoasts(6).map((roast, index) => (
                <NFTRoastCard
                  key={roast.id}
                  roast={roast}
                  roasterName={`User ${roast.senderAddress.slice(0, 4)}`}
                  roasteeName={`User ${(Number.parseInt(roast.senderAddress.slice(0, 4), 16) + 1).toString(16).slice(0, 4)}`}
                  xPostLink={`https://x.com/paytoroast/status/${roast.id}`}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>About NFT Roasts</CardTitle>
            <CardDescription>Learn more about our unique NFT collection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Each roast on PayToRoast.fun can be minted as a unique NFT on the Solana blockchain. These NFTs capture
              the essence of the roast, including the message, transaction amount, and a unique visual representation.
            </p>
            <p>
              When you purchase a Roast NFT, you're not just collecting digital art - you're owning a piece of
              blockchain history that represents a real transaction between two parties.
            </p>
            <p>NFT owners receive special benefits including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Royalties from future sales of your NFT</li>
              <li>Exclusive access to premium roasting features</li>
              <li>Voting rights on platform development</li>
              <li>Special profile badges and recognition</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
