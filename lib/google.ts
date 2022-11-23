import { google } from 'googleapis'
import { Row } from '../pages/api/rows'
import { getToken, saveTokens } from './cache'

const client_id = process.env.G_CLIENT_ID
const client_secret = process.env.G_CLIENT_SECRET

export const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  'http://localhost:3000/private'
)

type Token = {
  access_token: string
  refresh_token: string
  expiration: number
}

export const getAuthToken = async (code: string): Promise<string> => {
  const cached = await getToken(code)
  if (cached) {
    const { access_token, refresh_token, expiration } = cached

    if (expiration < Date.now()) {
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v4/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id,
            client_secret,
            refresh_token,
            grant_type: 'refresh_token',
          }),
        }
      )

      const data = (await response.json()) as Token

      saveTokens(code, data)
    }

    return access_token
  }

  const { tokens } = await oauth2Client.getToken(code)

  saveTokens(code, tokens as Token)

  return tokens.access_token as string
}

type Profile = {
  name: string
  picture: string
}

export const getUserInfo = async (token: string): Promise<Profile> => {
  const res = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?alt=json`,
    {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await res.json()

  return data as Profile
}

export const fetchRows = async (token: string): Promise<Row[]> => {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${process.env.NEXT_APP_SPREADSHEET_ID}/values/Clientes!A:E`,
    {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const { values } = (await res.json()) as { values: Array<string[]> }
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
