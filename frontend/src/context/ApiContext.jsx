import { createContext, useContext } from "react";

const ApiContext = createContext()
export const useApi = () => useContext(ApiContext)

export const ApiProvider = ({ children }) => {
    const BASE_URL = 'http://192.168.0.5:8000'

    const apiProductos = async () => {
        const res = await fetch(`${BASE_URL}/api/productos/`)
        if (!res.ok) {
            throw new Error('Error al recuperar productos')
        }
        const data = await res.json()
        return data
    }
    const apiPostWrappers = async () => {
        const res = await fetch(`${BASE_URL}/api/productos/`)
        if (!res.ok) {
            throw new Error('Error al recuperar productos')
        }
        const data = await res.json()
        return data
    }

    value = {
        getProductos: () => apiProductos(),
        enqueueProductos: () => apiPostWrappers()
    }
    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    )
}