import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '../context/CartContext'
import { numberToMoney } from '../utils/numberToMoney'
import Dialog from './Dialog'
import ButtonDark from './ButtonDark'
import { useModal } from '../context/ModalContext'
import { get } from '../utils/apiUtils'
import ProductoCarrito from './ProductoCarrito'

export default function ItemCarrito() {
    const carrito = useCart()
    const modal = useModal()

    useEffect(() => {
        (async () => {
            const data = await get('/api/wrappers')
            if (data.count > 0) {
                console.log(data)
            }
        })()
    }, [])

    const callModal = (wrapper) => {
        modal.confirm(
            <h5 className='text-center mb-4'>
                ¿Realmente deseas eliminar el producto {wrapper ? wrapper.producto.nombre : null}?
            </h5>
            ,
            () => carrito.removeItem(wrapper)
        )
    }

    return (
        <>
            {
                carrito.cart.length > 0 ?
                    carrito.cart.map((wrapper, index) => (
                        <ProductoCarrito key={index} wrapper={wrapper} onDelete={() => callModal(wrapper)}></ProductoCarrito>
                    )) :
                    <div className='p-3 d-flex flex-column align-items-center justify-content-center h-100'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24"><path fill="none" stroke="grey" strokeLinecap="round" strokeWidth="2" d="M4 7h16v16H4zm4 2V5c0-2.21 1.795-4 4-4h0c2.21 0 4 1.795 4 4v4" /></svg>
                        <span className='fs-4 text-secondary'>
                            El carrito está vacío
                        </span>
                    </div>
            }
        </>
    )
}

