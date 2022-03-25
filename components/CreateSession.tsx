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
      <button className="p-4 m-4 rounded-lg bg-indigo-200" onClick={createRoom}>
        Create session
      </button>
    </div>
  )
}

export default CreateSession
