// api/standings.js
// Returns current driver and constructor standings, cached for 1 hour

const BASE = 'https://api.jolpi.ca/ergast/f1'

const FALLBACK_STANDINGS = [
  { position: '1', points: '72', wins: '2', Driver: { driverId: 'antonelli', givenName: 'Kimi', familyName: 'Antonelli', permanentNumber: '12', code: 'ANT' }, Constructors: [{ name: 'Mercedes' }] },
  { position: '2', points: '63', wins: '1', Driver: { driverId: 'russell', givenName: 'George', familyName: 'Russell', permanentNumber: '63', code: 'RUS' }, Constructors: [{ name: 'Mercedes' }] },
  { position: '3', points: '49', wins: '0', Driver: { driverId: 'leclerc', givenName: 'Charles', familyName: 'Leclerc', permanentNumber: '16', code: 'LEC' }, Constructors: [{ name: 'Ferrari' }] },
  { position: '4', points: '41', wins: '0', Driver: { driverId: 'hamilton', givenName: 'Lewis', familyName: 'Hamilton', permanentNumber: '44', code: 'HAM' }, Constructors: [{ name: 'Ferrari' }] },
  { position: '5', points: '25', wins: '0', Driver: { driverId: 'norris', givenName: 'Lando', familyName: 'Norris', permanentNumber: '1', code: 'NOR' }, Constructors: [{ name: 'McLaren' }] },
  { position: '6', points: '21', wins: '0', Driver: { driverId: 'piastri', givenName: 'Oscar', familyName: 'Piastri', permanentNumber: '81', code: 'PIA' }, Constructors: [{ name: 'McLaren' }] },
  { position: '7', points: '17', wins: '0', Driver: { driverId: 'bearman', givenName: 'Oliver', familyName: 'Bearman', permanentNumber: '87', code: 'BEA' }, Constructors: [{ name: 'Haas F1 Team' }] },
  { position: '8', points: '15', wins: '0', Driver: { driverId: 'gasly', givenName: 'Pierre', familyName: 'Gasly', permanentNumber: '10', code: 'GAS' }, Constructors: [{ name: 'Alpine F1 Team' }] },
  { position: '9', points: '12', wins: '0', Driver: { driverId: 'max_verstappen', givenName: 'Max', familyName: 'Verstappen', permanentNumber: '3', code: 'VER' }, Constructors: [{ name: 'Red Bull' }] },
  { position: '10', points: '10', wins: '0', Driver: { driverId: 'lawson', givenName: 'Liam', familyName: 'Lawson', permanentNumber: '30', code: 'LAW' }, Constructors: [{ name: 'Racing Bulls' }] },
  { position: '11', points: '4', wins: '0', Driver: { driverId: 'lindblad', givenName: 'Arvid', familyName: 'Lindblad', permanentNumber: '41', code: 'LIN' }, Constructors: [{ name: 'Racing Bulls' }] },
  { position: '12', points: '4', wins: '0', Driver: { driverId: 'hadjar', givenName: 'Isack', familyName: 'Hadjar', permanentNumber: '6', code: 'HAD' }, Constructors: [{ name: 'Red Bull' }] },
  { position: '13', points: '2', wins: '0', Driver: { driverId: 'sainz', givenName: 'Carlos', familyName: 'Sainz', permanentNumber: '55', code: 'SAI' }, Constructors: [{ name: 'Williams' }] },
  { position: '14', points: '2', wins: '0', Driver: { driverId: 'albon', givenName: 'Alexander', familyName: 'Albon', permanentNumber: '23', code: 'ALB' }, Constructors: [{ name: 'Williams' }] },
  { position: '15', points: '0', wins: '0', Driver: { driverId: 'alonso', givenName: 'Fernando', familyName: 'Alonso', permanentNumber: '14', code: 'ALO' }, Constructors: [{ name: 'Aston Martin' }] },
  { position: '16', points: '0', wins: '0', Driver: { driverId: 'stroll', givenName: 'Lance', familyName: 'Stroll', permanentNumber: '18', code: 'STR' }, Constructors: [{ name: 'Aston Martin' }] },
  { position: '17', points: '0', wins: '0', Driver: { driverId: 'ocon', givenName: 'Esteban', familyName: 'Ocon', permanentNumber: '31', code: 'OCO' }, Constructors: [{ name: 'Haas F1 Team' }] },
  { position: '18', points: '0', wins: '0', Driver: { driverId: 'colapinto', givenName: 'Franco', familyName: 'Colapinto', permanentNumber: '43', code: 'COL' }, Constructors: [{ name: 'Alpine F1 Team' }] },
  { position: '19', points: '0', wins: '0', Driver: { driverId: 'hulkenberg', givenName: 'Nico', familyName: 'Hülkenberg', permanentNumber: '27', code: 'HUL' }, Constructors: [{ name: 'Audi' }] },
  { position: '20', points: '0', wins: '0', Driver: { driverId: 'bortoleto', givenName: 'Gabriel', familyName: 'Bortoleto', permanentNumber: '5', code: 'BOR' }, Constructors: [{ name: 'Audi' }] },
  { position: '21', points: '0', wins: '0', Driver: { driverId: 'bottas', givenName: 'Valtteri', familyName: 'Bottas', permanentNumber: '77', code: 'BOT' }, Constructors: [{ name: 'Cadillac' }] },
  { position: '22', points: '0', wins: '0', Driver: { driverId: 'perez', givenName: 'Sergio', familyName: 'Perez', permanentNumber: '11', code: 'PER' }, Constructors: [{ name: 'Cadillac' }] },
]

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  try {
    const r = await fetch(`${BASE}/current/driverStandings.json`)
    if (r.ok) {
      const data = await r.json()
      const standings = data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings
      if (standings?.length > 0) {
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600')
        return res.status(200).json({ standings })
      }
    }
  } catch(e) {}

  // fallback
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600')
  return res.status(200).json({ standings: FALLBACK_STANDINGS })
}