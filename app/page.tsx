import { google } from 'googleapis'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { generateAuthUrl } from '../lib/auth'

const client_id = process.env.G_CLIENT_ID
const client_secret = process.env.G_CLIENT_SECRET

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  `${process.env.NEXT_APP_HOST}/api/redirect`
)

export default async function Login() {
  const href = await generateAuthUrl()

  return (
    <section className="container flex justify-center">
      <article className="w-44 flex flex-col gap-2">
        <h1>Acceder</h1>
        <a
          type="button"
          href={href}
          className="w-full p-2 flex justify-center items-center gap-1 bg-blue-500 rounded-md hover:bg-blue-300 transition-all"
        >
          <AiFillGoogleCircle />
          con Google
        </a>
      </article>
    </section>
  )
}
