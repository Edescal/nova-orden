import React from 'react'
import AxiosInstance, { useAuth } from '../context/AuthContext'
import FormProducto from '../components/formularios/FormProducto'
import { Dialog } from '@mui/material'

export default function Test() {

    const auth = useAuth()

    const handleWhoAmI = () => {
        (async () => {
            const res = await auth.whoami()
            if (res) {
                console.log(res)
            }
        })()
    }

    const handleSubmit = async ()=>{
        const res = await AxiosInstance.post('/api/productos', {

        })
        if (res) {
            console.log(res)
        }

    }

    return (
        <div>
            <button onClick={handleWhoAmI}>PUTAAA</button>
            <Dialog open>
            <FormProducto onSubmit={handleSubmit} type='crear'>

            </FormProducto>
            </Dialog>
        </div>
    )
}
