// api/driver/[driverId].js
// Vercel serverless function — caches driver career data for 24 hours

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

async function fetchJSON(url) {
  const r = await fetch(url)
  if (!r.ok) return null
  return r.json()
}

export default async function handler(req, res) {
  // allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

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

    // fetch all data in parallel
    const [standingsResults, resultsArr, qualiArr] = await Promise.all([
      Promise.all(years.map(year =>
        fetchJSON(`${BASE}/${year}/drivers/${ergastId}/driverStandings.json`)
          .catch(() => null)
      )),
      Promise.all(years.map(year =>
        fetchJSON(`${BASE}/${year}/drivers/${ergastId}/results.json?limit=30`)
          .catch(() => null)
      )),
      Promise.all(years.map(year =>
        fetchJSON(`${BASE}/${year}/drivers/${ergastId}/qualifying.json?limit=30`)
          .catch(() => null)
      )),
    ])

    const seasons = standingsResults.filter(Boolean)
      .map(d => d.MRData?.StandingsTable?.StandingsLists?.[0]).filter(Boolean)

    const allRaces = resultsArr.filter(Boolean)
      .flatMap(d => d.MRData?.RaceTable?.Races || [])

    const allQuali = qualiArr.filter(Boolean)
      .flatMap(d => d.MRData?.RaceTable?.Races || [])

    const podiums = allRaces.filter(r => ['1','2','3'].includes(r.Results?.[0]?.position)).length
    const fastestLaps = allRaces.filter(r => r.Results?.[0]?.FastestLap?.rank === '1').length
    const dnfs = allRaces.filter(r => {
      const s = r.Results?.[0]?.status || ''
      return s !== 'Finished' && !s.includes('+') && !s.includes('Lap')
    }).length
    const racesTotal = allRaces.length
    const poles = allQuali.filter(r => r.QualifyingResults?.[0]?.position === '1').length

    const data = { driver, seasons, podiums, poles, fastestLaps, racesTotal, dnfs }

    // cache for 24 hours on Vercel's CDN
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
    return res.status(200).json(data)

  } catch(e) {
    console.error('Driver API error:', e)
    return res.status(500).json({ error: 'Failed to fetch driver data' })
  }
}