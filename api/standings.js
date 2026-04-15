// api/standings.js
// Returns current driver and constructor standings, cached for 1 hour

const BASE = 'https://api.jolpi.ca/ergast/f1'

// fallback (only used if API fails)
const FALLBACK_STANDINGS = [
  {
    position: '1',
    points: '0',
    wins: '0',
    Driver: {
      driverId: 'verstappen',
      givenName: 'Max',
      familyName: 'Verstappen',
      permanentNumber: '1',
      code: 'VER',
    },
    Constructors: [{ name: 'Red Bull' }],
  },
]

// small helper
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// fetch with retry + timeout
async function fetchJSON(url, { retries = 3, timeoutMs = 6000 } = {}) {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(timeout)

      if (res.status === 429) {
        await sleep(800 * (i + 1))
        continue
      }

      if (!res.ok) return null

      return await res.json()
    } catch (e) {
      clearTimeout(timeout)
      if (i === retries - 1) return null
      await sleep(400 * (i + 1))
    }
  }

  return null
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  try {
    const data = await fetchJSON(`${BASE}/current/driverStandings.json`)

    const standings =
      data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || []

    if (standings.length > 0) {
      res.setHeader(
        'Cache-Control',
        's-maxage=1800, stale-while-revalidate=300'
      )

      return res.status(200).json({
        standings,
        source: 'live',
      })
    }
  } catch (e) {
    console.error('standings fetch error:', e)
  }

  // fallback
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')

  return res.status(200).json({
    standings: FALLBACK_STANDINGS,
    source: 'fallback',
  })
}