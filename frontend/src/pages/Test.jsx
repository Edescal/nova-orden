import { useEffect, useState } from 'react'
import AxiosInstance, { useAuth } from '../context/AuthContext'
import SelectProducto from '../components/SelectProducto'

export default function Test() {
    const [open, setOpen] = useState(false)
    const [producto, setProducto] = useState(null)
    const auth = useAuth()

    const handleWhoAmI = () => {
        (async () => {
            const res = await auth.whoami()
            if (res) {
                console.log(res.data)
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

    return (
        <div>
            <button onClick={() => { handleWhoAmI(); setOpen(true) }}>PUTAAA</button>

            <SelectProducto producto={producto} open={open} onClose={() => setOpen(false)} />
        </div>
    )
}
