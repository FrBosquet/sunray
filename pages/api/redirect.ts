// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuthTokens } from '../../lib/google'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') throw new Error('Call this endpoint with get')

  const code = req.query.code as string

  const { access_token, refresh_token, expiration } = await getAuthTokens(code)

  const cookies = new Cookies(req, res)

  cookies.set('access_token', access_token)
  cookies.set('refresh_token', refresh_token)
  cookies.set('expiration', `${expiration}`)
  res.redirect('http://localhost:3000/private')
}
