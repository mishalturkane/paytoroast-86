interface Window {
  phantom?: {
    solana?: {
      connect: () => Promise<{ publicKey: { toString: () => string } }>
      disconnect: () => Promise<void>
    }
  }
  solflare?: {
    connect: () => Promise<{ publicKey: { toString: () => string } }>
    disconnect: () => Promise<void>
  }
}
