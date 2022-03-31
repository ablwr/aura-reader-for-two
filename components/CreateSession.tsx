/* eslint-disable react/no-unescaped-entities */
import { useRouter } from 'next/router'
import { useState } from 'react'

const CreateSession = ({}) => {
  const [isError, setIsError] = useState(false)
  const router = useRouter()

  const createRoom = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/room', {
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
      <div className="mt-8">
        <ul>
          <li>Create a session</li>
          <li>Send the link to your partner</li>
          <li>Each describe the partner's aura as it appears</li>
          <li></li>
        </ul>
      </div>
      <div className="p-8">
        <em>The experience lasts 5 minutes</em>
      </div>
      <button
        className="p-4 m-4 rounded-lg text-indigo-50 bg-indigo-500 hover:bg-indigo-200 hover:text-indigo-700 cursor-pointer"
        onClick={createRoom}
      >
        Create session
      </button>
    </div>
  )
}

export default CreateSession
