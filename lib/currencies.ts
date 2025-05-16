import type { CryptoCurrency } from "@/types/roast"

export const currencies: CryptoCurrency[] = [
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    icon: "circle-dollar-sign",
    decimals: 9,
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    icon: "circle-dollar-sign",
    decimals: 6,
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    icon: "circle-dollar-sign",
    decimals: 6,
  },
  {
    id: "trump",
    name: "Trump Coin",
    symbol: "TRUMP",
    icon: "circle-dollar-sign",
    decimals: 8,
  },
  {
    id: "bonk",
    name: "Bonk",
    symbol: "BONK",
    icon: "circle-dollar-sign",
    decimals: 5,
  },
  {
    id: "wen",
    name: "Wen Token",
    symbol: "WEN",
    icon: "circle-dollar-sign",
    decimals: 6,
  },
]

export const getCurrencyById = (id: string): CryptoCurrency => {
  return currencies.find((currency) => currency.id === id) || currencies[0]
}

export const formatCryptoAmount = (amount: number, currency: string): string => {
  const currencyObj = getCurrencyById(currency)
  return `${amount} ${currencyObj.symbol}`
}
