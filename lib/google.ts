import { google } from 'googleapis'
import stream from 'stream'
import { Row } from '../app/private/page'
import { DocxFile, Profile, Tokens } from '../types'
import { getSettings } from './api'
import { oauth2Client } from './auth'

export async function getAuthTokens(code: string): Promise<Tokens> {
  const { tokens } = await oauth2Client.getToken(code)

  const { access_token, refresh_token, expiry_date } = tokens as Tokens

  return { access_token, refresh_token, expiry_date }
}

export async function getUserInfo(token: string): Promise<Profile> {
  oauth2Client.setCredentials({ access_token: token as string })
  const oauth = google.oauth2('v2')

  const userInfo = await oauth.userinfo.get({ auth: oauth2Client })

  return userInfo.data as Profile
}

export async function fetchRows(token: string): Promise<Row[]> {
  const sheets = google.sheets({ version: 'v4' })

  oauth2Client.setCredentials({ access_token: token as string })

  const { settings } = await getSettings(token)

  if (!settings) throw new Error('User is not registered in firebase, so its not authorized to use Sunray')

  const { inputSheet, columnRange } = settings

  const range = await sheets.spreadsheets.values.get({
    auth: oauth2Client,
    spreadsheetId: inputSheet,
    range: columnRange,
  })

  const values: Array<string[]> = range.data.values as any

  const headers = values[0].map((s) => s.toLowerCase().trim()) as Array<
    keyof Row
  >

  const rows = values.slice(1).map((values, id) => {
    return values.reduce((acc, v, i) => ({ ...acc, [headers[i]]: v }), {
      id: `${id}`,
    }) as Row
  })

  return rows
}

const DOCXMIMETYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export async function getDriveFiles(token: string): Promise<DocxFile[]> {
  oauth2Client.setCredentials({ access_token: token as string })

  const drive = google.drive({ version: 'v3', auth: oauth2Client })
  const { settings } = await getSettings(token)

  const fileResponse = await drive.files.list({
    q: `'${settings.baseFolder}' in parents`,
  })

  const files = fileResponse.data.files?.filter(({ mimeType }) => {
    return [DOCXMIMETYPE].includes(mimeType as string)
  }).map(file => ({
    name: file.name?.replace(/.docx/, '') as string,
    id: file.id as string
  }) as DocxFile) || []

  return files
}

export async function getDriveFile(
  token: string,
  fileId: string
): Promise<Buffer> {
  oauth2Client.setCredentials({ access_token: token as string })

  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  const fileResponse = await drive.files.get(
    {
      fileId,
      alt: 'media',
    },
    { responseType: 'stream' }
  )

  return new Promise((contentResolve, rej) => {
    const data: Uint8Array[] = []
    const writer = new stream.Writable({
      write: function (chunk, encoding, next) {
        data.push(chunk)

        next()
      },
    })
    fileResponse.data.pipe(writer)

    writer.on('error', (err) => {
      rej(err)
    })

    writer.on('close', () => {
      contentResolve(Buffer.concat(data))
    })
  })
}

export async function invokeGoogleAuthEndpoint() {
  try {
    const request = await fetch(`/api/googleAuthLink`)
    const response = await request.json()
    window.location.href = response.url
  } catch (error) {
    console.error(error)
  }
}
