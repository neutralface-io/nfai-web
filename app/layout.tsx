import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from '@/components/providers/WalletProvider'
import { Navbar } from '@/components/Navbar'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neutral Face - Dataset Marketplace",
  description: "A decentralized marketplace for datasets built on Solana",
  icons: {
    icon: '/logo-neutral-face.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SolanaWalletProvider>
          <Navbar />
          {children}
        </SolanaWalletProvider>
        <Toaster />
      </body>
    </html>
  );
}
