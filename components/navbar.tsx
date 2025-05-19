"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Twitter, Sparkles } from "lucide-react"
import WalletButton from "@/components/wallet-button"
import WalletBalance from "@/components/wallet-balance"
import TwitterLoginButton from "@/components/twitter-login-button"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              PayToRoast.fun
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 mr-auto">
          <Link href="/feed" className="text-sm font-medium hover:text-primary">
            Feed
          </Link>
          <Link href="/docs" className="text-sm font-medium hover:text-primary">
            Docs
          </Link>
          <Link href="/x-posts" className="text-sm font-medium hover:text-primary flex items-center gap-1">
            <Twitter size={16} className="text-[#1DA1F2]" />X Posts
          </Link>
          <Link href="/nft-marketplace" className="text-sm font-medium hover:text-primary flex items-center gap-1">
            <Sparkles size={16} className="text-yellow-500" />
            NFT Market
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/create"
            className="text-sm font-medium bg-[#F26119] text-white px-4 py-2 rounded-md hover:bg-[#F26119]/90 transition-colors"
          >
            Create Roast
          </Link>
          <WalletBalance />
          <TwitterLoginButton />
          <WalletButton />
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={toggleMenu} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 pb-6 border-b">
          <nav className="flex flex-col space-y-4">
            <Link href="/feed" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Feed
            </Link>
            <Link href="/docs" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Docs
            </Link>
            <Link
              href="/x-posts"
              className="text-sm font-medium hover:text-primary flex items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <Twitter size={16} className="text-[#1DA1F2]" />X Posts
            </Link>
            <Link
              href="/nft-marketplace"
              className="text-sm font-medium hover:text-primary flex items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <Sparkles size={16} className="text-yellow-500" />
              NFT Market
            </Link>
            <Link
              href="/create"
              className="text-sm font-medium bg-[#F26119] text-white px-4 py-2 rounded-md hover:bg-[#F26119]/90 transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Roast
            </Link>
            <div className="flex flex-col gap-2">
              <TwitterLoginButton />
              <WalletButton />
              <WalletBalance />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
