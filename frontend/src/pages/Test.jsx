import React, { useEffect, useState } from 'react'
import AxiosInstance, { useAuth } from '../context/AuthContext'
import FormProducto from '../components/formularios/FormProducto'
import { Dialog } from '@mui/material'
import SelectProducto from '../components/SelectProducto'

export default function Test() {
    const [producto, setProducto] = useState(null)
    const auth = useAuth()

    const handleWhoAmI = () => {
        (async () => {
            const res = await auth.whoami()
            if (res) {
                console.log(res)
            }
        })()
    }

    useEffect(() => {
        (async () => {
            const res = await AxiosInstance.get('/api/productos/1/')
            if (res) {
                console.log(res)
                setProducto(res.data)
            }
        })()
    }, [])

    const handleSubmit = async (data) => {
        if (producto) {
            console.log(producto)
            const res = await AxiosInstance.put(`api/productos/${producto.id}/`, data)
            console.log(res)
            return

        }
        const res = await AxiosInstance.post('/api/productos/', data)
        if (res) {
            console.log(res)
        }
    }

    return (
        <div>
            <button onClick={handleWhoAmI}>PUTAAA</button>
            <Dialog>
                <FormProducto producto={producto} onSubmit={handleSubmit} />
            </Dialog>

            <SelectProducto producto={producto} >

            </SelectProducto>
        </div>
    )
}
