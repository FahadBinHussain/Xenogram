import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'
import { TrpcProvider } from '@/providers/TrpcProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Family Tree | Track Your Ancestry',
  description: 'A modern family tree application to document, visualize, and share your family history.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans h-full`}>
        <AuthProvider>
          <TrpcProvider>
            {children}
          </TrpcProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 