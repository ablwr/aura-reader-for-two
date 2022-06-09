/* eslint-disable react/no-unescaped-entities */
import { useRouter } from 'next/router'
import { useState } from 'react'

const CreateSession = ({}) => {
  const [isError, setIsError] = useState(false)
  const router = useRouter()

  const createRoom = async () => {
    try {
      const res = await fetch('/api/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      let resJson = await res.json()
      router.push(
        {
          pathname: `/sessions/${resJson.name}`,
          query: {
            url: resJson.url,
            room: resJson.name,
            exp: resJson.config?.exp,
          },
        },
        // This is to provide a cleaner URL
        `/sessions/${resJson.name}`
      )
    } catch (e) {
      setIsError(true)
    }
  }

  return (
    <div className="w-full">
      {isError && (
        <div className="warning">
          Something went wrong but it was not your fault
        </div>
      )}
      <div className="text-indigo-50 leading-10 italic">
        <ul className="grid grid-cols-1 items-center place-content-center justify-center text-2xl">
          <li className="border-indigo-500 bg-indigo-500 rounded-r-3xl border-2 mt-6 mr-60 lg:mr-80 p-4">
            1. Create a session
          </li>
          <li className="border-indigo-400 bg-indigo-400 border-2 content-center mt-6 p-4">
            2. Send the link to your partner
          </li>
          <li className="border-indigo-300 bg-indigo-300 rounded-l-3xl border-2 mt-6 ml-40 lg:ml-80 p-4">
            3. Describe your partner's aura
          </li>
          <li>
            <button
              className="max-w-sm text-xl p-4 mt-4 lg:mt-16 border-2 rounded-xl border-indigo-200 bg-indigo-600 text-indigo-50 hover:bg-indigo-200 hover:text-indigo-200 cursor-pointer"
              onClick={createRoom}
            >
              Create session
            </button>
          </li>

          <li className="mt-2 text-xl">This experience lasts 5 minutes</li>
        </ul>
      </div>
    </div>
  )
}

export default CreateSession
