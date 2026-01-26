import { Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ReactNode } from 'react'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} font-sans bg-gray-900 text-gray-100 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
