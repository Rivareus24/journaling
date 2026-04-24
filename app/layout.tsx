import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'journaling',
  description: 'Il tuo diario quotidiano',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
