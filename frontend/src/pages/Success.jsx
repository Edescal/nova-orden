import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function Success() {
    const location = useLocation()
    const [orden, setOrden] = useState(null)

    useEffect(()=>{
        if (location?.state?.orden) {
            console.log(location.state.orden)
            setOrden(orden)
        } 

    }, [])

    return (
        <main className="container-fluid">
            <h2>Orden creada de manera exitosa</h2>
            <p>

            </p>
            
        </main>
    )
}
