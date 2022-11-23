import { NextApiRequest, NextApiResponse } from 'next'
import { oauth2Client } from '../../lib/google'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
    prompt: 'consent',
  })
  res.status(200).send({ url })
}
