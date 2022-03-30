import { useEffect, useState } from 'react'

type Props = {
  exp: Date | undefined
}

export const ExpTimer = ({ exp }: Props) => {
  const [secs, setSecs] = useState('--:--')

  useEffect((): (() => void) => {
    if (!exp) return () => null

    const interval = setInterval(() => {
      const count = Math.round((Date.parse(exp.toString()) - Date.now()) / 1000)
      if (count < 0) {
        return setSecs('--:--')
      }
      setSecs(`${Math.floor(count / 60)}:${`0${count % 60}`.slice(-2)}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [exp])

  if (!secs) {
    setSecs('--:--')
  }

  return (
    <button className="absolute bottom-10 left-0 text-4xl p-2 m-4 rounded-lg text-indigo-500 bg-indigo-50 border-2 border-indigo-300 z-50">
      {secs}
    </button>
  )
}

export default ExpTimer
