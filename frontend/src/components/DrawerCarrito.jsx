import React, { useEffect, useEffectEvent, useRef, useState } from 'react'
import ButtonDark from './ButtonDark'
import ItemCarrito from './ItemCarrito'
import Drawer from './footer/Drawer'
import { useCart } from '../context/CartContext'
import { numberToMoney } from '../utils/numberToMoney'
import { useModal } from '../context/ModalContext'
import { replace, useNavigate } from 'react-router-dom'

export default function DrawerCarrito({ open = false, setOpen = _ => { } }) {
    const modal = useModal()
    const carrito = useCart()
    const navigate = useNavigate()
    const [nombreCliente, setNombreCliente] = useState('')

    const mandarOrden = useEffectEvent(async () => {
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

    const crearOrden = () => {
        modal.confirm(
            (<>
                <div className='d-flex flex-column align-items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24"><g fill="none"><path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" /><path d="M12 18a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4" /><path stroke="currentColor" strokeLinecap="square" strokeWidth="2" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10Z" /><path stroke="currentColor" strokeLinecap="square" strokeWidth="2" d="M8 9v2m8-2v2m0 3a4 4 0 0 1-8 0z" /></g></svg>
                    <span className='text-center fs-5 my-2'>Escribe tu nombre:</span>
                    <input type="text" className='form-control' placeholder='Te llamaremos cuando esté listo tu pedido' onChange={({ target }) => setNombreCliente(target.value)} />
                </div>
            </>),
            mandarOrden,
            () => {
                setNombreCliente('')
            }
        )
    }

    return (
        <Drawer open={open} onClose={() => setOpen(false)}
            header={<h4>Mis pedidos</h4>}
            footer={<>
                <div className='d-flex flex-column justify-content-center'>
                    <div className='d-flex flex-column align-items-center justify-content-center'>
                        <ButtonDark onClick={crearOrden} text={carrito.cart.length === 0 ? 'Elige un producto' : `Finalizar compra ${numberToMoney(carrito.getPrice())}`} disabled={carrito.cart.length === 0 ? true : false}>
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
        </Drawer>
    )
}
