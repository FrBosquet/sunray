import { Row } from '../pages/api/rows'

const fetchData = async (): Promise<Row[]> => {
  const res = await fetch('http://localhost:3000/api/rows', {
    cache: 'no-store',
  })

  const data = await res.json()

  return data.rows
}

export default async function HomePage() {
  const rows = await fetchData()

  return (
    <div>
      <h2>Ultimos clientes</h2>
      <ul>
        {rows.map((row) => (
          <li key={row.id}>{row.nombre}</li>
        ))}
      </ul>
    </div>
  )
}
