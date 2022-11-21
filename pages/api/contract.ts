// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Docxtemplater from 'docxtemplater'
import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import PizZip from 'pizzip'

const filePath = path.resolve(__dirname, '../../../../public/Template.docx')
const content = fs.readFileSync(filePath, 'binary')

const zip = new PizZip(content)

const doc = new Docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req
  doc.render(query)

  console.log(query)

  const buf = doc.getZip().generate({ type: 'nodebuffer' }) as Buffer
  const clientName = query.cliente as string
  const date = new Date(query.fecha as string)

  const filename = [
    clientName.replace(/\s/gi, '_').toLowerCase(),
    date.getDate(),
    date.getMonth(),
    date.getFullYear(),
  ].join('_')

  res.status(200)
  res.setHeader('Content-Length', buf.byteLength)
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
  res.setHeader('Content-Disposition', `attachment; filename=${filename}.docx`)
  res.write(buf, 'binary')
  res.end()
}
