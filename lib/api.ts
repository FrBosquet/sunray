import { Row } from '../app/private/page'
import { AppSettings, Profile } from '../types'

export const buildContractQuery = (row: Row, token: string, fileId: string, fileName: string): string => {
  const params = new URLSearchParams({
    ...row,
    fileId,
    token,
    fileName
  })

  return `/api/contract?${params.toString()}`
}

export const getSettings = async (
  token: string
): Promise<{ settings: AppSettings; profile: Profile }> => {
  const response = await fetch(`${process.env.NEXT_APP_HOST}/api/settings`, {
    headers: {
      Cookie: `access_token=${token}`,
    },
  })
  const settings = await response.json()

  return settings
}