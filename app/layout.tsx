import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { SolanaWalletProvider } from "@/components/solana-wallet-provider"
import { TwitterAuthProvider } from "@/components/twitter-auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PayToRoast.fun | Pay to Roast. Get Paid to Be Roasted.",
  description:
    "A Web3-based fun platform where users pay to roast someone. The person getting roasted can accept or reject the roast.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SolanaWalletProvider>
            <TwitterAuthProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </TwitterAuthProvider>
          </SolanaWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
