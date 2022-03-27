import Link from 'next/link'
import { useRouter } from 'next/router'

const Footer = ({}) => {
  const router = useRouter()

  return (
    <footer className="text-md italic bg-indigo-300 text-indigo-800 p-2 z-50">
      <Link href="/">Click here to go back</Link>
    </footer>
  )
}

export default Footer
