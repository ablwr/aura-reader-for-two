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
      <div className="mt-8 text-indigo-50 leading-10">
        <ul>
          <li className="mt-6">Create a session</li>
          <li className="mt-6">Send the link to your partner</li>
          <li className="mt-6">Describe your partner's aura as it appears</li>
          <button
            className="p-2 mt-6 border-2 rounded-md border-indigo-200 bg-indigo-600 text-indigo-50 hover:bg-indigo-200 hover:text-indigo-200 cursor-pointer"
            onClick={createRoom}
          >
            Create session
          </button>
          <li className="">This experience lasts 5 minutes</li>
        </ul>
      </div>
    </div>
  )
}

export default CreateSession
