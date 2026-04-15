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

  // retired / older drivers
  vettel: 2007,
  rosberg: 2006,
  raikkonen: 2001,
  massa: 2002,
  button: 2000,
  webber: 2002,
  kubica: 2006,
  heidfeld: 2000,
  barrichello: 1993,
  coulthard: 1994,
  hakkinen: 1991,
  schumacher: 1991,
  michael_schumacher: 1991,
  senna: 1984,
  prost: 1980,
  mansell: 1980,
  hill: 1992,
  villeneuve: 1996,
  montoya: 2001,
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

function chunkArray(arr, size) {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

async function fetchYearsInBatches(years, worker, batchSize = 4) {
  const chunks = chunkArray(years, batchSize)
  const results = []

  for (const chunk of chunks) {
    const batch = await Promise.all(chunk.map(worker))
    results.push(...batch)
    await sleep(150)
  }

  return results
}

function normalizeStatus(status = '') {
  return String(status).toLowerCase()
}

function isDnfStatus(status = '') {
  const s = normalizeStatus(status)

  if (!s) return false
  if (s.includes('finished')) return false
  if (s.includes('+')) return false
  if (s.includes('lap')) return false

  return true
}

function getBestConstructorName(results = []) {
  const counts = {}

  for (const r of results) {
    const name = r?.Constructor?.name
    if (!name) continue
    counts[name] = (counts[name] || 0) + 1
  }

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
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
      return res.status(404).json({ error: 'Driver not found' })
    }

    const ergastId = driver.driverId
    const currentYear = new Date().getFullYear()
    const debutYear = DEBUT_YEARS[ergastId] || DEBUT_YEARS[driverId] || currentYear

    const years = Array.from(
      { length: currentYear - debutYear + 1 },
      (_, i) => debutYear + i
    )

    const [standingsResults, raceResultsByYear] = await Promise.all([
      fetchYearsInBatches(
        years,
        year => fetchJSON(`${BASE}/${year}/drivers/${ergastId}/driverStandings.json`),
        5
      ),
      fetchYearsInBatches(
        years,
        year => fetchJSON(`${BASE}/${year}/drivers/${ergastId}/results.json?limit=100`),
        3
      ),
    ])

    const seasons = standingsResults
      .filter(Boolean)
      .map(d => d?.MRData?.StandingsTable?.StandingsLists?.[0])
      .filter(Boolean)

    const allRaceResults = raceResultsByYear
      .filter(Boolean)
      .flatMap(d => d?.MRData?.RaceTable?.Races || [])
      .flatMap(race => {
        const result = race?.Results?.[0]
        if (!result) return []

        return [
          {
            season: Number(race.season),
            round: Number(race.round),
            raceName: race.raceName,
            date: race.date,
            circuit: {
              circuitId: race.Circuit?.circuitId,
              circuitName: race.Circuit?.circuitName,
              locality: race.Circuit?.Location?.locality,
              country: race.Circuit?.Location?.country,
            },
            result: {
              position: result.position ? Number(result.position) : null,
              positionText: result.positionText || null,
              points: result.points ? Number(result.points) : 0,
              grid: result.grid ? Number(result.grid) : null,
              laps: result.laps ? Number(result.laps) : null,
              status: result.status || '',
              constructor: result.Constructor?.name || null,
              fastestLapRank: result.FastestLap?.rank
                ? Number(result.FastestLap.rank)
                : null,
              fastestLapTime: result.FastestLap?.Time?.time || null,
            },
          },
        ]
      })
      .sort((a, b) => {
        if (a.season !== b.season) return a.season - b.season
        return a.round - b.round
      })

    const racesTotal = allRaceResults.length
    const podiums = allRaceResults.filter(r => {
      const p = r.result.position
      return p && p <= 3
    }).length

    const wins = allRaceResults.filter(r => r.result.position === 1).length

    const poles = allRaceResults.filter(r => r.result.grid === 1).length

    const fastestLaps = allRaceResults.filter(
      r => r.result.fastestLapRank === 1
    ).length

    const dnfs = allRaceResults.filter(r =>
      isDnfStatus(r.result.status)
    ).length

    const seasonsMap = new Map()

    for (const race of allRaceResults) {
      const year = race.season

      if (!seasonsMap.has(year)) {
        seasonsMap.set(year, {
          season: String(year),
          races: 0,
          wins: 0,
          podiums: 0,
          poles: 0,
          fastestLaps: 0,
          dnfs: 0,
          pointsFromResults: 0,
          team: 'N/A',
          raceResults: [],
        })
      }

      const s = seasonsMap.get(year)
      s.races += 1
      s.pointsFromResults += race.result.points || 0
      s.raceResults.push(race)

      if (race.result.position === 1) s.wins += 1
      if (race.result.position && race.result.position <= 3) s.podiums += 1
      if (race.result.grid === 1) s.poles += 1
      if (race.result.fastestLapRank === 1) s.fastestLaps += 1
      if (isDnfStatus(race.result.status)) s.dnfs += 1
    }

    for (const [year, seasonSummary] of seasonsMap.entries()) {
      seasonSummary.team = getBestConstructorName(
        seasonSummary.raceResults.map(r => ({
          Constructor: { name: r.result.constructor },
        }))
      )

      const standing = seasons.find(s => Number(s.season) === year)
      if (standing?.DriverStandings?.[0]) {
        const ds = standing.DriverStandings[0]
        seasonSummary.position = ds.position ? Number(ds.position) : null
        seasonSummary.points = ds.points ? Number(ds.points) : seasonSummary.pointsFromResults
        seasonSummary.winsFromStandings = ds.wins ? Number(ds.wins) : seasonSummary.wins
        seasonSummary.constructor =
          ds.Constructors?.[0]?.name || seasonSummary.team
      } else {
        seasonSummary.position = null
        seasonSummary.points = seasonSummary.pointsFromResults
        seasonSummary.winsFromStandings = seasonSummary.wins
        seasonSummary.constructor = seasonSummary.team
      }
    }

    const normalizedSeasons = Array.from(seasonsMap.values())
      .sort((a, b) => Number(a.season) - Number(b.season))
      .map(s => ({
        season: s.season,
        team: s.constructor || s.team,
        championshipPosition: s.position,
        points: s.points,
        wins: s.wins,
        podiums: s.podiums,
        poles: s.poles,
        fastestLaps: s.fastestLaps,
        races: s.races,
        dnfs: s.dnfs,
      }))

    const championships = normalizedSeasons.filter(
      s => s.championshipPosition === 1
    ).length

    const career = {
      debutYear,
      lastYear: normalizedSeasons[normalizedSeasons.length - 1]?.season
        ? Number(normalizedSeasons[normalizedSeasons.length - 1].season)
        : debutYear,
      championships,
      races: racesTotal,
      wins,
      podiums,
      poles,
      fastestLaps,
      dnfs,
    }

    const data = {
      driver,
      career,
      seasons,
      seasonSummaries: normalizedSeasons,
      results: allRaceResults,
      wins,
      podiums,
      poles,
      fastestLaps,
      racesTotal,
      dnfs,
    }

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
    return res.status(200).json(data)
  } catch (e) {
    return res.status(500).json({ error: 'Failed to fetch driver data' })
  }
}