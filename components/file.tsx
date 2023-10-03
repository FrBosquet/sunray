import { BsCloudDownload } from 'react-icons/bs'
import { buildContractQuery } from '../lib/api'
import { DocxFile } from '../types'

type Props = {
  row: Record<string, string>
  file: DocxFile
  token: string
  clientName: string
}

export const ContractDL = ({ row, token, file, clientName }: Props) => {
  console.log('contract dl', file);

  const date = new Date()

  const filename = [
    file.name,
    clientName.replace(/\s/gi, '_').toLowerCase(),
    date.getDate(),
    date.getMonth(),
    date.getFullYear(),
  ].join('_')

  return <a
    key={file.id}
    data-type="download"
    data-filename={filename}
    className="flex items-center gap-1 text-yellow-400 ml-1 hover:text-red-400"
    href={buildContractQuery(row, token, file.id, file.name)}
  >
    <span>{file.name}</span>
    <BsCloudDownload />
  </a>
}