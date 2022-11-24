// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Docxtemplater from 'docxtemplater'
import fs, { createWriteStream, unlinkSync } from 'fs'
import { google } from 'googleapis'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import PizZip from 'pizzip'

const tempPath = path.resolve(path.join('temp', 'output.docx'))

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') throw new Error('Call this endpoint with get')

  // TODO: Get file from google drive

  const { query } = req
  const { token, ...rest } = query

  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: token as string })

  const drive = google.drive({ version: 'v3', auth: oauth2Client })
  const fileResponse = await drive.files.get(
    {
      fileId: '17NDMTcNr2_YJYt869MajPJUsQsM2Q8yx',
      alt: 'media',
    },
    { responseType: 'stream' }
  )

  const content: PizZip.LoadData = await new Promise((contentResolve, rej) => {
    const writer = createWriteStream(tempPath)
    fileResponse.data.pipe(writer)

    writer.on('error', (err) => {
      rej(err)
    })

    writer.on('close', () => {
      const file = fs.readFileSync(tempPath, 'binary')
      contentResolve(file)
    })
  })

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

  unlinkSync(tempPath)

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
