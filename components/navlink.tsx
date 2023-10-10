'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  href: string
  children: React.ReactNode
}

export const NavLink = ({ href, children }: Props) => {
  const pathname = usePathname()

  return <Link href={href} className={`
    hover:text-yellow-600
    transition
    ${pathname === href ? 'text-yellow-400' : ''}
  `}>
    {children}
  </Link>
}