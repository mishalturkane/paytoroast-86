import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Shield, FileText, HelpCircle } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Documentation</h1>
        <p className="text-muted-foreground mb-8">Learn how PayToRoast.fun works</p>

        <Tabs defaultValue="how-it-works">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="how-it-works" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              <span className="hidden sm:inline">How It Works</span>
              <span className="sm:hidden">How</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Security</span>
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Terms of Use</span>
              <span className="sm:hidden">Terms</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">FAQ</span>
              <span className="sm:hidden">FAQ</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="how-it-works" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How PayToRoast.fun Works</CardTitle>
                <CardDescription>A step-by-step guide to using our platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">For Roasters</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Connect your Web3 wallet (Phantom, MetaMask, etc.)</li>
                    <li>Go to the "Create Roast" page</li>
                    <li>Write your roast message</li>
                    <li>Specify the amount you're willing to pay (in SOL)</li>
                    <li>Submit and get a unique link</li>
                    <li>Share the link with the person you want to roast</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">For Recipients</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Receive a roast link from someone</li>
                    <li>Connect your Web3 wallet</li>
                    <li>Preview the roast message</li>
                    <li>Choose to accept or reject the roast</li>
                    <li>If you accept, you'll receive the funds and the roast will be published</li>
                    <li>If you reject, the sender gets refunded and the roast remains private</li>
                  </ol>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> All transactions are processed on the Solana blockchain for fast, low-fee
                    transfers. The platform takes no commission on roasts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security & Trust</CardTitle>
                <CardDescription>How we keep your funds and data secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Blockchain Security</h3>
                  <p>
                    All transactions on PayToRoast.fun are processed directly on the Solana blockchain. We never take
                    custody of your funds at any point in the process.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Smart Contract</h3>
                  <p>
                    Our platform uses a transparent, audited smart contract that holds funds in escrow until the
                    recipient either accepts or rejects the roast.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Privacy</h3>
                  <p>
                    Roast messages are only published publicly if the recipient accepts them. Rejected roasts remain
                    private between the sender and recipient.
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Important:</strong> While we take security seriously, always exercise caution when
                    connecting your wallet to any dApp. Never share your private keys or seed phrases.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terms" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Terms of Use</CardTitle>
                <CardDescription>Guidelines for using PayToRoast.fun</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Content Guidelines</h3>
                  <p>While we encourage creative and humorous roasts, we prohibit content that is:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Threatening, harassing, or promoting violence</li>
                    <li>Discriminatory based on race, gender, religion, etc.</li>
                    <li>Containing personal information (doxxing)</li>
                    <li>Illegal or promoting illegal activities</li>
                    <li>Spam or commercial solicitation</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">User Responsibilities</h3>
                  <p>By using PayToRoast.fun, you agree to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use the platform for its intended purpose</li>
                    <li>Take responsibility for the content you create</li>
                    <li>Not attempt to manipulate or exploit the platform</li>
                    <li>Report any bugs or security vulnerabilities</li>
                  </ul>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> We reserve the right to remove content that violates these terms and to ban
                    users who repeatedly break the rules.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions about PayToRoast.fun</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">What cryptocurrencies can I use?</h3>
                  <p>
                    Currently, PayToRoast.fun supports SOL (Solana's native token) and USDC on the Solana blockchain. We
                    plan to add support for more tokens in the future.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">How long do recipients have to accept/reject?</h3>
                  <p>
                    Recipients have 7 days to accept or reject a roast. After that, the funds are automatically returned
                    to the sender.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Does PayToRoast.fun take a fee?</h3>
                  <p>
                    We take a small 2% fee on accepted roasts to maintain the platform. The remaining 98% goes directly
                    to the recipient.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Can I delete a roast after it's been accepted?</h3>
                  <p>
                    Once a roast has been accepted and published to the feed, it cannot be deleted. Make sure you're
                    comfortable with your roast being public before sending it.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">What wallets are supported?</h3>
                  <p>
                    We support most major Solana wallets, including Phantom, Solflare, and Sollet. We also support
                    MetaMask with the Solana plugin.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
