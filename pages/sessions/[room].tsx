import type { NextPage } from 'next'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

import DailyIframe, { DailyCall } from '@daily-co/daily-js'
import { DailyProvider, useDailyEvent } from '@daily-co/daily-react-hooks'
import { useCallback, useEffect, useState } from 'react'
import Session from '../../components/Session'
import ExpTimer from '../../components/ExpTimer'

const Home: NextPage = ({}) => {
  const [callObject, setCallObject] = useState<DailyCall>()
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [exp, setExp] = useState<Date | undefined>(undefined)

  useDailyEvent(
    'load-attempt-failed',
    useCallback((ev) => {
      setErrorMsg(ev)
    }, [])
  )
  useEffect(() => {
    if (!DailyIframe) return

    const newCallObject = DailyIframe.createCallObject()
    setCallObject(newCallObject)
    newCallObject
      .join({
        url: `${
          process.env.NEXT_PUBLIC_DAILY_DOMAIN
        }/${window.location.pathname.slice(10)}`,
      })
      .then((response) => {
        let local = response?.local
        setExp(local ? local.will_eject_at : undefined)
      })
      .catch((err) => {
        setErrorMsg(err ? err : 'Something went wrong')
      })
  }, [])

  function getHref() {
    if (typeof window !== 'undefined') {
      return window.location.href
    }
  }

  return (
    <div className="flex flex-1 flex-col h-screen w-screen">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center text-center bg-gradient-to-b from-indigo-600 to-indigo-300">
        {errorMsg && (
          <div id="error-msg" className="absolute text-xl text-white">
            {errorMsg}
          </div>
        )}
        <DailyProvider callObject={callObject}>
          <Session />
        </DailyProvider>
        {exp && (
          <button
            id="shareLink"
            className="p-4 m-4 rounded-lg bg-indigo-200 text-indigo-700 cursor-pointer z-50"
            onClick={() => navigator.clipboard.writeText(getHref() as string)}
          >
            Click to copy link: {getHref()}
          </button>
        )}
        <ExpTimer exp={exp} />
      </main>
      <Footer />
    </div>
  )
}

export default Home
