// Define the NFT type
export interface NFT {
  id: string
  roastId: string
  ownerAddress: string
  price: number
  purchaseDate: string
  tokenId?: string
  transactionId: string
}

// Get all NFTs
export const getNFTs = (): NFT[] => {
  if (typeof window === "undefined") return []

  const nftsJson = localStorage.getItem("nfts")
  return nftsJson ? JSON.parse(nftsJson) : []
}

// Get NFTs by owner
export const getNFTsByOwner = (ownerAddress: string): NFT[] => {
  const nfts = getNFTs()
  return nfts.filter((nft) => nft.ownerAddress === ownerAddress)
}

// Get NFT by ID
export const getNFTById = (id: string): NFT | null => {
  const nfts = getNFTs()
  return nfts.find((nft) => nft.id === id) || null
}

// Get NFT by roast ID
export const getNFTByRoastId = (roastId: string): NFT | null => {
  const nfts = getNFTs()
  return nfts.find((nft) => nft.roastId === roastId) || null
}

// Create a new NFT
export const createNFT = (roastId: string, ownerAddress: string, price: number, transactionId: string): NFT => {
  const id = `nft_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`
  const tokenId = `token_${Math.floor(Math.random() * 1000000)}`

  const nft: NFT = {
    id,
    roastId,
    ownerAddress,
    price,
    purchaseDate: new Date().toISOString(),
    tokenId,
    transactionId,
  }

  // Save to localStorage
  const nfts = getNFTs()
  localStorage.setItem("nfts", JSON.stringify([...nfts, nft]))

  return nft
}

// Check if a roast has been minted as an NFT
export const isRoastMinted = (roastId: string): boolean => {
  return getNFTByRoastId(roastId) !== null
}

// Get trending NFTs
export const getTrendingNFTs = (limit = 10): NFT[] => {
  const nfts = getNFTs()
  // For demo purposes, we'll just return the most recently created NFTs
  return nfts.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()).slice(0, limit)
}

// Get NFTs by price range
export const getNFTsByPriceRange = (minPrice: number, maxPrice: number): NFT[] => {
  const nfts = getNFTs()
  return nfts.filter((nft) => nft.price >= minPrice && nft.price <= maxPrice)
}
