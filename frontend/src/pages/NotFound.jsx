import { Box, Button, Container, IconButton, Typography } from '@mui/material'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'


export default function NotFound() {
    const navigate = useNavigate()

    return (
        <main className='vh-100 d-flex flex-column justify-content-center'>
            <Container maxWidth='sm' className='d-flex justify-content-center align-items-center flex-column text-center'>
                <Typography sx={{
                    fontSize: 96,
                    fontWeight: 'bold',
                    color: '#1251ffff'
                }}>
                    404
                </Typography>
                <h3>Página no encontrada</h3>

                <h5 className='text-secondary my-4' >Lo sentimos, no pudimos encontrar la página que buscas. Puedes volver al inicio.</h5>

                <Button variant='contained' onPointerUp={() => navigate(-2)} className='fw-bold'>
                    Regresar
                </Button>
            </Container>

        </main>
    )
}
