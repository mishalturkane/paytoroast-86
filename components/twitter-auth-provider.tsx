"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

interface TwitterUser {
  id: string
  username: string
  name: string
  profileImageUrl: string
}

interface TwitterAuthContextType {
  isConnected: boolean
  user: TwitterUser | null
  login: () => Promise<void>
  logout: () => Promise<void>
}

const TwitterAuthContext = createContext<TwitterAuthContextType>({
  isConnected: false,
  user: null,
  login: async () => {},
  logout: async () => {},
})

export function TwitterAuthProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [user, setUser] = useState<TwitterUser | null>(null)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Check if user was previously logged in
    const storedUser = localStorage.getItem("twitter_user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsConnected(true)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("twitter_user")
      }
    }
  }, [])

  // Mock Twitter login
  const login = async () => {
    if (mounted) {
      try {
        // Simulate a popup window for Twitter OAuth
        toast({
          title: "Connecting to Twitter...",
          description: "Please wait while we connect to your Twitter account.",
        })

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Generate a random Twitter user
        const randomId = Math.random().toString(36).substring(2, 10)
        const randomUser: TwitterUser = {
          id: randomId,
          username: `user${randomId.substring(0, 4)}`,
          name: `Twitter User ${randomId.substring(0, 2).toUpperCase()}`,
          profileImageUrl: `/placeholder.svg?height=40&width=40&text=${randomId.substring(0, 2).toUpperCase()}`,
        }

        setUser(randomUser)
        setIsConnected(true)

        // Store user in localStorage for persistence
        localStorage.setItem("twitter_user", JSON.stringify(randomUser))

        toast({
          title: "Twitter Connected",
          description: `Connected as @${randomUser.username}`,
        })
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: error instanceof Error ? error.message : "Failed to connect Twitter account",
          variant: "destructive",
        })
      }
    }
  }

  // Logout
  const logout = async () => {
    try {
      setUser(null)
      setIsConnected(false)
      localStorage.removeItem("twitter_user")

      toast({
        title: "Twitter Disconnected",
        description: "Your Twitter account has been disconnected",
      })
    } catch (error) {
      toast({
        title: "Disconnect Failed",
        description: error instanceof Error ? error.message : "Failed to disconnect Twitter account",
        variant: "destructive",
      })
    }
  }

  return (
    <TwitterAuthContext.Provider
      value={{
        isConnected,
        user,
        login,
        logout,
      }}
    >
      {children}
    </TwitterAuthContext.Provider>
  )
}

export const useTwitterAuth = () => useContext(TwitterAuthContext)
