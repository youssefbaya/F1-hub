const BASE = 'https://api.jolpi.ca/ergast/f1'

export const CURRENT_2026_STANDINGS = [
  { position: '1',  points: '72', wins: '2', Driver: { driverId: 'antonelli',     code: 'ANT', givenName: 'Kimi',      familyName: 'Antonelli',  permanentNumber: '12' }, Constructors: [{ name: 'Mercedes' }] },
  { position: '2',  points: '63', wins: '1', Driver: { driverId: 'russell',        code: 'RUS', givenName: 'George',    familyName: 'Russell',    permanentNumber: '63' }, Constructors: [{ name: 'Mercedes' }] },
  { position: '3',  points: '49', wins: '0', Driver: { driverId: 'leclerc',        code: 'LEC', givenName: 'Charles',   familyName: 'Leclerc',    permanentNumber: '16' }, Constructors: [{ name: 'Ferrari' }] },
  { position: '4',  points: '41', wins: '0', Driver: { driverId: 'hamilton',       code: 'HAM', givenName: 'Lewis',     familyName: 'Hamilton',   permanentNumber: '44' }, Constructors: [{ name: 'Ferrari' }] },
  { position: '5',  points: '25', wins: '0', Driver: { driverId: 'norris',         code: 'NOR', givenName: 'Lando',     familyName: 'Norris',     permanentNumber: '1'  }, Constructors: [{ name: 'McLaren' }] },
  { position: '6',  points: '21', wins: '0', Driver: { driverId: 'piastri',        code: 'PIA', givenName: 'Oscar',     familyName: 'Piastri',    permanentNumber: '81' }, Constructors: [{ name: 'McLaren' }] },
  { position: '7',  points: '17', wins: '0', Driver: { driverId: 'bearman',        code: 'BEA', givenName: 'Oliver',    familyName: 'Bearman',    permanentNumber: '87' }, Constructors: [{ name: 'Haas F1 Team' }] },
  { position: '8',  points: '15', wins: '0', Driver: { driverId: 'gasly',          code: 'GAS', givenName: 'Pierre',    familyName: 'Gasly',      permanentNumber: '10' }, Constructors: [{ name: 'Alpine F1 Team' }] },
  { position: '9',  points: '12', wins: '0', Driver: { driverId: 'max_verstappen', code: 'VER', givenName: 'Max',       familyName: 'Verstappen', permanentNumber: '3'  }, Constructors: [{ name: 'Red Bull' }] },
  { position: '10', points: '10', wins: '0', Driver: { driverId: 'lawson',         code: 'LAW', givenName: 'Liam',      familyName: 'Lawson',     permanentNumber: '30' }, Constructors: [{ name: 'Racing Bulls' }] },
  { position: '11', points: '4',  wins: '0', Driver: { driverId: 'lindblad',       code: 'LIN', givenName: 'Arvid',     familyName: 'Lindblad',   permanentNumber: '41' }, Constructors: [{ name: 'Racing Bulls' }] },
  { position: '12', points: '4',  wins: '0', Driver: { driverId: 'hadjar',         code: 'HAD', givenName: 'Isack',     familyName: 'Hadjar',     permanentNumber: '6'  }, Constructors: [{ name: 'Red Bull' }] },
  { position: '13', points: '2',  wins: '0', Driver: { driverId: 'bortoleto',      code: 'BOR', givenName: 'Gabriel',   familyName: 'Bortoleto',  permanentNumber: '5'  }, Constructors: [{ name: 'Audi' }] },
  { position: '14', points: '2',  wins: '0', Driver: { driverId: 'sainz',          code: 'SAI', givenName: 'Carlos',    familyName: 'Sainz',      permanentNumber: '55' }, Constructors: [{ name: 'Williams' }] },
  { position: '15', points: '1',  wins: '0', Driver: { driverId: 'colapinto',      code: 'COL', givenName: 'Franco',    familyName: 'Colapinto',  permanentNumber: '43' }, Constructors: [{ name: 'Alpine F1 Team' }] },
  { position: '16', points: '1',  wins: '0', Driver: { driverId: 'ocon',           code: 'OCO', givenName: 'Esteban',   familyName: 'Ocon',       permanentNumber: '31' }, Constructors: [{ name: 'Haas F1 Team' }] },
  { position: '17', points: '0',  wins: '0', Driver: { driverId: 'albon',          code: 'ALB', givenName: 'Alexander', familyName: 'Albon',      permanentNumber: '23' }, Constructors: [{ name: 'Williams' }] },
  { position: '18', points: '0',  wins: '0', Driver: { driverId: 'perez',          code: 'PER', givenName: 'Sergio',    familyName: 'Perez',      permanentNumber: '11' }, Constructors: [{ name: 'Cadillac' }] },
  { position: '19', points: '0',  wins: '0', Driver: { driverId: 'stroll',         code: 'STR', givenName: 'Lance',     familyName: 'Stroll',     permanentNumber: '18' }, Constructors: [{ name: 'Aston Martin' }] },
  { position: '20', points: '0',  wins: '0', Driver: { driverId: 'alonso',         code: 'ALO', givenName: 'Fernando',  familyName: 'Alonso',     permanentNumber: '14' }, Constructors: [{ name: 'Aston Martin' }] },
  { position: '21', points: '0',  wins: '0', Driver: { driverId: 'bottas',         code: 'BOT', givenName: 'Valtteri',  familyName: 'Bottas',     permanentNumber: '77' }, Constructors: [{ name: 'Cadillac' }] },
  { position: '22', points: '0',  wins: '0', Driver: { driverId: 'hulkenberg',     code: 'HUL', givenName: 'Nico',      familyName: 'Hulkenberg', permanentNumber: '27' }, Constructors: [{ name: 'Audi' }] },
]

export async function getDriverStandings() {
  try {
    const res = await fetch('/api/standings')
    if (res.ok) {
      const data = await res.json()
      if (data.standings?.length > 0) return data.standings
    }
  } catch(e) {}
  return CURRENT_2026_STANDINGS
}

export async function getConstructorStandings() {
  try {
    const res = await fetch(`${BASE}/current/constructorStandings.json`)
    if (res.ok) {
      const data = await res.json()
      const standings = data.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings
      if (standings && standings.length > 0) return standings
    }
  } catch(e) {}
  return []
}

export async function getNextRace() {
  try {
    const res = await fetch(`${BASE}/current/next.json`)
    if (res.ok) {
      const data = await res.json()
      return data.MRData.RaceTable.Races[0]
    }
  } catch(e) {}
  return null
}

export async function getLastRaceResults() {
  try {
    const res = await fetch(`${BASE}/current/last/results.json`)
    if (res.ok) {
      const data = await res.json()
      return data.MRData.RaceTable.Races[0]
    }
  } catch(e) {}
  return null
}

export async function getCurrentSeason() {
  try {
    const res = await fetch(`${BASE}/current/races.json?limit=30`)
    if (res.ok) {
      const data = await res.json()
      return data.MRData.RaceTable.Races
    }
  } catch(e) {}
  return []
}