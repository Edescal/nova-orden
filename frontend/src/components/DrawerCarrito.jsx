import React, { useEffect, useEffectEvent, useState } from 'react'
import ButtonDark from './ButtonDark'
import Carrito from './Carrito'
import Drawer from './footer/Drawer'
import { useCart } from '../context/CartContext'
import { numberToMoney } from '../utils/numberToMoney'
import { useModal } from '../context/ModalContext'

export default function DrawerCarrito({ open = false, setOpen = _ => { } }) {
    const carrito = useCart()

    return (
        <Drawer open={open} onClose={() => setOpen(false)}
            header={<h4>Mis pedidos</h4>}
            footer={<>
                <div className='d-flex flex-column justify-content-center'>
                    <div className='d-flex justify-content-center'>
                        <ButtonDark text={carrito.cart.length === 0 ? 'Elige un producto' : `Finalizar compra ${numberToMoney(carrito.getPrice())}`} disabled={carrito.cart.length === 0 ? true : false}>
                            {carrito.cart.length === 0 ? null :
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" />
                                        <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
                                    </svg>
                                </>}
                        </ButtonDark>
                    </div>
                    <a href="#" className='text-center my-3' onClick={() => setOpen(false)}>Seguir comprando</a>
                </div>
            </>}>
            <Carrito></Carrito>
        </Drawer>
    )
}
