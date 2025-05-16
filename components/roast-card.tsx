"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Flame, ThumbsUp, MessageSquare, TrendingUp, DollarSign, Eye } from "lucide-react"
import { formatCryptoAmount } from "@/lib/currencies"
import { updateRoastEngagement } from "@/lib/roast-service"
import { useState } from "react"
import type { Roast } from "@/types/roast"

interface RoastCardProps {
  roast: Roast
  isTrending?: boolean
  isHighestPaid?: boolean
}

export default function RoastCard({ roast, isTrending, isHighestPaid }: RoastCardProps) {
  const [likes, setLikes] = useState(roast.likes)
  const [comments, setComments] = useState(roast.comments)
  const [liked, setLiked] = useState(false)

  // Generate a random avatar for each roast
  const getAvatarUrl = (address: string) => {
    return `/placeholder.svg?height=40&width=40&text=${address.slice(0, 2)}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffDays > 0) {
      return `${diffDays}d ago`
    } else if (diffHours > 0) {
      return `${diffHours}h ago`
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`
    } else {
      return "Just now"
    }
  }

  const handleLike = () => {
    if (!liked) {
      updateRoastEngagement(roast.id, 1, 0)
      setLikes(likes + 1)
      setLiked(true)
    }
  }

  const handleComment = () => {
    // In a real app, this would open a comment form
    updateRoastEngagement(roast.id, 0, 1)
    setComments(comments + 1)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={getAvatarUrl(roast.senderAddress) || "/placeholder.svg"} alt="Avatar" />
            <AvatarFallback>{roast.senderAddress.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {roast.senderAddress.slice(0, 6)}...{roast.senderAddress.slice(-4)}
                </p>
                <p className="text-sm text-muted-foreground">{formatDate(roast.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                {isTrending && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  >
                    <TrendingUp className="h-3 w-3" />
                    <span>Trending</span>
                  </Badge>
                )}
                {isHighestPaid && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  >
                    <DollarSign className="h-3 w-3" />
                    <span>High Value</span>
                  </Badge>
                )}
                <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full text-sm">
                  <Flame className="h-3 w-3" />
                  <span>{formatCryptoAmount(roast.amount, roast.currency)}</span>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-lg">{roast.message}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1 ${liked ? "text-red-500" : ""}`}
                  onClick={handleLike}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-1" onClick={handleComment}>
                  <MessageSquare className="h-4 w-4" />
                  <span>{comments}</span>
                </Button>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Eye className="h-4 w-4 mr-1" />
                <span>{roast.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
