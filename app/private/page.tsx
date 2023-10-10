import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DownloadAll } from '../../components/download-all'
import { ContractDL } from '../../components/file'
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
        <section className='flex border-b border-white p-1'>
          <h2 className="font-bold flex-1">Clientes</h2>
          <DownloadAll />
        </section>
        <ul className='pt-4'>
          {rows.map((row) => (
            <li className="flex hover:bg-gray-800 p-1" key={row.id}>
              <h3 className="flex-1">{row.nombre}</h3>
              {
                files.map(file => {
                  return <ContractDL clientName={row.nombre} key={file.id} row={row} token={token} file={file} />
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
