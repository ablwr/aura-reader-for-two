import { useEffect, useState } from 'react'

type Props = {
  exp: Date | undefined
}

export const ExpTimer = ({ exp }: Props) => {
  const [secs, setSecs] = useState('-:--')

  useEffect((): (() => void) => {
    if (!exp) return () => null

    const interval = setInterval(() => {
      const count = Math.round((Date.parse(exp.toString()) - Date.now()) / 1000)
      if (count < 0) {
        return setSecs('-:--')
      }
      setSecs(`${Math.floor(count / 60)}:${`0${count % 60}`.slice(-2)}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [exp])

  if (!secs) {
    setSecs('-:--')
  }

  return (
    <button className="absolute bottom-4 font-mono rounded-r-full left-0 text-3xl p-3 text-indigo-700 bg-indigo-200 border-2 border-indigo-200 cursor-default z-50">
      {secs}
    </button>
  )
}

export default ExpTimer
