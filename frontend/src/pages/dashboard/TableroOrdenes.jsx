import React, { useEffect, useState } from 'react'
import { get } from '../../utils/apiUtils'
import OrdenCard from './OrdenCard'

export default function TableroOrdenes() {
    const [recibidas, setRecibidas] = useState([])
    const [enProceso, setEnProceso] = useState([])
    const [listas, setListas] = useState([])

    useEffect(() => {
        fetchOrdenes();
    }, [])

    const fetchOrdenes = async () => {
        const data = await get('/api/ordenes/')
        if (data) {

            setRecibidas(data.results.filter(orden => orden.estado === 0))
            setEnProceso(data.results.filter(orden => orden.estado === 1))
            setListas(data.results.filter(orden => orden.estado === 2))
        }
    }

    const cardStyle = {
        minHeight: "800px"
    }

    return (
        <div className="row g-4">
            <h3 className="mb-3">Tablero de pedidos</h3>

            <div className="col-12 col-lg-4">
                <div className="ca rd" style={cardStyle}>
                    <div className="card-body">
                        <h5 className="card-title mb-3">Pedidos recibidas</h5>
                        <div className="rounded">
                            {recibidas ? recibidas.map(orden => (
                                <OrdenCard key={orden.id} orden={orden} onUpdate={() => fetchOrdenes()}

                                    prevParam={{
                                        btnClass: 'btn btn-primary fw-semibold',
                                        btnText: 'En proceso',
                                        nextState: 1
                                    }}

                                />
                            )) : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-4">
                <div className="ca rd" style={cardStyle}>
                    <div className="card-body">
                        <h5 className="card-title mb-3">Pedidos en proceso</h5>
                        <div className="rounded">
                            {enProceso ? enProceso.map(orden => (
                                <OrdenCard key={orden.id} orden={orden} onUpdate={() => fetchOrdenes()}
                                    prevParam={{
                                        btnClass: 'btn btn-warning text-white fw-semibold',
                                        btnText: 'Recibidas',
                                        nextState: 0
                                    }}
                                    nextParam={{
                                        btnClass: 'btn btn-success text-white fw-semibold',
                                        btnText: 'Lista',
                                        nextState: 2
                                    }}

                                />
                            )) : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-4">
                <div className="ca rd" style={cardStyle}>
                    <div className="card-body">
                        <h5 className="card-title mb-3">Pedidos listos para entregar</h5>
                        <div className="rounded">
                            {listas ? listas.map(orden => (
                                <OrdenCard key={orden.id} orden={orden} onUpdate={() => fetchOrdenes()}
                                    prevParam={{
                                        btnClass: 'btn btn-primary fw-semibold',
                                        btnText: 'En proceso',
                                        nextState: 1
                                    }}

                                    nextParam={{
                                        btnClass: 'btn btn-success text-white fw-semibold',
                                        btnText: 'Entregada',
                                        nextState: 3
                                    }}
                                />
                            )) : null}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
