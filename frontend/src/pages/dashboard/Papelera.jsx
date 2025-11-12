import { Box, Button, ButtonBase } from '@mui/material'

import React, { useEffect, useEffectEvent, useRef, useState } from 'react'
import { get, patch } from '../../utils/apiUtils';
import { useModal } from '../../context/ModalContext';
import Template from './Template';

export default function Papelera() {
    const [ordenesEliminadas, setCanceladas] = useState([])
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        fetchOrdenes()
    }, [])

    const fetchOrdenes = async () => {
        const data = await get('/api/ordenes/')
        if (data) {

            setCanceladas(data.results.filter(orden => orden.estado === 4))
        }
    }

    useEffect(() => {
        console.log(ordenesEliminadas)
    }, [ordenesEliminadas])


    return (
        <Template>
            <div className="row g-4">

                <div className="col-12 col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            {ordenesEliminadas.length > 0 ? (
                                <div className="row">
                                    {ordenesEliminadas.map(orden => (
                                        <div key={orden.id} className="col-12 col-md-6 col-lg-4">
                                            <OrdenEliminadaCard
                                                orden={orden}
                                                onRestore={null}
                                                onDeletePermanent={null}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24" className="text-muted mb-3">
                                        <path fill="currentColor" d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9M7 6h10v13H7V6m2 2v9h2V8H9m4 0v9h2V8h-2Z" />
                                    </svg>
                                    <p className="text-muted fs-5">No hay órdenes eliminadas</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

        </Template>

    )
}

const OrdenEliminadaCard = ({ orden, onRestore, onDeletePermanent }) => {
    const modal = useModal()

    const cardRef = useRef()

    const patchOrden = useEffectEvent(async () => {
        const res = await patch(`/api/ordenes/${orden.id}/`, {
            "estado": 0
        })
        if (res) {
            if (cardRef.current) {
                cardRef.current.classList.add('card-close')
                setTimeout(() => {
                    onRestore?.()
                }, 500)
            }
        }
    })

    const onRestaurar = () => {
        modal.confirm(
            <div className="text-center">
                <p className="mb-3">¿Quieres actualizar el <strong>estado</strong> de la orden?</p>
            </div>,
            async () => patchOrden()
        )
    }

    return (
        <div ref={cardRef} className="card mb-3 shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className='w-100'>
                        <h6 className="card-subtitle mb-2 text-muted">Orden #{orden.id}</h6>
                        <p className="card-text mb-1"><strong>Cliente:</strong> {orden.nombre_cliente}</p>
                        {orden.pedidos.map(item => (
                            <div className='m-2 p-2 d-flex flex-row justify-content-between card bg-body-secondary  shadow-sm border-start-1 border-top-0 border-bottom-0 border-end-0 border-5 border-black'>
                                <div className='d-flex flex-column'>
                                    <span className="mb-1 fw-bold">{item.producto.nombre}</span>
                                    <small className="text-muted mb-2 small">{item.producto.descripcion}</small>
                                </div>
                                <div className="text-end ms-3">
                                    <small className="badge bg-dark mb-1">x{item.cantidad}</small>
                                    <div className="fw-bold">${item.subtotal}</div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                    <button
                        className="btn btn-primary text-white fw-semibold"
                        onClick={() => onRestaurar()}
                    >
                        Restaurar
                    </button>
                    {/* <button
                        className="btn btn-danger text-white fw-semibold"
                        onClick={() => onDeletePermanent(orden.id)}
                    >
                        Eliminar definitivamente
                    </button> */}
                </div>
            </div>
        </div>
    );
};