import XPostPreview from "@/components/x-post-preview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function XPostsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">X (Twitter) Posts</h1>
          <p className="text-muted-foreground mt-2">
            When roasts are accepted, they can be automatically shared on X (Twitter).
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent X Posts</CardTitle>
            <CardDescription>Check out the latest roasts that have been shared on X (Twitter).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <XPostPreview
              roasterName="Alice"
              receiverName="Bob"
              message="Bob is very dumb, then these duncky."
              amount={0.5}
              currency="SOL"
            />

            <XPostPreview
              roasterName="Charlie"
              receiverName="Dave"
              message="Your crypto portfolio is so bad, even LUNA investors feel sorry for you."
              amount={1.2}
              currency="SOL"
            />

            <XPostPreview
              roasterName="Eve"
              receiverName="Frank"
              message="You HODL your opinions like you HODL your shitcoins - way past their expiration date."
              amount={50}
              currency="USDC"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
