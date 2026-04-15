const BASE = 'https://api.jolpi.ca/ergast/f1'

const DEBUT_YEARS = {
  max_verstappen: 2015,
  verstappen: 2015,
  hamilton: 2007,
  leclerc: 2018,
  norris: 2019,
  piastri: 2023,
  russell: 2019,
  antonelli: 2025,
  alonso: 2001,
  stroll: 2017,
  gasly: 2017,
  colapinto: 2024,
  ocon: 2016,
  bearman: 2025,
  lawson: 2023,
  lindblad: 2026,
  albon: 2019,
  sainz: 2015,
  hulkenberg: 2010,
  bortoleto: 2025,
  bottas: 2013,
  perez: 2011,
  hadjar: 2025,
  vettel: 2007,
  rosberg: 2006,
  raikkonen: 2001,
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchJSON(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(url)

      if (r.status === 429) {
        await sleep(1000 * (i + 1))
        continue
      }

      if (!r.ok) return null
      return await r.json()
    } catch (e) {
      if (i === retries - 1) return null
      await sleep(500)
    }
  }
  return null
}

function isDnfStatus(status = '') {
  const s = String(status).toLowerCase()
  if (!s) return false
  if (s.includes('finished')) return false
  if (s.includes('+')) return false
  if (s.includes('lap')) return false
  return true
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { driverId } = req.query
  if (!driverId) return res.status(400).json({ error: 'Missing driverId' })

  try {
    const infoRes = await fetchJSON(`${BASE}/drivers/${driverId}.json`)
    const driver = infoRes?.MRData?.DriverTable?.Drivers?.[0]

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' })
    }

    const ergastId = driver.driverId
    const debutYear = DEBUT_YEARS[ergastId] || DEBUT_YEARS[driverId] || 2015
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - debutYear + 1 }, (_, i) => debutYear + i)

    const standingsResults = await Promise.all(
      years.map(year =>
        fetchJSON(`${BASE}/${year}/drivers/${ergastId}/driverStandings.json`).catch(() => null)
      )
    )

    const raceResultsByYear = await Promise.all(
      years.map(year =>
        fetchJSON(`${BASE}/${year}/drivers/${ergastId}/results.json?limit=100`).catch(() => null)
      )
    )

    const seasons = standingsResults
      .filter(Boolean)
      .map(d => d?.MRData?.StandingsTable?.StandingsLists?.[0])
      .filter(Boolean)

    const allRaceResults = raceResultsByYear
      .filter(Boolean)
      .flatMap(d => d?.MRData?.RaceTable?.Races || [])

    let podiums = 0
    let poles = 0
    let fastestLaps = 0
    let racesTotal = 0
    let dnfs = 0
    let wins = 0

    const seasonSummaries = allRaceResults.reduce((acc, race) => {
      const result = race?.Results?.[0]
      if (!result) return acc

      const year = String(race.season)
      if (!acc[year]) {
        acc[year] = {
          season: year,
          team: result?.Constructor?.name || 'N/A',
          championshipPosition: null,
          points: 0,
          wins: 0,
          podiums: 0,
          poles: 0,
          fastestLaps: 0,
          races: 0,
          dnfs: 0,
        }
      }

      const position = result.position ? Number(result.position) : null
      const grid = result.grid ? Number(result.grid) : null
      const points = result.points ? Number(result.points) : 0
      const fastestLapRank = result.FastestLap?.rank ? Number(result.FastestLap.rank) : null
      const status = result.status || ''

      racesTotal += 1
      acc[year].races += 1
      acc[year].points += points

      if (position === 1) {
        wins += 1
        acc[year].wins += 1
      }

      if (position && position <= 3) {
        podiums += 1
        acc[year].podiums += 1
      }

      if (grid === 1) {
        poles += 1
        acc[year].poles += 1
      }

      if (fastestLapRank === 1) {
        fastestLaps += 1
        acc[year].fastestLaps += 1
      }

      if (isDnfStatus(status)) {
        dnfs += 1
        acc[year].dnfs += 1
      }

      return acc
    }, {})

    for (const s of seasons) {
      const year = String(s.season)
      const st = s.DriverStandings?.[0]
      if (!st) continue

      if (!seasonSummaries[year]) {
        seasonSummaries[year] = {
          season: year,
          team: st?.Constructors?.[0]?.name || 'N/A',
          championshipPosition: st?.position ? Number(st.position) : null,
          points: st?.points ? Number(st.points) : 0,
          wins: st?.wins ? Number(st.wins) : 0,
          podiums: 0,
          poles: 0,
          fastestLaps: 0,
          races: 0,
          dnfs: 0,
        }
      } else {
        seasonSummaries[year].championshipPosition = st?.position ? Number(st.position) : null
        seasonSummaries[year].team = st?.Constructors?.[0]?.name || seasonSummaries[year].team
        seasonSummaries[year].points = st?.points ? Number(st.points) : seasonSummaries[year].points
      }
    }

    const normalizedSeasonSummaries = Object.values(seasonSummaries).sort(
      (a, b) => Number(a.season) - Number(b.season)
    )

    const championships = normalizedSeasonSummaries.filter(
      s => Number(s.championshipPosition) === 1
    ).length

    const career = {
      debutYear,
      lastYear: normalizedSeasonSummaries.length
        ? Number(normalizedSeasonSummaries[normalizedSeasonSummaries.length - 1].season)
        : debutYear,
      championships,
      races: racesTotal,
      wins,
      podiums,
      poles,
      fastestLaps,
      dnfs,
    }

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
    return res.status(200).json({
      driver,
      seasons,
      seasonSummaries: normalizedSeasonSummaries,
      career,
      wins,
      podiums,
      poles,
      fastestLaps,
      racesTotal,
      dnfs,
    })
  } catch (e) {
    return res.status(500).json({ error: 'Failed to fetch driver data' })
  }
}