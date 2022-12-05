import { Rajdhani } from '@next/font/google'
import { BsSunFill } from 'react-icons/bs'
import '../styles/globals.css'

const sans = Rajdhani({
  variable: '--ff-sans',
  weight: ['400'],
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={sans.className}>
      <body>
        {children}
      </body>
    </html>
  )
}
