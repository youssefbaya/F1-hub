async function getJson(url) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return res.json()
}

export async function getStandings() {
  return getJson('/api/standings')
}

export async function getSchedule() {
  return getJson('/api/schedule')
}