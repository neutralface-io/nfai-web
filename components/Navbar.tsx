import Link from 'next/link'
import { WalletButton } from './WalletButton'

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Neutral Face
        </Link>
        <div className="min-w-[200px] flex justify-end">
          <WalletButton />
        </div>
      </div>
    </nav>
  )
} 