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
      permanentNumber: '41',
      url: null,
    },
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
    seasons: [
      {
        season: '2026',
        DriverStandings: [
          {
            position: null,
            points: '0',
            wins: '0',
            Constructors: [{ name: 'Racing Bulls' }],
          },
        ],
      },
    ],
    seasonSummaries: [
      {
        season: '2026',
        team: 'Racing Bulls',
        championshipPosition: null,
        points: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        fastestLaps: 0,
        races: 0,
        dnfs: 0,
      },
    ],
  },
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchJSON(url, { retries = 3, timeoutMs = 7000 } = {}) {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(timeout)

      if (res.status === 429) {
        await sleep(900 * (i + 1))
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

  return seasons
    .map((s) => Number(s.season))
    .filter(Boolean)
    .sort((a, b) => a - b)
}

async function mapWithConcurrency(items, worker, concurrency = 4) {
  const results = new Array(items.length)
  let index = 0

  async function runner() {
    while (index < items.length) {
      const currentIndex = index++
      results[currentIndex] = await worker(items[currentIndex], currentIndex)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => runner())
  )

  return results
}

function buildSeasonStubFromSummary(summary) {
  return {
    season: String(summary.season),
    DriverStandings: [
      {
        position:
          summary.championshipPosition == null
            ? null
            : String(summary.championshipPosition),
        points: String(summary.points ?? 0),
        wins: String(summary.wins ?? 0),
        Constructors: [{ name: summary.team || 'N/A' }],
      },
    ],
  }
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
        res.setHeader(
          'Cache-Control',
          's-maxage=604800, stale-while-revalidate=2592000'
        )

        return res.status(200).json({
          driver: custom.driver,
          seasons: custom.seasons || [],
          seasonSummaries: custom.seasonSummaries || [],
          career: custom.career,
          wins: custom.career?.wins || 0,
          podiums: custom.career?.podiums || 0,
          poles: custom.career?.poles || 0,
          fastestLaps: custom.career?.fastestLaps || 0,
          racesTotal: custom.career?.races || 0,
          dnfs: custom.career?.dnfs || 0,
          partial: false,
          failedYears: 0,
          custom: true,
        })
      }

      return res.status(404).json({ error: 'Driver not found' })
    }

    const ergastId = driver.driverId
    const years = await getCareerYears(ergastId)

    if (!years.length) {
      res.setHeader(
        'Cache-Control',
        's-maxage=604800, stale-while-revalidate=2592000'
      )

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
        partial: false,
        failedYears: 0,
        custom: false,
      })
    }

    const raceResultsByYear = await mapWithConcurrency(
      years,
      async (year) => {
        const data = await fetchJSON(
          `${BASE}/${year}/drivers/${ergastId}/results.json?limit=100`
        )
        return { year, data }
      },
      5
    )

    const seasonSummariesMap = {}
    let wins = 0
    let podiums = 0
    let poles = 0
    let fastestLaps = 0
    let racesTotal = 0
    let dnfs = 0
    let failedYears = 0

    for (const entry of raceResultsByYear) {
      if (!entry?.data) {
        failedYears += 1
        continue
      }

      const races = entry.data?.MRData?.RaceTable?.Races || []

      for (const race of races) {
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

        const summary = seasonSummariesMap[year]
        const position = result.position ? Number(result.position) : null
        const grid = result.grid ? Number(result.grid) : null
        const points = result.points ? Number(result.points) : 0
        const fastestLapRank = result.FastestLap?.rank
          ? Number(result.FastestLap.rank)
          : null
        const status = result.status || ''

        summary.races += 1
        summary.points += points
        racesTotal += 1

        if (position === 1) {
          summary.wins += 1
          wins += 1
        }

        if (position && position <= 3) {
          summary.podiums += 1
          podiums += 1
        }

        if (grid === 1) {
          summary.poles += 1
          poles += 1
        }

        if (fastestLapRank === 1) {
          summary.fastestLaps += 1
          fastestLaps += 1
        }

        if (isDnfStatus(status)) {
          summary.dnfs += 1
          dnfs += 1
        }
      }
    }

    const seasonSummaries = Object.values(seasonSummariesMap).sort(
      (a, b) => Number(a.season) - Number(b.season)
    )

    const seasons = seasonSummaries.map(buildSeasonStubFromSummary)

    const career = {
      debutYear: years[0] || null,
      lastYear: years[years.length - 1] || null,
      championships: 0,
      races: racesTotal,
      wins,
      podiums,
      poles,
      fastestLaps,
      dnfs,
    }

    res.setHeader(
      'Cache-Control',
      's-maxage=604800, stale-while-revalidate=2592000'
    )

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
      partial: failedYears > 0,
      failedYears,
      custom: false,
    })
  } catch (e) {
    console.error('driver api error:', e)
    return res.status(500).json({ error: 'Failed to fetch driver data' })
  }
}