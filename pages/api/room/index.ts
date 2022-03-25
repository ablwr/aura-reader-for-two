import { NextApiRequest, NextApiResponse } from 'next'

// Creates a time-limited aura-reading session c/o Daily

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let randomWords = require('random-words')

  if (req.method === 'POST') {
    const opts = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: randomWords({
          exactly: 1,
          wordsPerString: 3,
          separator: '-',
        }).pop(),
        privacy: 'public',
        properties: {
          // Expire room after 5 minutes
          exp: Math.round(Date.now() / 1000) + 300,
          eject_at_room_exp: true,
          enable_new_call_ui: true,
          enable_prejoin_ui: false,
          enable_people_ui: false,
          enable_screenshare: false,
          max_participants: 2,
        },
      }),
    }

    const dailyRes = await fetch(`${process.env.DAILY_REST_DOMAIN}/rooms`, opts)
    const response = await dailyRes.json()

    // testing -- mock json
    // const response = { name: 'aura', config: { exp: 99999999 } }

    if (response.error) {
      return res.status(500).json(response.error)
    }
    return res.status(200).json(response)
  }
  return res.status(500)
}
