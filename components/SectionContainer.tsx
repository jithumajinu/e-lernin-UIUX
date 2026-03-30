import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return <section className="m-0 w-full max-w-none pl-10 pr-10">{children}</section>
}
