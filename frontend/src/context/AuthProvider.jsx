import { red } from '@mui/material/colors'
import React, { createContext, useContext, useEffect, useMemo } from 'react'

const AuthContext = createContext()

const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    // const [token, setToken] = useState(null)
    // const [access, setAccess] = useState(null)
    // const [csrf, setCSRF] = useState(null)

    const BASE_URL = 'http://127.0.0.1:8000'

    useEffect(()=>{
        (async () => {
            // const response = 
        })()
    }, [])

    const getCSRF = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrf_token,
            },
            credentials: "include",
            body: JSON.stringify({ 'username': username, 'password': password }),
        })
        if (response) {
            return 
        }
    }


    const value = {
        // token: token,
        // access: access,
        getCSRF: getCSRF
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
