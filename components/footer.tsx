import Link from "next/link"
import { Twitter, MessageCircle, ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          {/* Left Side */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <Link
                href="https://x.com/paytoroast"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
              >
                <Twitter size={18} />
                <span>@paytoroast</span>
              </Link>
              <Link
                href="https://t.me/paytoroast"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
              >
                <MessageCircle size={18} />
                <span>Telegram</span>
              </Link>
            </div>
            <p className="text-center md:text-left text-sm text-muted-foreground">Made with ❤️ by the PayToRoast team</p>
          </div>

          {/* Right Side */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-center md:text-right">
              <span>Backed by</span>
              <Link
                href="https://solana.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:text-primary"
              >
                Solana Foundation
              </Link>
              <span>&</span>
              <Link
                href="https://coindcx.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:text-primary"
              >
                CoinDCX
              </Link>
            </div>

            <div className="text-sm text-muted-foreground text-center md:text-right">
              Developed by{" "}
              <Link
                href="https://x.com/mishalturkane"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-primary inline-flex items-center gap-1"
              >
                Mishal Turkane
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
