import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { BsCloudDownload } from 'react-icons/bs'
import { buildContractQuery } from '../../lib/api'
import { fetchRows, getDriveFiles } from '../../lib/google'

export type Row = Record<string, string>

export default async function HomePage() {
  const nextCookies = cookies()
  const token = nextCookies.get('access_token')?.value as string
  try {

    const rows = await fetchRows(token)
    const files = await getDriveFiles(token)

    return (
      <div >
        <h2 className="font-bold">Clientes</h2>
        <ul>
          {rows.map((row) => (
            <li className="flex hover:bg-gray-800 p-1" key={row.id}>
              <h3 className="flex-1">{row.nombre}</h3>
              {
                files.map(file => {
                  return <a
                    key={file.id}
                    className="flex items-center gap-1 text-yellow-400 ml-1 hover:text-red-400"
                    href={buildContractQuery(row, token, file.id, file.name)}
                  >
                    <span>{file.name}</span>
                    <BsCloudDownload />
                  </a>
                })
              }
            </li>
          ))}
        </ul>
      </div>
    )
  } catch (e) {
    redirect('/private/settings')
  }

}
