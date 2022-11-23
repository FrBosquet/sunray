import { Row } from '../../pages/api/rows'

import Image from 'next/image'
import { BsCloudDownload } from 'react-icons/bs'
import { fetchRows, getAuthToken, getUserInfo } from '../../lib/google'

const buildquery = (row: Row): string => {
  const params = new URLSearchParams({
    cliente: row.nombre,
    nif: row.dni,
    fecha: row.fecha,
    importe: row.importe,
  })

  return `http://localhost:3000/api/contract?${params.toString()}`
}

type ServerProps = {
  searchParams: {
    code: string
    scope: string
    authuser: string
    prompt: string
  }
}

export default async function HomePage({ searchParams }: ServerProps) {
  const token = await getAuthToken(searchParams.code)

  const rowsPromise = fetchRows(token)
  const userInfoPromise = getUserInfo(token)

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
              href={buildquery(row)}
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
