import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export async function getCSRFToken() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/csrf/", {
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        })

        
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
        const response = await fetch("http://127.0.0.1:8000/api/session/", {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response
    } catch (error) {
        console.warn(error)
        return false
    }
}

export async function login(username, password, csrf_token) {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrf_token,
            },
            credentials: "include",
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
        const response = await fetch("http://127.0.0.1:8000/api/logout/", {
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

