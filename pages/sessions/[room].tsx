import type { NextPage } from 'next'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

import DailyIframe, { DailyCall } from '@daily-co/daily-js'
import { DailyProvider } from '@daily-co/daily-react-hooks'
import { useEffect, useState } from 'react'
import Session from '../../components/Session'

const Home: NextPage = ({}) => {
  const [callObject, setCallObject] = useState<DailyCall>()

  useEffect(() => {
    if (!DailyIframe) return

    const newCallObject = DailyIframe.createCallObject()
    setCallObject(newCallObject)
    newCallObject.join({
      url: `${
        process.env.NEXT_PUBLIC_DAILY_DOMAIN
      }/${window.location.pathname.slice(10)}`,
    })
  }, [])

  return (
    <div className="flex flex-1 flex-col h-full w-full h-screen w-screen">
      <Header />
      <div id="error-msg" className="absolute top-0 text-white"></div>
      <main className="flex flex-1 flex-col items-center justify-center text-center bg-gradient-to-b from-indigo-500 to-indigo-300">
        <DailyProvider callObject={callObject}>
          <Session />
        </DailyProvider>
      </main>
      <Footer />
    </div>
  )
}

export default Home
