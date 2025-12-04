import React, { useEffect, useEffectEvent, useRef, useState } from 'react'
import Template from './Template'
import { useModal } from '../../context/ModalContext'
import { Button, Card, CardActionArea, CardContent, Collapse } from '@mui/material'
import { unixToDate } from '../../utils/unixToDate'
import AxiosInstance from '../../context/AuthContext'
import TestTemplate from '../TestTemplate'

export default function OrdenesEntregadas() {
    const [ordenes, setOrdenes] = useState([])

    useEffect(() => {
        fetchOrdenes()
    }, [])

    const fetchOrdenes = async () => {
        const response = await AxiosInstance.get('/api/ordenes')
        if (response) {
            console.log(response.data)
            console.log(response.data.filter(x => x.estado === 3))
            setOrdenes(response.data.filter(x => x.estado === 3) ?? [])

        }
    }

    return (
        <TestTemplate>
            <div className="container my-4">
                <h3 className="mb-3">Historial de Órdenes Entregadas</h3>

                {ordenes.length > 0 ? ordenes.map((orden) => (
                    <OrdenRow key={orden.id} orden={orden} onEstadoChange={() => fetchOrdenes()}></OrdenRow>
                )) :
                    <div className="card">
                        <div className="card-body">
                            <div className="text-center py-5">
                                <svg xmlns="http://www.w3.org/2000/svg" className='text-muted' width="5em" height="5em" viewBox="0 0 24 24">
                                    <g fill="none">
                                        <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" />
                                        <path d="M12 18a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4" />
                                        <path stroke="currentColor" strokeLinecap="square" strokeWidth="1.25" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10Z" />
                                        <path stroke="currentColor" strokeLinecap="square" strokeWidth="1.25" d="M8 9v2m8-2v2m0 3a4 4 0 0 1-8 0z" />
                                    </g>
                                </svg>
                                <p className="text-muted fs-5">No hay órdenes finalizadas</p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </TestTemplate>
        // <Template activeBtns={['terminadas']}>
        // </Template>
    )
}

function OrdenRow({ orden, onEstadoChange }) {
    const cardRef = useRef()
    const modal = useModal()
    const [open, setOpen] = useState(false)

    const patchOrden = useEffectEvent(async (estado) => {
        if (!orden || !orden.id) return
        const res = await AxiosInstance.patch(`/api/ordenes/${orden.id}/`, {
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
        <>
            <Card className="card shadow overflow-hidden border-start-1 border-top-0 border-bottom-0 border-end-0 border-5 border-dark">
                <CardActionArea ref={cardRef} onClick={() => setOpen(!open)} className='p-3 px-4 d-flex flex-column align-items-stretch'>
                    <h4 className="mb-2 text-muted">Orden #{orden.id}</h4>
                    <h5 className="mb-1"><strong>Cliente:</strong> {orden.nombre_cliente}</h5>
                    <h6 className="mb-1 text-muted">Fecha: {unixToDate(orden.fecha)}</h6>
                    <CardContent className={`${open ? 'p-2' : ' py-0'}`} sx={{ transition: "200ms" }}>
                        <Collapse in={open}>

                            <div className=" m-2 p-2 d-flex flex-column justify-content-between">

                                {orden.pedidos.map((pedido, index) => (
                                    <div key={pedido.id} className={`d-flex gap-3 ${index < orden.pedidos.length - 1 ? 'mb-3' : ''}  `}>
                                        <div className="flex-fill">
                                            <div className="d-flex justify-content-between">
                                                <strong className='fs-6'>{pedido.producto.nombre}</strong>
                                                <span className="badge bg-dark">x{pedido.cantidad}</span>
                                            </div>
                                            {pedido.opciones.length > 0 && (
                                                <div className="mt-1">
                                                    {pedido.opciones.map((opcion) => (
                                                        <small key={opcion.id} className="d-block text-muted">
                                                            • {opcion.descripcion}
                                                            {parseFloat(opcion.precio) > 0 && ` (+${opcion.precio})`}
                                                        </small>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                            </div>
                            <div className='d-flex justify-content-end' >
                                <Button component="div" variant="contained" color='success' onClick={(evt) => { evt.stopPropagation(); handleModal(2); }} >Devolver orden</Button>
                            </div>
                        </Collapse>
                    </CardContent>
                </CardActionArea>

            </Card>
        </>
    );
}
