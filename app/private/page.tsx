import { cookies } from 'next/headers'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { BsCloudDownload } from 'react-icons/bs'
import { buildContractQuery } from '../../lib/api'
import { fetchRows, getUserInfo } from '../../lib/google'
import { AppSettings, Profile } from '../../types'

export type Row = {
  fecha: string
  nombre: string
  dni: string
  importe: string
  generado: string
  id: string
}

type ServerProps = {
  searchParams: {
    code: string
    scope: string
    authuser: string
    prompt: string
  }
}

const getSettings = async (
  token: string
): Promise<{ settings: AppSettings; profile: Profile }> => {
  const response = await fetch(`${process.env.NEXT_APP_HOST}/api/settings`, {
    headers: {
      Cookie: `access_token=${token}`,
    },
  })
  const settings = await response.json()

  return settings
}

export default async function HomePage() {
  const nextCookies = cookies()
  const token = nextCookies.get('access_token')

  if (!token) {
    redirect('/')
  }

  const rowsPromise = fetchRows(token.value)
  const settingsPromise = getSettings(token.value)

  const [rows, { settings, profile }] = await Promise.all([
    rowsPromise,
    settingsPromise,
  ])

  return (
    <div>
      <section className="flex w-full justify-center flex-col items-center">
        <Image
          className="rounded-full shadow-sm"
          width={80}
          height={80}
          src={profile.picture}
          alt="perfil"
        />
        <h2 className="font-bold">Hola {profile.name}</h2>
        <p>{JSON.stringify(settings)}</p>
      </section>

      <h2 className="font-bold">Clientes</h2>
      <ul>
        {rows.map((row) => (
          <li className="flex hover:bg-gray-800 p-1" key={row.id}>
            <h3 className="flex-1">{row.nombre}</h3>
            <a
              className="flex items-center gap-1 text-yellow-400"
              href={buildContractQuery(row, token.value)}
            >
              <span>Descargar contrato</span>
              <BsCloudDownload />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
