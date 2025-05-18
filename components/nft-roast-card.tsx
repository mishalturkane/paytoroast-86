"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  ShoppingCart,
  Flame,
  Sparkles,
  RotateCw,
  Twitter,
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  Eye,
} from "lucide-react"
import { motion } from "framer-motion"
import { formatCryptoAmount } from "@/lib/currencies"
import type { Roast } from "@/types/roast"
import Link from "next/link"
import { useSolanaWallet } from "@/hooks/use-solana-wallet"
import { mintNFT } from "@/app/actions/mint-nft"

// Update the NFTRoastCardProps interface to include roaster and roastee information
interface NFTRoastCardProps {
  roast: Roast
  className?: string
  roasterName?: string
  roasteeName?: string
  xPostLink?: string
}

// Update the component function signature to include the new props
export default function NFTRoastCard({
  roast,
  className = "",
  roasterName = "Anonymous",
  roasteeName = "Anonymous",
  xPostLink = "",
}: NFTRoastCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { connected, publicKey } = useSolanaWallet()

  // Calculate NFT price based on X post insights (likes, comments, views)
  // Higher engagement = higher price
  const basePrice = 0.1 // Base price in SOL
  const likesMultiplier = 0.01 // Each like adds 0.01 SOL
  const commentsMultiplier = 0.02 // Each comment adds 0.02 SOL
  const viewsMultiplier = 0.001 // Each view adds 0.001 SOL

  const calculatedPrice =
    basePrice + roast.likes * likesMultiplier + roast.comments * commentsMultiplier + roast.views * viewsMultiplier

  // Round to 2 decimal places and ensure minimum price of 0.1 SOL
  const nftPrice = Math.max(Math.round(calculatedPrice * 100) / 100, 0.1)

  // Generate a random number of available NFTs between 1 and 10
  const availableNFTs = useRef(Math.floor(Math.random() * 10) + 1).current

  // Generate a random background gradient
  const gradients = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-green-500 to-emerald-500",
    "from-indigo-500 to-purple-500",
    "from-yellow-500 to-orange-500",
  ]
  const gradient = useRef(gradients[Math.floor(Math.random() * gradients.length)]).current

  // Generate random emoji positions
  const emojis = ["🔥", "💯", "🤣", "😂", "👀", "💰", "🚀", "💸"]
  const emojiPositions = useRef(
    Array.from({ length: 5 }, () => ({
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 80 + 10, // 10% to 90%
      y: Math.random() * 80 + 10, // 10% to 90%
      scale: Math.random() * 0.5 + 1, // 1 to 1.5
      rotation: Math.random() * 30 - 15, // -15 to 15 degrees
    })),
  ).current

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isRotating) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  // Reset card rotation when mouse leaves
  const handleMouseLeave = () => {
    if (!cardRef.current || isRotating) return
    cardRef.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0)"
    setIsHovered(false)
  }

  // Handle NFT purchase
  const handlePurchase = async () => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to purchase this NFT",
        variant: "destructive",
      })
      return
    }

    setIsPurchasing(true)

    try {
      // Create a FormData object to pass to the server action
      const formData = new FormData()
      formData.append("roastId", roast.id)
      formData.append("buyerAddress", publicKey)
      formData.append("price", nftPrice.toString())

      // Call the server action
      const result = await mintNFT(formData)

      if (result.success) {
        toast({
          title: "NFT Purchased!",
          description: `You've successfully purchased the "${roast.message.substring(0, 20)}..." NFT for ${nftPrice} SOL.`,
        })
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error || "Failed to purchase NFT. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to purchase NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  // Handle card flip animation
  const handleFlip = () => {
    setIsRotating(true)
    setTimeout(() => setIsRotating(false), 1000)
  }

  // Update the card content to include roaster and roastee information
  return (
    <div className={`relative ${className}`}>
      <motion.div
        ref={cardRef}
        className="relative w-full h-full transition-all duration-200 ease-out transform-gpu"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={isRotating ? { rotateY: [0, 180, 360] } : {}}
        transition={isRotating ? { duration: 1, ease: "easeInOut" } : {}}
      >
        <Card
          className={`overflow-hidden border-2 ${
            isHovered ? "border-primary shadow-lg" : "border-gray-200"
          } transition-all duration-300`}
        >
          {/* NFT Card Header with Gradient */}
          <div className={`h-32 bg-gradient-to-r ${gradient} relative overflow-hidden`}>
            {/* 3D Emojis */}
            {emojiPositions.map((emojiData, index) => (
              <motion.div
                key={index}
                className="absolute text-3xl"
                style={{
                  left: `${emojiData.x}%`,
                  top: `${emojiData.y}%`,
                }}
                animate={
                  isHovered
                    ? {
                        y: [0, -10, 0],
                        scale: [emojiData.scale, emojiData.scale * 1.2, emojiData.scale],
                        rotate: [emojiData.rotation, emojiData.rotation + 10, emojiData.rotation],
                      }
                    : {}
                }
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              >
                {emojiData.emoji}
              </motion.div>
            ))}

            {/* NFT Badge */}
            <Badge className="absolute top-2 right-2 bg-black/70 text-white border-none" variant="outline">
              NFT #{Math.floor(Math.random() * 10000)}
            </Badge>

            {/* Rotate Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute bottom-2 right-2 bg-white/20 hover:bg-white/40 text-white rounded-full h-8 w-8"
              onClick={handleFlip}
            >
              <RotateCw size={14} />
            </Button>
          </div>

          {/* NFT Card Content */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  Epic Roast
                </h3>
                <p className="text-sm text-muted-foreground">{new Date(roast.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                  {formatCryptoAmount(roast.amount, roast.currency)}
                </Badge>
              </div>
            </div>

            {/* Roaster and Roastee Information */}
            <div className="flex justify-between text-sm mb-3">
              <div>
                <span className="font-medium text-muted-foreground">From:</span>{" "}
                <span className="font-semibold">{roasterName}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">To:</span>{" "}
                <span className="font-semibold">{roasteeName}</span>
              </div>
            </div>

            {/* Roast Message */}
            <div className="bg-muted p-3 rounded-md mb-4 relative">
              <p className="italic font-medium">"{roast.message}"</p>
              <Sparkles className="absolute -bottom-2 -right-2 text-yellow-500" size={16} />
            </div>

            {/* X Post Link */}
            {xPostLink && (
              <div className="mb-4">
                <Link
                  href={xPostLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#1DA1F2] hover:underline"
                >
                  <Twitter size={16} />
                  <span>View on X (Twitter)</span>
                  <ExternalLink size={12} />
                </Link>
              </div>
            )}

            {/* X Post Insights */}
            <div className="flex justify-between items-center mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsUp size={14} />
                  <span>{roast.likes}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare size={14} />
                  <span>{roast.comments}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye size={14} />
                  <span>{roast.views}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Engagement affects price</div>
            </div>

            {/* NFT Purchase Info */}
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-sm font-medium">Price</p>
                <p className="text-lg font-bold">{nftPrice} SOL</p>
              </div>
              <div>
                <p className="text-sm text-right text-muted-foreground">Available</p>
                <p className="text-sm font-medium text-right">{availableNFTs} of 10</p>
              </div>
            </div>

            {/* Purchase Button */}
            <Button
              className="w-full mt-3 bg-[#F26119] hover:bg-[#F26119]/90"
              onClick={handlePurchase}
              disabled={isPurchasing || !connected}
            >
              {isPurchasing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2"
                  >
                    <RotateCw size={16} />
                  </motion.div>
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy NFT
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
