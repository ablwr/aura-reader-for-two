import React, { useEffect, useState } from 'react'

type Props = {
  exp: number | undefined
}

export const ExpTimer = ({ exp }: Props) => {
  const [secs, setSecs] = useState('--:--')

  // If room has an expiry time, we'll calculate how many seconds until expiry
  useEffect((): (() => void) => {
    if (!exp) {
      return () => null
    }
    const interval = setInterval(() => {
      const countdownClock = Math.round(exp - Date.now() / 1000)
      if (countdownClock < 0) {
        return setSecs('--:--')
      }
      setSecs(
        `${Math.floor(countdownClock / 60)}:${`0${countdownClock % 60}`.slice(
          -2
        )}`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [exp])

  if (!secs) {
    setSecs('--:--')
  }

  return <div className="p-2 m-2 rounded-lg bg-indigo-200">{secs}</div>
}

export default ExpTimer
