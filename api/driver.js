const BASE = 'https://api.jolpi.ca/ergast/f1'

const DEBUT_YEARS = {
  'max_verstappen': 2015, 'hamilton': 2007, 'leclerc': 2018,
  'norris': 2019, 'piastri': 2023, 'russell': 2019,
  'antonelli': 2025, 'alonso': 2001, 'stroll': 2017,
  'gasly': 2017, 'colapinto': 2024, 'ocon': 2016,
  'bearman': 2025, 'lawson': 2023, 'lindblad': 2026,
  'albon': 2019, 'sainz': 2015, 'hulkenberg': 2010,
  'bortoleto': 2025, 'bottas': 2013, 'perez': 2011,
  'hadjar': 2025, 'verstappen': 2015,
}

async function fetchJSON(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(url)
      if (r.status === 429) {
        await new Promise(res => setTimeout(res, 1000 * (i + 1)))
        continue
      }
      if (!r.ok) return null
      return r.json()
    } catch(e) {
      if (i === retries - 1) return null
      await new Promise(res => setTimeout(res, 500))
    }
  }
  return null
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { driverId } = req.query
  if (!driverId) return res.status(400).json({ error: 'Missing driverId' })

  try {
    const infoRes = await fetchJSON(`${BASE}/drivers/${driverId}.json`)
    const driver = infoRes?.MRData?.DriverTable?.Drivers?.[0]
    if (!driver) return res.status(404).json({ error: 'Driver not found' })

    const ergastId = driver.driverId
    const debutYear = DEBUT_YEARS[ergastId] || DEBUT_YEARS[driverId] || 2015
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - debutYear + 1 }, (_, i) => debutYear + i)

    // fetch standings only — fast enough for all drivers
    const standingsResults = await Promise.all(
      years.map(year =>
        fetchJSON(`${BASE}/${year}/drivers/${ergastId}/driverStandings.json`).catch(() => null)
      )
    )

    const seasons = standingsResults.filter(Boolean)
      .map(d => d.MRData?.StandingsTable?.StandingsLists?.[0]).filter(Boolean)

    // calculate wins from standings
    const wins = seasons.reduce((sum, s) => sum + parseInt(s.DriverStandings?.[0]?.wins || 0), 0)

    const data = { driver, seasons, wins, podiums: 0, poles: 0, fastestLaps: 0, racesTotal: 0, dnfs: 0 }
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
    return res.status(200).json(data)

  } catch(e) {
    return res.status(500).json({ error: 'Failed to fetch driver data' })
  }
}