import React, { useEffect, useState } from 'react'
import OrdenCard from './OrdenCard'
import AxiosInstance from '../../context/AuthContext'
import { Box, Grid } from '@mui/material'

export default function TableroOrdenes() {
    const [recibidas, setRecibidas] = useState([])
    const [enProceso, setEnProceso] = useState([])
    const [listas, setListas] = useState([])

    useEffect(() => {
        fetchOrdenes()
        const interval = setInterval(async () => {
            try {
                await fetchOrdenes();
            } catch (error) {
                console.error('Error al obtener órdenes:', error);
            }
        }, 1000)
        return () => clearInterval(interval);
    }, [])

    const fetchOrdenes = async () => {
        const response = await AxiosInstance.get('/api/ordenes/')
        if (response) {
            console.log(response)
            setRecibidas(response.data.filter(orden => orden.estado === 0))
            setEnProceso(response.data.filter(orden => orden.estado === 1))
            setListas(response.data.filter(orden => orden.estado === 2))
        }
    }

    const cardStyle = {
        minHeight: "800px"
    }

    return (
        <div className="row g-4">
            <Grid container spacing={2} columns={{ sm: 3, xs: 1, md: 3 }} >
                <Grid item size={1}>
                    <div className='card shadow'>
                        <div className='card-header bg-warning'>
                            <h3 className='text-center fw-bold text-white'>Órdenes recibidas</h3>
                        </div>
                        <div className='card-body bg-secondary bg-opacity-10'>
                            <Box sx={{ minHeight: '70vh', overflowY: 'auto', padding: 2 }}>
                                {recibidas && recibidas.map(orden => (
                                    <OrdenCard key={orden.id} orden={orden} onUpdate={() => fetchOrdenes()}
                                        prevParam={{
                                            btnClass: 'btn btn-primary fw-semibold',
                                            btnText: 'En proceso',
                                            nextState: 1
                                        }}
                                    />
                                ))}
                            </Box>
                        </div>
                    </div>
                </Grid>

                <Grid item size={1}>
                    <div className='card shadow'>
                        <div className='card-header bg-primary'>
                            <h3 className='text-center fw-bold text-white'>Órdenes recibidas</h3>
                        </div>
                        <div className='card-body bg-secondary bg-opacity-10'>
                            <Box sx={{ minHeight: '70vh', overflowY: 'auto', padding: 2 }}>
                                {enProceso && enProceso.map(orden => (
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
                                ))}
                            </Box>
                        </div>
                    </div>
                </Grid>
                
                <Grid item size={1}>
                    <div className='card shadow'>
                        <div className='card-header bg-success'>
                            <h3 className='text-center fw-bold text-white'>Órdenes recibidas</h3>
                        </div>
                        <div className='card-body bg-secondary bg-opacity-10'>
                            <Box sx={{ minHeight: '70vh', overflowY: 'auto', padding: 2 }}>
                                {listas && listas.map(orden => (
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
                                ))}
                            </Box>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}
