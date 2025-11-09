import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '../context/CartContext'
import { numberToMoney } from '../utils/numberToMoney'
import Dialog from './Dialog'
import ButtonDark from './ButtonDark'
import { useModal } from '../context/ModalContext'
import { get } from '../utils/apiUtils'

export default function Carrito() {
    const carrito = useCart()
    const modal = useModal()

    useEffect(() => {
        (async () => {
            const data = await get('/api/wrappers/1')
            carrito.addItem(data)

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

    function ProductoCarrito({ wrapper, onDelete = null }) {
        return (
            <>
                {wrapper ? (
                    <article className='p-3 d-flex flex-column border-bottom'>
                        <header className='mt-auto d-flex justify-content-between column-gap-2'>
                            <h5> {wrapper.producto.nombre} {numberToMoney(wrapper.producto.precio)}</h5>
                            <button className='btn btn-sm ratio ratio-1x1' onClick={onDelete ? () => onDelete(wrapper) : null} style={{ width: "20px", height: "20px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" />
                                </svg>
                            </button>
                        </header>
                        <section className='d-flex flex-row column-gap-3'>
                            <div className='d-flex flex-column flex-nowrap flex-grow-1' >
                                <span className='text-muted lh-sm mb-2 '>{wrapper.producto.descripcion}</span>
                                <ul>
                                    {
                                        wrapper.opciones.map(opt => (
                                            <li key={opt.id}>
                                                <span className='fw-bold'>{opt.precio != 0 ? `${numberToMoney(opt.precio)}` : null}</span> <small>{opt.descripcion}</small>
                                            </li>
                                        ))
                                    }
                                </ul>
                                {wrapper.anotacion ? (
                                    <span className='mb-3'>Nota: <span className='text-muted'>{wrapper.anotacion}</span></span>
                                ) : null}
                            </div>
                            <div className='ratio ratio-1x1 flex-grow-0 flex-shrink-0 d-flex align-self-start m-2' style={{ flexBasis: 'clamp(50px, 10vw, 90px)' }}  >
                                <img src={wrapper.producto.imagen ?? null} alt={wrapper.producto.imagen ? `Imagen para ${wrapper.producto.nombre}` : 'Imagen de producto'} className='bg-body-secondary rounded-3 shadow img-fluid object-fit-contain' />
                            </div>
                        </section>
                        <footer className='mt-auto d-flex justify-content-between column-gap-2'>
                            <div className='d-flex flex-row column-gap-2 align-items-baseline'>
                                <span>Cantidad:</span> <h4> {wrapper.cantidad} </h4>
                            </div>
                            <div className='d-flex flex-row column-gap-2 align-items-baseline'>
                                <span>Subtotal:</span> <h4> {numberToMoney(wrapper.subtotal)} </h4>
                            </div>
                        </footer>
                    </article>
                ) : null}
            </>
        )
    }

    return (
        <>
            {
                carrito.cart.length > 0 ?
                    carrito.cart.map(wrapper => (
                        <ProductoCarrito key={wrapper.id} wrapper={wrapper} onDelete={() => callModal(wrapper)}></ProductoCarrito>
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

