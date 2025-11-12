import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import '../utils/numberToMoney'
import { numberToMoney } from "../utils/numberToMoney"
import ProductoCarrito from "../components/ProductoCarrito"


export default function Success() {
    const location = useLocation()
    const [orden, setOrden] = useState(null)

    useEffect(() => {
        if (location?.state?.orden) {
            console.log(location.state)
            setOrden(location.state.orden)
        }
    }, [])

    useEffect(() => {
        if (orden) {
            const formatter = new Intl.DateTimeFormat('es-MX', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        }
    }, [orden])

    const unixToDate = (timestamp) => {
        const formatter = new Intl.DateTimeFormat('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        return formatter.format(new Date(timestamp))
    }

    return orden ? (
        <main className="container-fluid" onClick={() => console.log(orden)}>
            <div className="text-center d-flex flex-column align-items-center p-5">
                <h2>Orden creada de manera exitosa</h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24"><g fill="none"><path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" /><path d="M12 18a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4" /><path stroke="currentColor" strokeLinecap="square" strokeWidth="2" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10Z" /><path stroke="currentColor" strokeLinecap="square" strokeWidth="2" d="M8 9v2m8-2v2m0 3a4 4 0 0 1-8 0z" /></g></svg>

                <p><strong>ID:</strong> {orden.id}</p>
                <p><strong>Número de orden:</strong> {orden.numero}</p>
                <p><strong>Nombre:</strong> {orden.nombre_cliente}</p>
                <p><strong>Total:</strong> {numberToMoney(orden.total)}</p>
                <p><strong>Fecha:</strong> {unixToDate(orden.fecha)}</p>

                <span>Te llamaremos cuando tu orden esté lista</span>

                <hr />
                Tus pedidos:
                {orden.pedidos.map(pedido => (
                    <ProductoCarrito key={pedido.id} wrapper={pedido}></ProductoCarrito>
                ))}
            </div>

        </main>
    ) : null
}
