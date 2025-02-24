'use client'

import Link from 'next/link'
import Image from 'next/image'
import { WalletButton } from './WalletButton'
import { SearchBar } from './SearchBar'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/datasets',
      label: 'Datasets'
    },
    {
      href: '/collections',
      label: 'Collections'
    }
  ]

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8 flex-1">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-neutral-face.png"
              alt="Neutral Face"
              width={32}
              height={32}
              className="rounded-full"
              priority
            />
            <span className="font-bold text-xl">Neutral Face</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <SearchBar />
        </div>
        <WalletButton />
      </div>
    </nav>
  )
} 