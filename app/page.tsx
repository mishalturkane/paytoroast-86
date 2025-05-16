import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Flame, TrendingUp, Clock, DollarSign } from "lucide-react"
import TestimonialsCarousel from "@/components/testimonials-carousel"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="py-12 md:py-20 lg:py-32 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="relative inline-flex items-center mb-4">
              <div className="text-sm font-medium px-3 py-1 rounded-full border-2 border-green-500 border-dotted flex items-center gap-2">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                <span>Built on Solana</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Pay to Roast. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                  Get Paid to Be Roasted.
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                A Web3-based fun platform where users pay to roast someone. The person getting roasted can accept or
                reject the roast.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-1 rounded-md bg-[#F26119] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#F26119]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Create a Roast <Flame className="ml-1 h-4 w-4" />
              </Link>
              <Button asChild variant="outline" size="lg">
                <Link href="/feed">
                  View Roasts <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
            <p className="max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400">
              Simple, fun, and secure way to roast your friends and get paid for being roasted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
              <div className="rounded-full bg-orange-100 p-3 mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create a Roast</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Connect your wallet, write a roast, and set an amount to pay in your preferred crypto.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
              <div className="rounded-full bg-orange-100 p-3 mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Share the Link</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Send the generated link to the person you want to roast.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
              <div className="rounded-full bg-orange-100 p-3 mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Accept or Reject</h3>
              <p className="text-gray-500 dark:text-gray-400">
                They can accept the roast and get paid, or reject it and you get refunded.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Explore Roasts</h2>
            <p className="max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400">
              Discover different categories of roasts on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/feed?tab=trending">
              <Card className="h-full hover:border-primary hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Trending Roasts</h3>
                  <p className="text-muted-foreground">
                    See the most popular and engaging roasts that are getting attention
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/feed?tab=recent">
              <Card className="h-full hover:border-primary hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-4">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Recent Roasts</h3>
                  <p className="text-muted-foreground">Check out the newest accepted roasts on the platform</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/feed?tab=highest-paid">
              <Card className="h-full hover:border-primary hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mb-4">
                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Highest Paid</h3>
                  <p className="text-muted-foreground">Discover the roasts with the biggest payments attached</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Roasts</h2>
            <p className="max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400">
              Check out some of the spiciest roasts on the platform
            </p>
          </div>

          <TestimonialsCarousel />
        </div>
      </section>
    </div>
  )
}
