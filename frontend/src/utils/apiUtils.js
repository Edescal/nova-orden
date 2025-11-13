

export async function get(url, json = true) {
    try {
        const FULL_URL = url.startsWith('http') ? url : `${import.meta.env.VITE_BASE_URL}${url}`
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
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}${url}`, {
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
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}${url}`, {
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

export async function put(url, body, setMultiform = false) {
    try {
        const headers = setMultiform ? {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*'
        } : { 
            'Content-Type': 'application/json' 
        }
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}${url}`, {
            method: 'PUT',
            headers: headers, 
            body: setMultiform ? body : JSON.stringify(body)
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