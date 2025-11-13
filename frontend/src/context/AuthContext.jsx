import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => localStorage.getItem('access') ?? null) 

    const login = async (username, password) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/token/`, {
                'username': username,
                'password': password,
            })

            if (res.status == 200) {
                localStorage.setItem('access', res.data.access)
                localStorage.setItem('refresh', res.data.refresh)
                const userData = jwtDecode(res.data.access)
                setUser(userData)
                return userData
            }
        } catch (error) {
            console.error(error);
        }
        return false
    }

    const logout = async () => {
        try {
            const access = localStorage.getItem('access') ?? false
            const refresh = localStorage.getItem('refresh') ?? false

            if (!(access && refresh)) {
                console.log('No haz iniciado sesión')
                return
            }

            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/logout/`, {
                refresh: refresh,
            }, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })

            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            setUser(null)

            if (res.status == 200) {
                return res
            }
        } catch (error) {
            console.error(error);
        }
        return false
    }

    const whoami = async () => {
        const access = localStorage.getItem('access') ?? false
        if (!access) {
            console.log('No haz iniciado sesión')
            return
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/whoami/`, {}, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            if (res.status === 200) {
                return res
            }
        } catch (error) {
            console.error(error);
        }
        return false
    }

    const value = useMemo(() => ({
        user,
        login,
        logout,
        whoami,

    }), [user])


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
