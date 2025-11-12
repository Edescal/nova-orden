import Cookies from 'universal-cookie'
import axios from 'axios'

axios.defaults.withCredentials = true

export async function getCSRFToken() {
    try {
        const response = await fetch("http://localhost:8000/api/csrf/", {
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        })

        const cookies = new Cookies()
        console.log(cookies)

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
        }
        return response.headers.get("X-CSRFToken")
    } catch (error) {
        console.warn(error)
        return false
    }
}

export async function getSession() {
    try {
        const response = await fetch("http://localhost:8000/api/session/", {
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!response.ok) {
            throw new Error('No se pudo recuperar una sesión válida...')
        }
        return response.json()
    } catch (error) {
        console.warn(error)
        return false
    }
}

export async function login(username, password) {
    try {
        const response = await fetch("http://localhost:8000/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify({ 'username': username, 'password': password }),
        })
        return response
    } catch (error) {
        console.warn(error)
        return false
    }
}

export async function logout(csrf_token) {
    try {
        const response = await fetch("http://localhost:8000/api/logout/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrf_token,
            },
            credentials: "include",
        })
        return await response
    } catch (error) {
        console.warn(error)
        return false
    }
}

