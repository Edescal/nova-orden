import React, { useEffect, useEffectEvent, useRef, useState } from 'react'
import Template from './Template'
import { get, patch } from '../../utils/apiUtils'
import { useModal } from '../../context/ModalContext'

export default function OrdenesEntregadas() {
    const [ordenes, setOrdenes] = useState([])

    useEffect(() => {
        fetchOrdenes()
    }, [])
    
    const fetchOrdenes = async() => {
        const data = await get('/api/ordenes')
        if (data) {
            setOrdenes(data.results.filter(x => x.estado === 3))
    
        }
    }

    useEffect(() => {
        console.log(ordenes)
    }, [ordenes])

    return (
        <Template>
            <main className="container my-4">
                <h3 className="mb-3">Historial de Órdenes Entregadas</h3>

                {ordenes.map((orden) => (
                    <OrdenRow key={orden.id} orden={orden} onEstadoChange={() => fetchOrdenes()}></OrdenRow>
                ))}
            </main>
        </Template>
    )
}

function OrdenRow({ orden, onEstadoChange }) {
    const cardRef = useRef()
    const modal = useModal()

    const patchOrden = useEffectEvent(async (estado) => {
        if (!orden || !orden.id) return
        const res = await patch(`/api/ordenes/${orden.id}/`, {
            "estado": estado
        })
        if (res) {
            if (cardRef.current) {
                cardRef.current.classList.add('card-close')
                setTimeout(() => {
                    onEstadoChange?.()
                }, 500)
            }
        }
    })

    const handleModal = (nextState) => {
        console.log(`Nuevo estado: ${nextState}`)
        modal.confirm((
            <div className="text-center">
                <p className="mb-3">Esta opción hace que la orden aparezca nuevamente en el <strong>tablero</strong> como orden lista para entregar. ¿Deseas continuar?</p>
            </div>),
            async () => patchOrden(nextState),
        )
    }

    return (
        <div ref={cardRef} className="card mb-3 shadow-sm overflow-hidden border-start-1 border-top-0 border-bottom-0 border-end-0 border-5 border-dark">
            <div className="card-header bg-body-secondary d-flex justify-content-between align-items-center">
                <div>
                    <h6 className="fw-bold mb-0">Orden #{orden.id}</h6>
                    <small className="text-muted">Cliente: {orden.nombre_cliente}</small>
                </div>
            </div>

            <div className="card-body">
                <table className="table table-borderless align-middle mb-0">
                    <thead>
                        <tr className="text-muted small">
                            <th>Producto</th>
                            <th className="text-center">Cant.</th>
                            <th className="text-end">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orden.pedidos.map((item, index) => (
                            <tr key={index} className="border-top">
                                <td>
                                    <div className="fw-semibold">{item.producto.nombre}</div>
                                    <small className="text-muted">{item.producto.descripcion}</small>
                                </td>
                                <td className="text-center">
                                    <span className="badge bg-dark">x{item.cantidad}</span>
                                </td>
                                <td className="text-end fw-bold">${item.subtotal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orden.nota && (
                    <div className="mt-3 p-2 border-start border-3 border-dark small bg-body-tertiary">
                        <strong>Nota:</strong> {orden.nota}
                    </div>
                )}
            </div>


            <div className="card-footer bg-white d-flex justify-content-end gap-2">
                <button
                    className="btn btn-success fw-semibold"
                    onClick={() => handleModal(2)}
                >
                    Devolver al tablero
                </button>
            </div>
        </div>
    );
}
