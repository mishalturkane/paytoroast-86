import type { Chain } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"

export class PhantomConnector extends InjectedConnector {
  readonly id = "phantom"
  readonly name = "Phantom"
  readonly ready = typeof window !== "undefined" && !!window.phantom

  constructor(config: { chains?: Chain[] }) {
    super({
      chains: config.chains,
      options: {
        name: "Phantom",
        getProvider: () => {
          if (typeof window === "undefined") return
          return window.phantom?.solana
        },
      },
    })
  }

  async connect() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new Error("Phantom provider not found")

      // Connect to Phantom
      const response = await provider.connect()
      const account = response.publicKey.toString()

      return {
        account,
        chain: { id: 1, unsupported: false }, // Using chain ID 1 as placeholder
        provider,
      }
    } catch (error) {
      throw error
    }
  }

  async getAccount() {
    const provider = await this.getProvider()
    if (!provider) throw new Error("Phantom provider not found")

    try {
      // Check if already connected
      const response = await provider.connect()
      return response.publicKey.toString()
    } catch (error) {
      throw error
    }
  }

  async isAuthorized() {
    try {
      const provider = await this.getProvider()
      if (!provider) return false

      // Check if connected
      const resp = await provider.connect({ onlyIfTrusted: true })
      return !!resp
    } catch {
      return false
    }
  }
}

// Add Phantom to the window object type
declare global {
  interface Window {
    phantom?: {
      solana?: {
        connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{
          publicKey: { toString: () => string }
        }>
        disconnect: () => Promise<void>
      }
    }
  }
}
