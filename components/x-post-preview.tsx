"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Repeat, Share, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface XPostPreviewProps {
  roasterName: string
  receiverName: string
  message: string
  amount: number
  currency: string
  isPreview?: boolean
}

export default function XPostPreview({
  roasterName,
  receiverName,
  message,
  amount,
  currency,
  isPreview = false,
}: XPostPreviewProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 20) + 5)
  const [retweetCount] = useState(Math.floor(Math.random() * 10) + 2)
  const [replyCount] = useState(Math.floor(Math.random() * 15) + 3)

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  // Generate avatar URL based on name
  const getAvatarUrl = (name: string) => {
    return `/placeholder.svg?height=40&width=40&text=${name.slice(0, 2).toUpperCase()}`
  }

  return (
    <Card className={`border ${isPreview ? "border-dashed border-gray-300" : "border-gray-200"} max-w-lg mx-auto`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Avatar>
              <AvatarImage src={getAvatarUrl(roasterName) || "/placeholder.svg"} alt={roasterName} />
              <AvatarFallback>{roasterName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <p className="font-bold text-sm truncate">PayToRoast</p>
                <p className="text-muted-foreground text-sm">@paytoroast</p>
                <span className="text-muted-foreground text-sm">·</span>
                <p className="text-muted-foreground text-sm">{formatDistanceToNow(new Date(), { addSuffix: true })}</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <p className="mt-1 text-sm">
              🔥 <span className="font-semibold">{roasterName}</span> just roasted{" "}
              <span className="font-semibold">{receiverName}</span> for {amount} {currency.toUpperCase()}!
            </p>
            <p className="mt-2 text-sm">"{message}"</p>
            <p className="mt-2 text-sm text-[#F26119]">#PayToRoast #Solana #Web3Roast</p>

            <div className="flex items-center justify-between mt-3 text-muted-foreground">
              <button className="flex items-center gap-1 text-xs hover:text-blue-500">
                <MessageCircle size={16} />
                <span>{replyCount}</span>
              </button>
              <button className="flex items-center gap-1 text-xs hover:text-green-500">
                <Repeat size={16} />
                <span>{retweetCount}</span>
              </button>
              <button
                className={`flex items-center gap-1 text-xs ${liked ? "text-red-500" : "hover:text-red-500"}`}
                onClick={handleLike}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
                <span>{likeCount}</span>
              </button>
              <button className="flex items-center gap-1 text-xs hover:text-blue-500">
                <Share size={16} />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
