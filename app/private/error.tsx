'use client'

import Link from 'next/link'

export default function Error({ error }: { error: Error }) {
  return (
    <section>
      <h3>Oops</h3>
      <p>{error.message}</p>
      <Link href={'/'}>Volver</Link>
    </section>
  )
}
