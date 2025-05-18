"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Flame, X, Check, Loader2, Twitter } from "lucide-react"
import { useSolanaWallet } from "@/hooks/use-solana-wallet"
import { useToast } from "@/components/ui/use-toast"
import { getRoastById } from "@/lib/roast-service"
import { formatCryptoAmount } from "@/lib/currencies"
import { type Roast, RoastStatus } from "@/types/roast"
import Link from "next/link"
import WalletButton from "@/components/wallet-button"
import XPostModal from "@/components/x-post-modal"
import { acceptRoast } from "@/app/actions/accept-roast"
import { rejectRoast } from "@/app/actions/reject-roast"

export default function RoastRequestPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { connected, publicKey } = useSolanaWallet()
  const { toast } = useToast()

  const [roast, setRoast] = useState<Roast | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [shareOnX, setShareOnX] = useState(false)
  const [xPostModalOpen, setXPostModalOpen] = useState(false)

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
      // Create a FormData object to pass to the server action
      const formData = new FormData()
      formData.append("roastId", roast.id)
      formData.append("receiverAddress", publicKey)
      formData.append("shareOnX", shareOnX.toString())

      // Call the server action
      const result = await acceptRoast(formData)

      if (result.success) {
        // Refresh the roast data
        const updatedRoast = getRoastById(roast.id)
        setRoast(updatedRoast)

        toast({
          title: "Roast Accepted",
          description: `You've received ${formatCryptoAmount(roast.amount, roast.currency)}!`,
        })

        // If user wants to share on X, open the modal
        if (shareOnX) {
          setXPostModalOpen(true)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to accept roast. Please try again.",
          variant: "destructive",
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

  const handleReject = async () => {
    if (!roast) return

    setProcessing(true)

    try {
      // Create a FormData object to pass to the server action
      const formData = new FormData()
      formData.append("roastId", roast.id)

      // Call the server action
      const result = await rejectRoast(formData)

      if (result.success) {
        // Refresh the roast data
        const updatedRoast = getRoastById(roast.id)
        setRoast(updatedRoast)

        toast({
          title: "Roast Rejected",
          description: "The roast has been rejected and funds returned to sender.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reject roast. Please try again.",
          variant: "destructive",
        })
      }
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

  const handleXPostComplete = () => {
    // Navigate to feed after posting to X
    router.push("/feed")
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

              {connected && (
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="share-on-x"
                    checked={shareOnX}
                    onCheckedChange={(checked) => setShareOnX(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="share-on-x" className="flex items-center gap-1.5">
                      <Twitter size={16} className="text-[#1DA1F2]" />
                      Share on X when accepted
                    </Label>
                    <p className="text-sm text-muted-foreground">Post this roast to X (Twitter) when you accept it</p>
                  </div>
                </div>
              )}
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

              {roast.status === RoastStatus.ACCEPTED && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-[#1DA1F2] border-[#1DA1F2] hover:bg-[#1DA1F2]/10"
                    onClick={() => setXPostModalOpen(true)}
                  >
                    <Twitter size={16} />
                    Share on X
                  </Button>
                </div>
              )}
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
            <Button
              className="w-full sm:w-auto gap-2 bg-[#F26119] hover:bg-[#F26119]/90"
              onClick={handleAccept}
              disabled={processing || !connected}
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Accept & Get Paid
            </Button>
          </CardFooter>
        )}
      </Card>

      <XPostModal
        open={xPostModalOpen}
        onOpenChange={setXPostModalOpen}
        roasterName={roast.senderAddress.slice(0, 6)}
        receiverName={publicKey.slice(0, 6)}
        message={roast.message}
        amount={roast.amount}
        currency={roast.currency}
        onComplete={handleXPostComplete}
      />
    </div>
  )
}
