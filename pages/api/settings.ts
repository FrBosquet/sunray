import Cookies from 'cookies'
import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSettings } from '../../lib/firebase'
import { getUserInfo } from '../../lib/google'
import { AppSettings } from '../../types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'GET') {
    const cookies = new Cookies(req, res)
    const token = cookies.get('access_token') as string
    const profile = await getUserInfo(token)
    const settings = await getUserSettings(profile.email)

    if (!settings) {
      return res.status(500).send('Settings not found for user')
    }

    res.status(200).json({ settings, profile })
  } else if (method === 'POST') {
  } else {
    res.status(500).send(`Method ${method} not supported`)
  }
}
