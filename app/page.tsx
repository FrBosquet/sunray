import { Row } from '../pages/api/rows'

import { BsCloudDownload } from 'react-icons/bs'

const fetchData = async (): Promise<Row[]> => {
  const res = await fetch('http://localhost:3000/api/rows', {
    cache: 'no-store',
  })

  const data = await res.json()

  return data.rows
}

const buildquery = (row: Row): string => {
  console.log(row)

  const params = new URLSearchParams({
    cliente: row.nombre,
    nif: row.dni,
    fecha: row.fecha,
    importe: row.importe.toString(),
  })

  return `http://localhost:3000/api/contract?${params.toString()}`
}

export default async function HomePage() {
  const rows = await fetchData()

  return (
    <div>
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
