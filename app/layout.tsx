import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/providers/AuthProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UCP Santé - Gestion Véhicules',
  description: 'Application de gestion des demandes de véhicules UCP Santé',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}