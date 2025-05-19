"use client"

import Link from "next/link"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flame, Copy, Check, Twitter } from "lucide-react"
import { useSolanaWallet } from "@/hooks/use-solana-wallet"
import { useTwitterAuth } from "@/components/twitter-auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { currencies } from "@/lib/currencies"
import WalletButton from "@/components/wallet-button"
import TwitterLoginButton from "@/components/twitter-login-button"
import { createRoast } from "@/app/actions/create-roast"

export default function CreateRoastPage() {
  const router = useRouter()
  const { connected, publicKey } = useSolanaWallet()
  const { isConnected: isTwitterConnected, user: twitterUser } = useTwitterAuth()
  const { toast } = useToast()

  const [message, setMessage] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("sol")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [roastId, setRoastId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [shareOnTwitter, setShareOnTwitter] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a roast",
        variant: "destructive",
      })
      return
    }

    if (!isTwitterConnected) {
      toast({
        title: "Twitter Not Connected",
        description: "Please connect your Twitter account to create a roast",
        variant: "destructive",
      })
      return
    }

    if (!message.trim()) {
      toast({
        title: "Missing Message",
        description: "Please enter a roast message",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create a FormData object to pass to the server action
      const formData = new FormData()
      formData.append("message", message)
      formData.append("amount", amount)
      formData.append("currency", currency)
      formData.append("senderAddress", publicKey)

      // Add Twitter info
      if (twitterUser) {
        formData.append("twitterUsername", twitterUser.username)
        formData.append("shareOnTwitter", shareOnTwitter.toString())
      }

      // Call the server action
      const result = await createRoast(formData)

      if (result.success && result.roastId) {
        setRoastId(result.roastId)
        toast({
          title: "Roast Created",
          description: "Your roast has been created successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create roast. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating roast:", error)
      toast({
        title: "Error",
        description: "Failed to create roast. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyLink = () => {
    if (!roastId) return

    const link = `${window.location.origin}/roast/${roastId}`
    navigator.clipboard.writeText(link)

    setCopied(true)
    toast({
      title: "Link Copied",
      description: "Roast link copied to clipboard",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const selectedCurrency = currencies.find((c) => c.id === currency) || currencies[0]

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Create a Roast</h1>

      {!roastId ? (
        <Card>
          <CardHeader>
            <CardTitle>New Roast</CardTitle>
            <CardDescription>
              Create a roast and share it with someone. They'll get paid if they accept it!
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Connection Requirements */}
              <div className="flex flex-col gap-4">
                {!connected && (
                  <div className="bg-orange-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-orange-800 dark:text-orange-300">
                      You need to connect your Solana wallet to create a roast.
                    </p>
                    <div className="mt-2">
                      <WalletButton />
                    </div>
                  </div>
                )}

                {!isTwitterConnected && (
                  <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      You need to connect your Twitter account to create a roast.
                    </p>
                    <div className="mt-2">
                      <TwitterLoginButton />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Roast Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your spiciest roast here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.1"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id}>
                          {currency.name} ({currency.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isTwitterConnected && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="shareOnTwitter"
                    checked={shareOnTwitter}
                    onChange={(e) => setShareOnTwitter(e.target.checked)}
                    className="rounded border-gray-300 text-[#1DA1F2] focus:ring-[#1DA1F2]"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="shareOnTwitter" className="flex items-center gap-1.5">
                      <Twitter size={16} className="text-[#1DA1F2]" />
                      Share on Twitter when created
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Post a tweet about your roast (without revealing the full message)
                    </p>
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                This is the amount the person will receive if they accept your roast.
              </p>
            </CardContent>
            <CardFooter>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-md bg-[#F26119] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#F26119]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                disabled={isSubmitting || !connected || !isTwitterConnected}
              >
                <Flame className="h-4 w-4" />
                {isSubmitting ? "Creating..." : "Create Roast"}
              </button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Roast Created!</CardTitle>
            <CardDescription>Share this link with the person you want to roast.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-mono text-sm break-all">{`${window.location.origin}/roast/${roastId}`}</p>
            </div>

            <div className="bg-orange-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-orange-800 dark:text-orange-300">
                The recipient will see your roast and can choose to accept or reject it. If they accept, they'll receive
                the {amount} {selectedCurrency.symbol} you offered.
              </p>
            </div>

            {shareOnTwitter && isTwitterConnected && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <Twitter size={16} className="text-[#1DA1F2]" />A tweet has been posted from your account about this
                  roast!
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="w-full sm:w-auto gap-2" onClick={handleCopyLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Link
              href="/feed"
              className="inline-flex items-center justify-center w-full sm:w-auto rounded-md bg-[#F26119] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#F26119]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              View Feed
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
