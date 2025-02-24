import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Neutral Face
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A decentralized marketplace for datasets, powered by Solana. 
          Share, discover, and collaborate on datasets with the community.
        </p>
        <Link href="/datasets">
          <Button size="lg">
            Browse Datasets
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
