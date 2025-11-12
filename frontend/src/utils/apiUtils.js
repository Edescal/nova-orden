
// const BASE_URL = 'http://192.168.0.5:8000'
const BASE_URL = 'http://127.0.0.1:8000'
// const BASE_URL = 'http://10.186.126.42:8000'


export async function get(url, json = true) {
    try {
        const FULL_URL = url.startsWith('http') ? url : `${BASE_URL}${url}`
        const response = await fetch(FULL_URL)
        if (response.status == 404) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
        }
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
        }
        if (!json) {
            return response
        }
        const results = await response.json()
        return results
    } catch (error) {
        console.log(`Error de la api: ${error}`)
        return false
    }
}

export async function post(url, body) {
    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function patch(url, body) {
     try {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return false
    }
}