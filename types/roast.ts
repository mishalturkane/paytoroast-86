export enum RoastStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface Roast {
  id: string
  message: string
  amount: number
  currency: string
  senderAddress: string
  status: RoastStatus
  createdAt: string
  transactionId: string
  likes: number
  comments: number
  views: number
}

export interface CryptoCurrency {
  id: string
  name: string
  symbol: string
  icon: string
  decimals: number
}

export type FeedCategory = "trending" | "recent" | "highest-paid"
