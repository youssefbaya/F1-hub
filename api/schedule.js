import { CURRENT_SEASON, JOLPICA_BASE } from './_lib/constants.js'
import { fetchJson } from './_lib/fetcher.js'
import { sendJson } from './_lib/response.js'
import { normalizeRace, normalizeRaceResults } from './_lib/normalizers.js'

export default async function handler(req, res) {
  const [nextRaceData, lastRaceData, seasonData] = await Promise.all([
    fetchJson(`${JOLPICA_BASE}/current/next.json`),
    fetchJson(`${JOLPICA_BASE}/current/last/results.json`),
    fetchJson(`${JOLPICA_BASE}/current/races.json?limit=30`),
  ])

  const nextRace = nextRaceData?.MRData?.RaceTable?.Races?.[0] || null
  const lastRace = lastRaceData?.MRData?.RaceTable?.Races?.[0] || null
  const races = seasonData?.MRData?.RaceTable?.Races || []

  return sendJson(res, {
    season: CURRENT_SEASON,
    nextRace: normalizeRace(nextRace),
    lastRace: normalizeRaceResults(lastRace),
    races: races.map(normalizeRace),
    fetchedAt: new Date().toISOString(),
  }, {
    cacheSeconds: 1800,
    staleSeconds: 3600,
  })
}