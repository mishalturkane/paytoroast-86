"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    name: "Alex",
    image: "/placeholder.svg?height=40&width=40",
    amount: 0.5,
    currency: "SOL",
    message: "You're so slow, even a Solana transaction is faster than you.",
  },
  {
    id: 2,
    name: "Jordan",
    image: "/placeholder.svg?height=40&width=40",
    amount: 75,
    currency: "USDC",
    message: "Your code has more bugs than a Bored Ape NFT has traits.",
  },
  {
    id: 3,
    name: "Taylor",
    image: "/placeholder.svg?height=40&width=40",
    amount: 1.2,
    currency: "SOL",
    message: "Your wallet is so empty, even Ethereum gas fees feel sorry for you.",
  },
  {
    id: 4,
    name: "Morgan",
    image: "/placeholder.svg?height=40&width=40",
    amount: 50,
    currency: "USDT",
    message: "You HODL your opinions like you HODL your shitcoins - way past their expiration date.",
  },
  {
    id: 5,
    name: "Casey",
    image: "/placeholder.svg?height=40&width=40",
    amount: 1000,
    currency: "BONK",
    message: "Your investment strategy is like a meme coin - briefly exciting but ultimately worthless.",
  },
]

export default function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  // Handle next slide
  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }

  // Handle previous slide
  const prevSlide = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, activeIndex])

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false)
  const handleMouseLeave = () => setAutoplay(true)

  return (
    <div className="relative w-full max-w-4xl mx-auto" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="w-full flex-shrink-0 border-2 border-orange-100 dark:border-gray-800">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Flame className="h-3 w-3 mr-1 text-orange-500" />
                      Paid {testimonial.amount} {testimonial.currency}
                    </p>
                  </div>
                </div>
                <blockquote className="text-lg italic">"{testimonial.message}"</blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur"
        onClick={prevSlide}
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur"
        onClick={nextSlide}
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === activeIndex ? "bg-primary" : "bg-muted-foreground/30",
            )}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
