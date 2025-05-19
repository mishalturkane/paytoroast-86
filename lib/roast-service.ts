// This is a mock service that would normally interact with a blockchain or database
// For demo purposes, we'll use localStorage to persist data

import { type Roast, RoastStatus } from "@/types/roast"

// Generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Create a new roast
export const createRoast = (message: string, amount: number, currency: string, senderAddress: string): Roast => {
  const id = generateId()
  const roast: Roast = {
    id,
    message,
    amount,
    currency,
    senderAddress,
    status: RoastStatus.PENDING,
    createdAt: new Date().toISOString(),
    transactionId: "",
    likes: 0,
    comments: 0,
    views: Math.floor(Math.random() * 100) + 10, // Random views for demo
  }

  // Save to localStorage
  const roasts = getRoasts()

  // Check if localStorage is available (client-side)
  if (typeof window !== "undefined") {
    localStorage.setItem("roasts", JSON.stringify([...roasts, roast]))
  }

  return roast
}

// Get all roasts
export const getRoasts = (): Roast[] => {
  if (typeof window === "undefined") return []

  const roastsJson = localStorage.getItem("roasts")
  return roastsJson ? JSON.parse(roastsJson) : []
}

// Get a roast by ID
export const getRoastById = (id: string): Roast | null => {
  const roasts = getRoasts()
  return roasts.find((roast) => roast.id === id) || null
}

// Update a roast status
export const updateRoastStatus = (id: string, status: RoastStatus, transactionId = ""): Roast | null => {
  const roasts = getRoasts()
  const index = roasts.findIndex((roast) => roast.id === id)

  if (index === -1) return null

  const updatedRoast = {
    ...roasts[index],
    status,
    transactionId: transactionId || roasts[index].transactionId,
  }

  roasts[index] = updatedRoast

  if (typeof window !== "undefined") {
    localStorage.setItem("roasts", JSON.stringify(roasts))
  }

  return updatedRoast
}

// Update roast engagement (likes, comments)
export const updateRoastEngagement = (id: string, likes = 0, comments = 0): Roast | null => {
  const roasts = getRoasts()
  const index = roasts.findIndex((roast) => roast.id === id)

  if (index === -1) return null

  const updatedRoast = {
    ...roasts[index],
    likes: roasts[index].likes + likes,
    comments: roasts[index].comments + comments,
    views: roasts[index].views + 1,
  }

  roasts[index] = updatedRoast

  if (typeof window !== "undefined") {
    localStorage.setItem("roasts", JSON.stringify(roasts))
  }

  return updatedRoast
}

// Get accepted roasts
export const getAcceptedRoasts = (): Roast[] => {
  const roasts = getRoasts()
  return roasts.filter((roast) => roast.status === RoastStatus.ACCEPTED)
}

// Get recent roasts (newest first)
export const getRecentRoasts = (limit = 10): Roast[] => {
  const roasts = getAcceptedRoasts()
  return roasts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit)
}

// Get trending roasts (most engagement)
export const getTrendingRoasts = (limit = 10): Roast[] => {
  const roasts = getAcceptedRoasts()
  return roasts
    .sort((a, b) => {
      // Calculate engagement score (likes + comments * 2 + views * 0.1)
      const scoreA = a.likes + a.comments * 2 + a.views * 0.1
      const scoreB = b.likes + b.comments * 2 + b.views * 0.1
      return scoreB - scoreA
    })
    .slice(0, limit)
}

// Get highest paid roasts
export const getHighestPaidRoasts = (limit = 10): Roast[] => {
  const roasts = getAcceptedRoasts()

  // For simplicity, we're just sorting by amount without considering currency
  // In a real app, you'd convert all to a common currency first
  return roasts.sort((a, b) => b.amount - a.amount).slice(0, limit)
}

// Generate sample roasts for demo purposes
export const generateSampleRoasts = () => {
  if (typeof window === "undefined") return

  // Check if we already have roasts
  const existingRoasts = getRoasts()
  if (existingRoasts.length > 0) return

  const sampleRoasts: Omit<Roast, "id">[] = [
    {
      message: "Your crypto portfolio is so bad, even LUNA investors feel sorry for you.",
      amount: 0.75,
      currency: "sol",
      senderAddress: "sol1a2b3c4d",
      status: RoastStatus.ACCEPTED,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      transactionId: "tx123",
      likes: 24,
      comments: 5,
      views: 142,
    },
    {
      message: "You HODL your opinions like you HODL your shitcoins - way past their expiration date.",
      amount: 50,
      currency: "usdc",
      senderAddress: "sol2b3c4d5e",
      status: RoastStatus.ACCEPTED,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      transactionId: "tx456",
      likes: 18,
      comments: 3,
      views: 89,
    },
    {
      message: "Your trading strategy is so bad, even a random number generator outperforms you.",
      amount: 1.2,
      currency: "sol",
      senderAddress: "sol3c4d5e6f",
      status: RoastStatus.ACCEPTED,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      transactionId: "tx789",
      likes: 42,
      comments: 7,
      views: 231,
    },
    {
      message: "You're so slow to adopt new tech, you're still waiting for Ethereum 2.0.",
      amount: 0.5,
      currency: "sol",
      senderAddress: "sol4d5e6f7g",
      status: RoastStatus.ACCEPTED,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      transactionId: "tx101",
      likes: 15,
      comments: 2,
      views: 78,
    },
    {
      message: "Your wallet is so empty, even Ethereum gas fees feel sorry for you.",
      amount: 100,
      currency: "usdt",
      senderAddress: "sol5e6f7g8h",
      status: RoastStatus.ACCEPTED,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
      transactionId: "tx112",
      likes: 56,
      comments: 11,
      views: 320,
    },
    {
      message: "You have so many failed transactions, Solana's outages are more reliable than you.",
      amount: 2.5,
      currency: "sol",
      senderAddress: "sol6f7g8h9i",
      status: RoastStatus.ACCEPTED,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      transactionId: "tx131",
      likes: 38,
      comments: 6,
      views: 175,
    },
    {
      message: "Your NFT collection is so worthless, even right-clickers don't want it.",
      amount: 1000,
      currency: "bonk",
      senderAddress: "sol7g8h9i0j",
      status: RoastStatus.ACCEPTED,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
      transactionId: "tx415",
      likes: 29,
      comments: 4,
      views: 132,
    },
    {
      message: "You're so bad at picking winners, you'd lose money in a bull market.",
      amount: 5,
      currency: "sol",
      senderAddress: "sol8h9i0j1k",
      status: RoastStatus.ACCEPTED,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
      transactionId: "tx161",
      likes: 47,
      comments: 9,
      views: 267,
    },
    {
      message: "Your seed phrase is probably 'password123' repeated four times.",
      amount: 200,
      currency: "usdc",
      senderAddress: "sol9i0j1k2l",
      status: RoastStatus.ACCEPTED,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
      transactionId: "tx718",
      likes: 33,
      comments: 5,
      views: 154,
    },
    {
      message: "You're so gullible, you'd send your crypto to a Nigerian prince.",
      amount: 10000,
      currency: "trump",
      senderAddress: "sol0j1k2l3m",
      status: RoastStatus.ACCEPTED,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), // 6 days ago
      transactionId: "tx192",
      likes: 61,
      comments: 13,
      views: 345,
    },
  ]

  // Add sample roasts to localStorage
  const roasts = sampleRoasts.map((roast) => ({
    ...roast,
    id: generateId(),
  }))

  localStorage.setItem("roasts", JSON.stringify(roasts))
}
