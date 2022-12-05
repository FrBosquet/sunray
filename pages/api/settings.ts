import Cookies from 'cookies'
import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSettings, setUserSettings } from '../../lib/firebase'
import { getUserInfo } from '../../lib/google'
import { AppSettings } from '../../types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  const cookies = new Cookies(req, res)
  const token = cookies.get('access_token') as string

  if (!token) {
    res.status(400).send('forbidden')
  }

  const profile = await getUserInfo(token)

  if (method === 'GET') {
    const settings = await getUserSettings(profile.email)

    if (!settings) {
      return res.status(500).send('Settings not found for user')
    }

    res.status(200).json({ settings, profile })
  } else if (method === 'PUT') {
    const { body } = req

    const settings = await setUserSettings(profile.email, body as AppSettings)

    res.status(200).json({ settings, profile })
  } else {
    res.status(500).send(`Method ${method} not supported`)
  }
}
