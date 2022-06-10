import Link from 'next/link'

const Header = ({}) => {
  return (
    <>
      <header className="bg-indigo-900 text-center">
        <h1 className="text-gray-100 hover:text-gray-200 text-4xl pt-2 z-50">
          <Link href="/">aura reader for two</Link>
        </h1>
      </header>
    </>
  )
}

export default Header
