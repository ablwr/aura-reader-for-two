import Link from 'next/link'

const Header = ({}) => {
  return (
    <header>
      <h1 className="text-gray-100 hover:text-gray-200 text-4xl bg-indigo-600 text-center pt-2 z-50 test">
        <Link href="/">aura reader for two</Link>
      </h1>
    </header>
  )
}

export default Header
