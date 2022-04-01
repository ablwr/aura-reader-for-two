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
      <div className="mt-8 text-indigo-50 leading-10">
        <ul>
          <li className="m-6">
            <span className="m-2 p-4 border-2 border-indigo-200 bg-indigo-500">
              Create a session
            </span>
          </li>
          <li className="m-6">
            <span className="m-2 p-4 border-2 border-indigo-200 bg-indigo-500">
              Send the link to your partner
            </span>
          </li>
          <li className="m-6">
            <span className="m-2 p-4 border-2 border-indigo-200 bg-indigo-500">
              Describe your partner's aura as it appears
            </span>
          </li>
          <li></li>
        </ul>
      </div>
      <div className="m-10 text-indigo-50 leading-10">
        <em className="border-2 m-2 p-4 bg-indigo-500">
          This experience lasts 5 minutes
        </em>
      </div>
      <button
        className="p-4 border-2 border-indigo-200 bg-indigo-700 text-indigo-50 hover:bg-indigo-200 hover:text-indigo-500 cursor-pointer"
        onClick={createRoom}
      >
        Create session
      </button>
    </div>
  )
}

export default CreateSession
