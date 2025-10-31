
const BASE_URL = 'http://192.168.0.5:8000'


export async function get(url) {
    const res = await fetch(`${BASE_URL}${url}`)
    if (!res.ok) {
        console.error(`Error al recuperar ${url}`)
        return false
    }
    const data = await res.json()
    return data
}

export async function post(url, body) {
    const res = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        console.error(`Error al llamar ${url}`)
        return false
    }
    const data = await res.json()
    return data
}