'use client'

import { AiFillGoogleCircle } from 'react-icons/ai'

export default function Login() {
  const createGoogleAuthLink = async () => {
    try {
      const request = await fetch('http://localhost:3000/api/googleAuthLink')
      const response = await request.json()
      window.location.href = response.url
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className="container flex justify-center">
      <article className="w-44 flex flex-col gap-2">
        <h1>Acceder</h1>
        <button
          type="button"
          onClick={createGoogleAuthLink}
          className="w-full p-2 flex justify-center items-center gap-1 bg-blue-500 rounded-md hover:bg-blue-300 transition-all"
        >
          <AiFillGoogleCircle />
          con Google
        </button>
      </article>
    </section>
  )
}
