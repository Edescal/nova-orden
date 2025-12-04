import React, { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import ButtonDark from './ButtonDark'
import ItemCarrito from './ItemCarrito'
import Drawer from './footer/Drawer'
import { useCart } from '../context/CartContext'
import { numberToMoney } from '../utils/numberToMoney'
import {  useNavigate } from 'react-router-dom'
import { Box, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material'

const NOMBRE_MAX_LENGTH = 30
const regex = /^[A-Za-záéíóúÁÉÍÓÚüÜÑñ]+$/
export default function DrawerCarrito({ open = false, setOpen = _ => { } }) {
    const carrito = useCart()
    const navigate = useNavigate()
    const [nombreCliente, setNombreCliente] = useState('')
    const [error, setError] = useState(null)

    const [dialog, setDialog] = useState(false)

    const onChange = ({ target }) => {
        if (target.value.length <= NOMBRE_MAX_LENGTH) {
            if (regex.test(target.value) || target.value === '' || target.value.endsWith(' ')) {
                setError(null)
                setNombreCliente(target.value)
            } else {
                setError('El nombre solo puede contener letras y espacios')
            }
        }
    }

    const onBlur = ({ target }) => {
        setNombreCliente(target.value.trim())
    }

    const mandarOrden = useEffectEvent(async () => {
        if (nombreCliente.trim() === '') {
            setError('El nombre no puede estar vacío')
            return
        }

        const orden = await carrito.submit(nombreCliente)
        if (orden) {
            navigate('/success', {
                state: {
                    orden: orden,
                    replace: true
                }
            })
        }
    })

    const closeDialog = () => {
        console.log('Cerrando dialog')
        setDialog(false)
        setNombreCliente('')
        setError(null)
    }

    return (
        <Drawer open={open} onClose={() => setOpen(false)}
            header={<h4>Mis pedidos</h4>}
            footer={<>
                <div className='d-flex flex-column justify-content-center'>
                    <div className='d-flex flex-column align-items-center justify-content-center'>
                        <ButtonDark onClick={() => setDialog(true)} text={carrito.cart.length === 0 ? 'Elige un producto' : `Finalizar compra ${numberToMoney(carrito.getPrice())}`} disabled={carrito.cart.length === 0 ? true : false}>
                            {
                                carrito.cart.length === 0 &&
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" />
                                    <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
                                </svg>
                            }
                        </ButtonDark>
                        <a href="#" className='text-center my-3' onClick={() => setOpen(false)}>Seguir comprando</a>
                    </div>
                </div>
            </>}>
            <ItemCarrito></ItemCarrito>
            <Dialog open={dialog} maxWidth='xs' fullWidth>
                <DialogContent sx={{
                    display: 'flex',
                    flexFlow: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24"><g fill="none"><path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" /><path d="M12 18a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4" /><path stroke="currentColor" strokeLinecap="square" strokeWidth="2" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10Z" /><path stroke="currentColor" strokeLinecap="square" strokeWidth="2" d="M8 9v2m8-2v2m0 3a4 4 0 0 1-8 0z" /></g></svg>
                    <span className='text-center fs-5 my-2'>Escribe tu nombre:</span>
                    <Box sx={{ position: 'relative', width: '100%' }}>
                        <TextField
                            fullWidth
                            placeholder='Nosotros te llamaremos'
                            onChange={onChange}
                            onBlur={onBlur}
                            value={nombreCliente}
                            error={error !== null}
                            helperText={error}
                        >
                        </TextField>
                        <Typography
                            variant="caption"
                            sx={{
                                position: 'absolute',
                                top: 30,
                                right: 10,
                                color: nombreCliente.length === NOMBRE_MAX_LENGTH ? 'error.main' :
                                    nombreCliente.length >= Math.floor(NOMBRE_MAX_LENGTH * 0.75) ? '#ffb700ff' :
                                        'text.secondary'
                                ,
                            }}
                        >
                            {`${nombreCliente.length}/${NOMBRE_MAX_LENGTH}`}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    display: 'flex',
                    flexFlow: 'column'
                }}>
                    <ButtonDark text='Confirmar orden' onClick={mandarOrden} />
                    <a href="#" className='text-center mb-3 mt-4' onClick={closeDialog}>Regresar</a>
                </DialogActions>
            </Dialog>
        </Drawer >
    )
}
