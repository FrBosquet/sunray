import { Row } from '../pages/api/rows'

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
      <h2 className="font-bold">Ultimos clientes</h2>
      <ul>
        {rows.map((row) => (
          <li className="flex" key={row.id}>
            <h3 className="flex-1">{row.nombre}</h3>
            <a href={buildquery(row)}>Descargar contrato</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
