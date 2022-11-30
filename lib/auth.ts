import { google } from 'googleapis'

const client_id = process.env.G_CLIENT_ID
const client_secret = process.env.G_CLIENT_SECRET

export const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  `${process.env.NEXT_APP_HOST}/api/redirect`
)

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
