import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div 
        className="relative py-12"
        style={{
          backgroundImage: 'url(/dotted-face_tiled.jpg)',
          backgroundRepeat: 'repeat',
          backgroundSize: '500px',
          backgroundPosition: 'center'
        }}
      >
        {/* Lighter overlay to show more of the background */}
        <div className="absolute inset-0 bg-white/75" />
        
        {/* Content */}
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo-neutral-face.png"
                alt="Neutral Face"
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Neutral Face
              </span>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link 
                href="/about" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <Link 
                href="/privacy" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
} 