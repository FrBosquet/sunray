import { cookies } from 'next/headers'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { BsCloudDownload } from 'react-icons/bs'
import { fetchRows, getUserInfo } from '../../lib/google'

const buildquery = (row: Row, token: string): string => {
  const params = new URLSearchParams({
    cliente: row.nombre,
    nif: row.dni,
    fecha: row.fecha,
    importe: row.importe,
    token,
  })

  return `/api/contract?${params.toString()}`
}

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

export default async function HomePage({ searchParams, ...rest }: ServerProps) {
  const nextCookies = cookies()
  const token = nextCookies.get('access_token')

  if (!token) {
    redirect('/')
  }

  const rowsPromise = fetchRows(token.value)
  const userInfoPromise = getUserInfo(token.value)

  const [rows, userInfo] = await Promise.all([rowsPromise, userInfoPromise])

  return (
    <div>
      <section className="flex w-full justify-center flex-col items-center">
        <Image
          className="rounded-full shadow-sm"
          width={80}
          height={80}
          src={userInfo.picture}
          alt="perfil"
        />
        <h2 className="font-bold">Hola {userInfo.name}</h2>
      </section>

      <h2 className="font-bold">Clientes</h2>
      <ul>
        {rows.map((row) => (
          <li className="flex hover:bg-gray-800 p-1" key={row.id}>
            <h3 className="flex-1">{row.nombre}</h3>
            <a
              className="flex items-center gap-1 text-yellow-400"
              href={buildquery(row, token.value)}
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
