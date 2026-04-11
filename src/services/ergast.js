const BASE = 'https://api.jolpi.ca/ergast/f1'

export async function getCurrentSeason() {
  const res = await fetch(`${BASE}/current.json`)
  const data = await res.json()
  return data.MRData.RaceTable.Races
}

export async function getNextRace() {
  const res = await fetch(`${BASE}/current/next.json`)
  const data = await res.json()
  return data.MRData.RaceTable.Races[0]
}

export async function getDriverStandings() {
  const res = await fetch(`${BASE}/current/driverStandings.json`)
  const data = await res.json()
  return data.MRData.StandingsTable.StandingsLists[0].DriverStandings
}

export async function getConstructorStandings() {
  const res = await fetch(`${BASE}/current/constructorStandings.json`)
  const data = await res.json()
  return data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
}

export async function getLastRaceResults() {
  const res = await fetch(`${BASE}/current/last/results.json`)
  const data = await res.json()
  return data.MRData.RaceTable.Races[0]
}

export async function getDriverInfo(driverId) {
  const res = await fetch(`${BASE}/drivers/${driverId}.json`)
  const data = await res.json()
  return data.MRData.DriverTable.Drivers[0]
}

export async function getDriverSeasons(driverId) {
  const res = await fetch(`${BASE}/drivers/${driverId}/seasons.json`)
  const data = await res.json()
  return data.MRData.SeasonTable.Seasons
}