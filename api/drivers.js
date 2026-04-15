const BASE = 'https://api.jolpi.ca/ergast/f1'

const FALLBACK_DRIVERS = [
  'max_verstappen',
  'norris',
  'piastri',
  'leclerc',
  'hamilton',
  'russell',
  'antonelli',
  'alonso',
  'stroll',
  'gasly',
  'ocon',
  'albon',
  'sainz',
  'hulkenberg',
  'bottas',
  'perez',
  'vettel',
  'rosberg',
  'raikkonen',
  'massa',
  'button',
  'webber',
  'schumacher',
  'senna',
  'prost',
]

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
      await sleep(400)
    }
  }
  return null
}

function normalizeDriver(driver) {
  return {
    driverId: driver.driverId,
    permanentNumber: driver.permanentNumber || null,
    code: driver.code || null,
    givenName: driver.givenName,
    familyName: driver.familyName,
    dateOfBirth: driver.dateOfBirth || null,
    nationality: driver.nationality || null,
    url: driver.url || null,
  }
}

function sortDrivers(drivers) {
  return [...drivers].sort((a, b) => {
    const last = a.familyName.localeCompare(b.familyName)
    if (last !== 0) return last
    return a.givenName.localeCompare(b.givenName)
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const activeOnly = req.query.active === 'true'

  try {
    if (activeOnly) {
      const data = await fetchJSON(`${BASE}/current/drivers.json?limit=100`)
      const drivers = data?.MRData?.DriverTable?.Drivers || []

      if (drivers.length > 0) {
        const normalized = sortDrivers(drivers.map(normalizeDriver))
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600')
        return res.status(200).json({ drivers: normalized })
      }
    }

    const allData = await fetchJSON(`${BASE}/drivers.json?limit=1000`)
    const allDrivers = allData?.MRData?.DriverTable?.Drivers || []

    if (allDrivers.length > 0) {
      const normalized = sortDrivers(allDrivers.map(normalizeDriver))
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
      return res.status(200).json({ drivers: normalized })
    }
  } catch (e) {}

  const fallbackDrivers = []

  for (const id of FALLBACK_DRIVERS) {
    const data = await fetchJSON(`${BASE}/drivers/${id}.json`)
    const driver = data?.MRData?.DriverTable?.Drivers?.[0]
    if (driver) fallbackDrivers.push(normalizeDriver(driver))
  }

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
  return res.status(200).json({ drivers: sortDrivers(fallbackDrivers) })
}