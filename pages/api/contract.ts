// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cookies from 'cookies'
import Docxtemplater from 'docxtemplater'
import type { NextApiRequest, NextApiResponse } from 'next'
import PizZip from 'pizzip'
import { getDriveFile } from '../../lib/google'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') throw new Error('Call this endpoint with get')

  const cookies = new Cookies(req, res)

  const access_token = cookies.get('access_token')

  if (!access_token) {
    return res.redirect('/')
  }

  const { query } = req
  const { token, fileId, fileName, ...rest } = query

  const content = await getDriveFile(
    token as string,
    fileId as string
  )

  const zip = new PizZip(content)

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  })

  doc.render(rest)

  const buf = doc.getZip().generate({ type: 'nodebuffer' }) as Buffer
  const clientName = (rest.cliente || rest.nombre) as string
  const date = new Date()

  const filename = [
    fileName,
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
