"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, X, Check, Loader2 } from "lucide-react"
import { useSolanaWallet } from "@/hooks/use-solana-wallet"
import { useToast } from "@/components/ui/use-toast"
import { getRoastById, updateRoastStatus } from "@/lib/roast-service"
import { formatCryptoAmount } from "@/lib/currencies"
import { type Roast, RoastStatus } from "@/types/roast"
import Link from "next/link"
import WalletButton from "@/components/wallet-button"

export default function RoastRequestPage() {
  const params = useParams()
  const id = params.id as string
  const { connected, publicKey, sendSol } = useSolanaWallet()
  const { toast } = useToast()

  const [roast, setRoast] = useState<Roast | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!id) return

    // Fetch the roast
    const fetchRoast = () => {
      try {
        const roastData = getRoastById(id)
        setRoast(roastData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load roast. It may not exist.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRoast()
  }, [id, toast])

  const handleAccept = async () => {
    if (!roast || !connected) return

    setProcessing(true)

    try {
      // For demo purposes, we'll only handle SOL transactions for real
      // Other currencies would be simulated
      let txId = ""

      if (roast.currency === "sol") {
        // Send actual SOL transaction
        txId = await sendSol(roast.amount, roast.senderAddress)
      } else {
        // Simulate transaction for other currencies
        await new Promise((resolve) => setTimeout(resolve, 1000))
        txId = "tx" + Math.random().toString(36).substring(2, 15)
      }

      if (txId) {
        // Update roast status
        const updatedRoast = updateRoastStatus(roast.id, RoastStatus.ACCEPTED, txId)
        setRoast(updatedRoast)

        toast({
          title: "Roast Accepted",
          description: `You've received ${formatCryptoAmount(roast.amount, roast.currency)}!`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept roast. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = () => {
    if (!roast) return

    setProcessing(true)

    try {
      // Update roast status
      const updatedRoast = updateRoastStatus(roast.id, RoastStatus.REJECTED)
      setRoast(updatedRoast)

      toast({
        title: "Roast Rejected",
        description: "The roast has been rejected and funds returned to sender.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject roast. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-2xl py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!roast) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Roast Not Found</CardTitle>
            <CardDescription>This roast doesn't exist or has been removed.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const formattedAmount = formatCryptoAmount(roast.amount, roast.currency)

  return (
    <div className="container max-w-2xl py-12">
      <Card className="border-2 border-orange-100 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            You've Been Roasted!
          </CardTitle>
          <CardDescription>Someone sent you a roast with {formattedAmount} attached.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {roast.status === RoastStatus.PENDING ? (
            <>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium text-center blur-sm hover:blur-none transition-all duration-300">
                  {roast.message}
                </p>
                <p className="text-xs text-center mt-2 text-muted-foreground">(Hover to preview)</p>
              </div>

              {!connected && (
                <div className="bg-orange-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-orange-800 dark:text-orange-300">
                    Connect your Solana wallet to accept or reject this roast.
                  </p>
                  <div className="mt-2">
                    <WalletButton />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Amount:</p>
                  <p className="text-lg font-bold">{formattedAmount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">From:</p>
                  <p className="text-sm font-mono">
                    {roast.senderAddress.slice(0, 6)}...{roast.senderAddress.slice(-4)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{roast.message}</p>
              </div>

              <div className="p-4 rounded-lg bg-orange-50 dark:bg-gray-800">
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  {roast.status === RoastStatus.ACCEPTED
                    ? `You accepted this roast and received ${formattedAmount}.`
                    : "You rejected this roast. The funds have been returned to the sender."}
                </p>
              </div>
            </>
          )}
        </CardContent>

        {roast.status === RoastStatus.PENDING && (
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto gap-2"
              onClick={handleReject}
              disabled={processing || !connected}
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
              Reject
            </Button>
            <Button className="w-full sm:w-auto gap-2" onClick={handleAccept} disabled={processing || !connected}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Accept & Get Paid
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
