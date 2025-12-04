import { Box, Button, ButtonBase, Card, CardActionArea, CardContent, CardHeader, Collapse } from '@mui/material'

import React, { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useModal } from '../../context/ModalContext';
import Template from './Template';
import { unixToDate } from '../../utils/unixToDate';
import AxiosInstance from '../../context/AuthContext';
import TestTemplate from '../TestTemplate';

export default function Papelera() {
    const [ordenesEliminadas, setCanceladas] = useState([])
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        fetchOrdenes()
    }, [])

    const fetchOrdenes = async () => {
        const response = await AxiosInstance.get('/api/ordenes/')
        if (response) {
            setCanceladas(response.data.filter(orden => orden.estado === 4))
        }
    }

    useEffect(() => {
        console.log(ordenesEliminadas)
    }, [ordenesEliminadas])


    return (
        <TestTemplate>
            <div className="container my-4">
                <h3 className="mb-3">Historial de Órdenes Eliminadas</h3>
                <div className="row">
                    <div className="col-12 col-lg-12">
                        {ordenesEliminadas.length > 0 ? (
                            ordenesEliminadas.map(orden => (
                                <div key={orden.id} className="col-12 col-md-6 col-lg-12 mb-3">
                                    <OrdenEliminadaCard
                                        orden={orden}
                                        onRestore={null}
                                        onDeletePermanent={null}
                                    />
                                </div>
                            ))) : (
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
        </TestTemplate>
        // <Template activeBtns={['papelera']}>
        // </Template>
    )
}

const OrdenEliminadaCard = ({ orden, onRestore, onDeletePermanent }) => {
    const modal = useModal()
    const [open, setOpen] = useState(false)
    const cardRef = useRef()

    const patchOrden = useEffectEvent(async () => {
        const response = await AxiosInstance.patch(`/api/ordenes/${orden.id}/`, {
            "estado": 0
        })
        if (response) {
            if (cardRef.current) {
                cardRef.current.classList.add('card-close')
                setTimeout(() => {
                    onRestore?.()
                }, 500)
            }
        }
    })

    const onRestaurar = (evt) => {
        evt.stopPropagation()
        modal.confirm(
            <div className="text-center">
                <p className="mb-3">¿Quieres actualizar el <strong>estado</strong> de la orden?</p>
            </div>,
            async () => patchOrden()
        )
    }

    const cardActionHandler = (evt) => {
        setOpen(!open)
    }

    return (
        <Card className="card shadow overflow-hidden border-start-1 border-top-0 border-bottom-0 border-end-0 border-5 border-dark">
            <CardActionArea ref={cardRef} onClick={cardActionHandler} className='p-3 px-4 d-flex flex-column align-items-stretch'>
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
                            <Button component="div" variant="contained" color='error' onClick={onRestaurar} >Restaurar orden</Button>
                        </div>
                    </Collapse>
                </CardContent>
            </CardActionArea>

        </Card>
    );
};