const BASE = 'https://api.openf1.org/v1'

export async function getLatestSession() {
  const res = await fetch(`${BASE}/sessions?session_key=latest`)
  return await res.json()
}

export async function getDriverPositions(sessionKey) {
  const res = await fetch(`${BASE}/position?session_key=${sessionKey}`)
  return await res.json()
}

export async function getPitStops(sessionKey) {
  const res = await fetch(`${BASE}/pit?session_key=${sessionKey}`)
  return await res.json()
}

export async function getWeather(sessionKey) {
  const res = await fetch(`${BASE}/weather?session_key=${sessionKey}`)
  return await res.json()
}

export async function getCarData(sessionKey, driverNumber) {
  const res = await fetch(`${BASE}/car_data?session_key=${sessionKey}&driver_number=${driverNumber}`)
  return await res.json()
}