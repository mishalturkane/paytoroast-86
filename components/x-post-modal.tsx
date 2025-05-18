"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Twitter, Loader2 } from "lucide-react"
import XPostPreview from "@/components/x-post-preview"
import { useToast } from "@/components/ui/use-toast"
import { shareOnX } from "@/app/actions/share-on-x"

interface XPostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roasterName: string
  receiverName: string
  message: string
  amount: number
  currency: string
  onComplete: () => void
  roastId?: string
}

export default function XPostModal({
  open,
  onOpenChange,
  roasterName,
  receiverName,
  message,
  amount,
  currency,
  onComplete,
  roastId = "",
}: XPostModalProps) {
  const [isPosting, setIsPosting] = useState(false)
  const [includeRoastText, setIncludeRoastText] = useState(true)
  const { toast } = useToast()

  const handlePost = async () => {
    setIsPosting(true)

    try {
      // Create a FormData object to pass to the server action
      const formData = new FormData()
      formData.append("roastId", roastId)
      formData.append("roasterName", roasterName)
      formData.append("roasteeName", receiverName)
      formData.append("includeFullText", includeRoastText.toString())

      // Call the server action
      const result = await shareOnX(formData)

      if (result.success) {
        onOpenChange(false)

        toast({
          title: "Posted to X!",
          description: "Your roast has been shared on X (Twitter).",
        })

        onComplete()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to post to X. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post to X. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share on X (Twitter)</DialogTitle>
          <DialogDescription>Post this roast to X to let everyone know about the burn!</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="include-text"
              checked={includeRoastText}
              onCheckedChange={(checked) => setIncludeRoastText(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="include-text">Include full roast text</Label>
              <p className="text-sm text-muted-foreground">If unchecked, only a link to the roast will be shared</p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Preview:</h4>
            <XPostPreview
              roasterName={roasterName}
              receiverName={receiverName}
              message={includeRoastText ? message : "[Click to view roast]"}
              amount={amount}
              currency={currency}
              isPreview={true}
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePost} disabled={isPosting} className="bg-[#1DA1F2] hover:bg-[#1a94da] text-white">
            {isPosting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Twitter className="mr-2 h-4 w-4" />
                Post to X
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
