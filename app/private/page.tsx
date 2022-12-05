import { cookies } from 'next/headers'
import { BsCloudDownload } from 'react-icons/bs'
import { buildContractQuery } from '../../lib/api'
import { fetchRows } from '../../lib/google'

export type Row = {
  fecha: string
  nombre: string
  dni: string
  importe: string
  generado: string
  id: string
}

export default async function HomePage() {
  const nextCookies = cookies()
  const token = nextCookies.get('access_token')

  const rows = await fetchRows(token?.value as string)

  return (
    <div >
      <h2 className="font-bold">Clientes</h2>
      <ul>
        {rows.map((row) => (
          <li className="flex hover:bg-gray-800 p-1" key={row.id}>
            <h3 className="flex-1">{row.nombre}</h3>
            <a
              className="flex items-center gap-1 text-yellow-400"
              href={buildContractQuery(row, token?.value as string)}
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
