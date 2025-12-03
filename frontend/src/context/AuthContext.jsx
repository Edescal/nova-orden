import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { createContext, useContext, useMemo, useState } from 'react'

const URL_BASE = import.meta.env.VITE_DEV
    ? import.meta.env.VITE_BASE_URL
    : ''

const AxiosInstance = axios.create({
    baseURL: URL_BASE,
    withCredentials: true,
    withXSRFToken: true,
})

AxiosInstance.interceptors.request.use(
    config => {
        console.log('Interceptando request...')
        const access = localStorage.getItem('access') ?? 'nothing'
        if (access) {
            config.headers['Authorization'] = `Bearer ${access}`
        }
        return config
    },
    error => {
        console.error(`Request error::${error}`)
        return Promise.reject(error)
    }
)

AxiosInstance.interceptors.response.use(
    res => {
        console.log('Interceptando respuesta...')
        return res
    },
    async error => {
        if (error.response && error.response.status === 401) {
            try {

                const refreshRes = await axios.post(`${URL_BASE}/api/refresh/`, {
                    refresh: localStorage.getItem("refresh"),
                })

                console.log(refreshRes);
                if (refreshRes.status === 200) {
                    localStorage.setItem('access', refreshRes.data.access)
                    localStorage.setItem('refresh', refreshRes.data.refresh)
                }
                
                const newToken = refreshRes.data.access;

                const originalRequest = error.config;
                originalRequest.headers = originalRequest.headers || {}
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`

                return await axios(originalRequest)
            } catch (refreshError) {
                console.log('Falló el intento de refresh')
                console.log(refreshError);
                localStorage.clear()
                return await Promise.reject(refreshError);
            }
        }
        return await Promise.reject(error);

    }
)

export default AxiosInstance

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [access, setAccess] = useState(() => localStorage.getItem('access') ?? null)

    const login = async (username, password) => {
        try {
            const res = await AxiosInstance.post('/api/token/', {
                'username': username,
                'password': password,
            })

            if (res.status == 200) {
                localStorage.setItem('access', res.data.access)
                localStorage.setItem('refresh', res.data.refresh)
                const accessToken = jwtDecode(res.data.access)
                setAccess(accessToken)
                return accessToken
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
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                return
            }

            const res = await AxiosInstance.post(`/api/logout/`, {
                refresh: refresh,
            })

            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            setAccess(null)

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
            return false
        }

        try {
            const res = await AxiosInstance.post(`/api/whoami/`, {})
            if (res.status === 200) {
                return res
            }
        } catch (error) {
            console.log('Error al intentar ver la sesión')
            console.error(error.message);
        }
        return false
    }

    const value = useMemo(() => ({
        user: access,
        login,
        logout,
        whoami,

    }), [access])


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
