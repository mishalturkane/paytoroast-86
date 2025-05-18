"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Twitter, LogOut, Loader2 } from "lucide-react"
import { useTwitterAuth } from "@/components/twitter-auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TwitterLoginButton() {
  const { isConnected, user, login, logout } = useTwitterAuth()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async () => {
    setIsLoggingIn(true)
    try {
      await login()
    } finally {
      setIsLoggingIn(false)
    }
  }

  if (!mounted) {
    return null
  }

  if (isConnected && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.profileImageUrl || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">@{user.username}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect Twitter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 text-[#1DA1F2] border-[#1DA1F2]"
      onClick={handleLogin}
      disabled={isLoggingIn}
    >
      {isLoggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <Twitter className="h-4 w-4" />}
      <span>{isLoggingIn ? "Connecting..." : "Connect Twitter"}</span>
    </Button>
  )
}
