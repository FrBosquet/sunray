import { google } from 'googleapis'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { BsSunFill } from 'react-icons/bs'
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
    <section className="container flex justify-center mx-auto">
      <article className="flex flex-col gap-2 h-screen justify-center items-center">
        <BsSunFill className="text-yellow-100 text-9xl" />
        <h1 className="text-transparent bg-clip-text bg-gradient-to-t from-yellow-600 to-yellow-100 text-9xl font-extrabold uppercase tracking-widest">
          Sunray
        </h1>
        <h1>Acceder</h1>
        <a
          type="button"
          href={href}
          className="w-full p-2 flex justify-center items-center gap-1 bg-blue-500 rounded-md hover:bg-blue-300 hover:text-slate-900 transition-all font-semibold"
        >
          <AiFillGoogleCircle />
          con Google
        </a>
      </article>
    </section>
  )
}
