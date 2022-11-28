// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cookies from 'cookies'
import Docxtemplater from 'docxtemplater'
import { unlinkSync } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import PizZip from 'pizzip'
import { getDriveFile, tempFilePath } from '../../lib/google'

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
  const { token, ...rest } = query

  const content = await getDriveFile<PizZip.LoadData>(
    token as string,
    '17NDMTcNr2_YJYt869MajPJUsQsM2Q8yx'
  )

  const zip = new PizZip(content)

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  })

  doc.render(rest)

  const buf = doc.getZip().generate({ type: 'nodebuffer' }) as Buffer
  const clientName = rest.cliente as string
  const date = new Date(rest.fecha as string)

  const filename = [
    clientName.replace(/\s/gi, '_').toLowerCase(),
    date.getDate(),
    date.getMonth(),
    date.getFullYear(),
  ].join('_')

  unlinkSync(tempFilePath)

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
