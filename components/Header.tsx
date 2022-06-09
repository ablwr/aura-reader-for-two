import Link from 'next/link'

const Header = ({}) => {
  return (
    <>
      <header className="bg-indigo-900 text-center">
        <h1 className="text-gray-100 hover:text-gray-200 text-4xl pt-2 z-50">
          <Link href="/">aura reader for two</Link>
          <a
            className="bg-indigo-900 text-xl float-right"
            href="https://github.com/ablwr/aura-reader-for-two"
          >
            🔮
          </a>
        </h1>
      </header>
    </>
  )
}

export default Header
