import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import '../utils/numberToMoney'
import { numberToMoney } from "../utils/numberToMoney"
import ProductoCarrito from "../components/ProductoCarrito"


export default function Success() {
    const location = useLocation()
    const [orden, setOrden] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (location?.state?.orden) {
            console.log(location.state)
            setOrden(location.state.orden)
        }
    }, [])

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
        <main className="min-vh-100 bg-light py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                            <div className="bg-dark text-white text-center py-4" style={{ background: 'linear-gradient(nulldeg,rgba(155, 167, 222, 1) 50%, rgba(2, 4, 26, 1) 58%)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24" className="mb-3">
                                    <g fill="none">
                                        <path fill="transparent" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" opacity="0.3" />
                                        <path stroke="currentColor" strokeLinecap="square" strokeWidth="2" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10Z" />
                                        <path stroke="currentColor" strokeLinecap="square" strokeWidth="2" d="M8 9v2m8-2v2m0 3a4 4 0 0 1-8 0z" />
                                    </g>
                                </svg>
                                <h2 className="fw-bold mb-2">¡Orden Confirmada!</h2>
                                <p className="mb-0 opacity-90">Tu pedido ha sido enviado a cocina</p>
                            </div>

                            <div className="card-body p-4">
                                <div className="bg-light rounded-3 p-4 mb-4">
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <small className="text-muted d-block mb-1">Orden #</small>
                                            <strong className="fs-5 text-success">{orden.numero}</strong>
                                        </div>
                                        <div className="col-6 text-end">
                                            <small className="text-muted d-block mb-1">Total</small>
                                            <strong className="fs-5 text-dark">{numberToMoney(orden.total)}</strong>
                                        </div>
                                        <div className="col-12">
                                            <hr className="my-2" />
                                        </div>
                                        <div className="col-12">
                                            <small className="text-muted d-block mb-1">Cliente</small>
                                            <strong className="d-block">{orden.nombre_cliente}</strong>
                                        </div>
                                        <div className="col-12">
                                            <small className="text-muted d-block mb-1">Fecha y hora</small>
                                            <span className="text-dark">{unixToDate(orden.fecha)}</span>
                                        </div>
                                        <div className="col-12">
                                            <small className="text-muted d-block mb-1">ID de orden</small>
                                            <code className="text-secondary">{orden.id}</code>
                                        </div>
                                    </div>
                                </div>

                                <div className="alert alert-info border-0 rounded-3 mb-4 d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="me-2 flex-shrink-0">
                                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z" />
                                    </svg>
                                    <span>Te llamaremos cuando tu orden esté lista</span>
                                </div>

                                <div>
                                    <h5 className="fw-bold mb-3 pb-2 border-bottom">Detalle del pedido</h5>
                                    <div className="d-flex flex-column gap-2">
                                        {orden.pedidos.map(pedido => (
                                            <ProductoCarrito key={pedido.id} wrapper={pedido} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <button
                                className="btn btn-outline-dark fw-bold rounded-pill px-4"
                                onClick={() => navigate('/')}
                            >
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    ) : null
}