import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BiCog } from 'react-icons/bi'
import { BsNewspaper, BsSunFill } from 'react-icons/bs'
import { getSettings } from '../../lib/api'


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nextCookies = cookies()
  const token = nextCookies.get('access_token')

  if (!token) {
    redirect('/')
  }

  const { profile } = await getSettings(token?.value as string)

  return (
    <div>
      <header className="p-4 bg-gradient-to-t from-slate-900 to-slate-800 flex items-center gap-2 border-b border-white/25">
        <BsSunFill className="text-yellow-600" />
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-100 text-3xl font-extrabold uppercase tracking-widest">
          Sunray
        </h1>
        <p className='flex-1'>Software de gestión para <strong>AhoraSolar</strong></p>
        <Link href="/private">
          <BsNewspaper />
        </Link>
        <Link href="/private/settings">
          <BiCog />
        </Link>
        <section className="flex justify-center flex-col items-center">
          <Image
            className="rounded-full shadow-sm"
            width={40}
            height={40}
            src={profile.picture}
            alt="perfil"
          />
          <h2 className="font-bold text-xs">Hola {profile.name}</h2>
        </section>
      </header>
      <section className="container p-4 mx-auto">{children}</section>
    </div>
  )
}
