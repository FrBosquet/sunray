import sqlite from 'sqlite3'

const sq3 = sqlite.verbose()
const setupQuery =
  'CREATE TABLE IF NOT EXISTS cache(code TEXT, access_token TEXT, refresh_token TEXT, expiration INTEGER);'

const getDatabase = (): sqlite.Database => {
  const db = new sq3.Database('./cache.sqlite')

  db.run(setupQuery)

  return db
}

type Token = {
  access_token: string
  refresh_token: string
  expiration: number
}

const getExpiration = (): number => {
  const expiration = new Date()
  expiration.setHours(expiration.getHours() + 1)

  return expiration.getTime()
}

export const saveTokens = (
  code: string,
  { access_token, refresh_token }: Token
) => {
  const db = getDatabase()

  db.run(
    `INSERT INTO cache(code, access_token, refresh_token, expiration) VALUES(?,?,?,?)`,
    [code, access_token, refresh_token, getExpiration()]
  )

  db.close()
}

export const getToken = async (code: string): Promise<Token | undefined> => {
  const db = getDatabase()

  return new Promise((res, rej) => {
    db.get(
      `SELECT * FROM cache WHERE code = ?`,
      [code],
      (err: Error, cached: Token) => {
        if (err) rej(err)

        db.close()

        res(cached)
      }
    )
  })

  return
}
