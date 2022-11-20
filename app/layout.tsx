import { Rajdhani } from '@next/font/google'
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
        <header className="p-4 bg-gray-700">
          <h1 className="text-2xl">Sunray</h1>
        </header>
        <section className="container p-4 mx-auto">{children}</section>
      </body>
    </html>
  )
}
