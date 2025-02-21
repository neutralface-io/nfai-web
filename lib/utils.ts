import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function getDisplayName(author?: { username: string | null; wallet_address: string }): string {
  if (!author) return 'Anonymous'
  return author.username || formatAddress(author.wallet_address)
}
