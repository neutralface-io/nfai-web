import Link from 'next/link'
import { WalletButton } from './WalletButton'
import { SearchBar } from './SearchBar'

export function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8 flex-1">
          <a href="/" className="font-bold text-xl">
            DataDAO
          </a>
          <SearchBar />
        </div>
        <WalletButton />
      </div>
    </nav>
  )
} 