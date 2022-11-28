import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthUrl } from '../../lib/google'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = await generateAuthUrl()

  res.status(200).send({ url })
}
