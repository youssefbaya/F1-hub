const BASE = 'https://api.jolpi.ca/ergast/f1'

const CUSTOM_DRIVERS = {
  lindblad: {
    driver: {
      driverId: 'lindblad',
      givenName: 'Arvid',
      familyName: 'Lindblad',
      dateOfBirth: '2007-08-08',
      nationality: 'British',
      code: 'LIN',
      permanentNumber: null,
    },

    // adjust these
    career: {
      debutYear: 2026,
      lastYear: 2026,
      championships: 0,
      races: 0,
      wins: 0,
      podiums: 0,
      poles: 0,
      fastestLaps: 0,
      dnfs: 0,
    },

    seasons: [],
    seasonSummaries: [],
  },
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchJSON(url, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(url)

      if (r.status === 429) {
        await sleep(1200 * (i + 1))
        continue
      }

      if (!r.ok) return null
      return await r.json()
    } catch (e) {
      if (i === retries - 1) return null
      await sleep(700)
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

async function getCareerYears(driverId) {
  const seasonsRes = await fetchJSON(`${BASE}/drivers/${driverId}/seasons.json?limit=100`)
  const seasons = seasonsRes?.MRData?.SeasonTable?.Seasons || []

  if (!seasons.length) return []

  return seasons
    .map(s => Number(s.season))
    .filter(Boolean)
    .sort((a, b) => a - b)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const { driverId } = req.query

  if (!driverId) {
    return res.status(400).json({ error: 'Missing driverId' })
  }

  try {
    const infoRes = await fetchJSON(`${BASE}/drivers/${driverId}.json`)
    const driver = infoRes?.MRData?.DriverTable?.Drivers?.[0]

    if (!driver) {
      const custom = CUSTOM_DRIVERS[driverId]

      if (custom) {
        return res.status(200).json({
          driver: custom.driver,
          seasons: custom.seasons,
          seasonSummaries: custom.seasonSummaries,
          career: custom.career,
          wins: custom.career.wins,
          podiums: custom.career.podiums,
          poles: custom.career.poles,
          fastestLaps: custom.career.fastestLaps,
          racesTotal: custom.career.races,
          dnfs: custom.career.dnfs,
          partial: false,
          custom: true,
        })
      }

      return res.status(404).json({ error: 'Driver not found' })
    }

    const ergastId = driver.driverId
    const years = await getCareerYears(ergastId)

    if (!years.length) {
      return res.status(200).json({
        driver,
        seasons: [],
        seasonSummaries: [],
        career: {
          debutYear: null,
          lastYear: null,
          championships: 0,
          races: 0,
          wins: 0,
          podiums: 0,
          poles: 0,
          fastestLaps: 0,
          dnfs: 0,
        },
        wins: 0,
        podiums: 0,
        poles: 0,
        fastestLaps: 0,
        racesTotal: 0,
        dnfs: 0,
      })
    }

    const standingsResults = []
    const raceResultsByYear = []

    // Sequential fetch = much safer than Promise.all for lots of seasons
    for (const year of years) {
      const standings = await fetchJSON(
        `${BASE}/${year}/drivers/${ergastId}/driverStandings.json`
      )
      standingsResults.push(standings)
      await sleep(120)
    }

    for (const year of years) {
      const results = await fetchJSON(
        `${BASE}/${year}/drivers/${ergastId}/results.json?limit=100`
      )
      raceResultsByYear.push(results)
      await sleep(120)
    }

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

    const seasonSummariesMap = {}

    for (const race of allRaceResults) {
      const result = race?.Results?.[0]
      if (!result) continue

      const year = String(race.season)

      if (!seasonSummariesMap[year]) {
        seasonSummariesMap[year] = {
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
      const fastestLapRank = result.FastestLap?.rank
        ? Number(result.FastestLap.rank)
        : null
      const status = result.status || ''

      racesTotal += 1
      seasonSummariesMap[year].races += 1
      seasonSummariesMap[year].points += points

      if (position === 1) {
        wins += 1
        seasonSummariesMap[year].wins += 1
      }

      if (position && position <= 3) {
        podiums += 1
        seasonSummariesMap[year].podiums += 1
      }

      if (grid === 1) {
        poles += 1
        seasonSummariesMap[year].poles += 1
      }

      if (fastestLapRank === 1) {
        fastestLaps += 1
        seasonSummariesMap[year].fastestLaps += 1
      }

      if (isDnfStatus(status)) {
        dnfs += 1
        seasonSummariesMap[year].dnfs += 1
      }
    }

    for (const s of seasons) {
      const year = String(s.season)
      const st = s.DriverStandings?.[0]
      if (!st) continue

      if (!seasonSummariesMap[year]) {
        seasonSummariesMap[year] = {
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
        seasonSummariesMap[year].championshipPosition = st?.position
          ? Number(st.position)
          : null
        seasonSummariesMap[year].team =
          st?.Constructors?.[0]?.name || seasonSummariesMap[year].team
        seasonSummariesMap[year].points = st?.points
          ? Number(st.points)
          : seasonSummariesMap[year].points
      }
    }

    const seasonSummaries = Object.values(seasonSummariesMap).sort(
      (a, b) => Number(a.season) - Number(b.season)
    )

    const championships = seasonSummaries.filter(
      s => Number(s.championshipPosition) === 1
    ).length

    const career = {
      debutYear: years[0],
      lastYear: years[years.length - 1],
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
      seasonSummaries,
      career,
      wins,
      podiums,
      poles,
      fastestLaps,
      racesTotal,
      dnfs,
    })
  } catch (e) {
    console.error('driver api error:', e)
    return res.status(500).json({ error: 'Failed to fetch driver data' })
  }
}