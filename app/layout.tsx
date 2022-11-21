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
        <header className="p-4 bg-gray-700 flex items-center gap-2">
          <BsSunFill className="text-yellow-600" />
          <h1 className="text-yellow-600 text-3xl font-extrabold uppercase tracking-wide">
            Sunray
          </h1>
          <p>Software de gestión para ahorasolar</p>
        </header>
        <section className="container p-4 mx-auto">{children}</section>
      </body>
    </html>
  )
}
