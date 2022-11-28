import { createWriteStream, readFileSync } from 'fs'
import { google } from 'googleapis'
import { oauth2 } from 'googleapis/build/src/apis/oauth2'
import { join, resolve } from 'path'
import { Row } from '../app/private/page'
import { Profile, Tokens } from '../types'

const client_id = process.env.G_CLIENT_ID
const client_secret = process.env.G_CLIENT_SECRET

export const tempFilePath = resolve(join('output.docx'))

export const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  `${process.env.NEXT_APP_HOST}/api/redirect`
)

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

  const range = await sheets.spreadsheets.values.get({
    auth: oauth2Client,
    spreadsheetId: process.env.NEXT_APP_SPREADSHEET_ID,
    range: 'Clientes!A:E',
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

export async function getDriveFile<T>(
  token: string,
  fileId: string
): Promise<T> {
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
    const writer = createWriteStream(tempFilePath)
    fileResponse.data.pipe(writer)

    writer.on('error', (err) => {
      rej(err)
    })

    writer.on('close', () => {
      const file = readFileSync(tempFilePath, 'binary')
      contentResolve(file as T)
    })
  })
}

export async function generateAuthUrl(): Promise<string> {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
    ],
    prompt: 'consent',
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
