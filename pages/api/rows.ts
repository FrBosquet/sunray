// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet'
import type { NextApiRequest, NextApiResponse } from 'next'
// TODO: Move info in creeds to env vars
import creds from '../../sunray-creds.json'

export type Row = {
  fecha: string
  nombre: string
  dni: string
  importe: number
  generado: boolean
  id: string
}

type Data = {
  rows: Row[]
}

const parseRow = (row: GoogleSpreadsheetRow): Row => ({
  fecha: new Date(row.Fecha.split('/').reverse().join('/')).toISOString(),
  nombre: row.Nombre,
  dni: row.DNI,
  importe: +row.Importe.replace(/€|\./g, '').replace(',', '.'),
  generado: row.Generado === 'TRUE',
  id: row.rowIndex.toString(),
})

const doc = new GoogleSpreadsheet(process.env.NEXT_APP_SPREADSHEET_ID)

doc.useServiceAccountAuth(creds)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') throw new Error('Call this endpoint with get')

  await doc.loadInfo()

  const sheet = doc.sheetsByTitle['Clientes']

  const rawRows = await sheet.getRows()
  const rows = rawRows.map(parseRow)

  res.status(200).json({ rows })
}
