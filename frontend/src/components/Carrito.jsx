import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '../context/CartContext'
import { numberToMoney } from '../utils/numberToMoney'
import Dialog from './Dialog'
import ButtonDark from './ButtonDark'
import { useModal } from '../context/ModalContext'

export default function Carrito() {
    const carrito = useCart()
    const modal = useModal()

    const callModal = (wrapper) => {
        modal.confirm(
            <h5 className='text-center mb-4'>
                ¿Realmente deseas eliminar el producto {wrapper ? wrapper.producto.nombre : null}?
            </h5>
            ,
            () => {
                console.log('Puta madre se hizo')
                carrito.removeItem(wrapper)
            }, () => {
                console.log('Puta pendeja no se hizo')
            }
        )
    }

    return (
        <>
            {carrito.cart.map(wrapper => (
                <ProductoCarrito key={wrapper.id} producto={wrapper} onDelete={() => callModal(wrapper)}></ProductoCarrito>
            ))}
        </>
    )
}

function ProductoCarrito({ producto, onDelete = null }) {
    return (
        <>
            {producto ? (
                <article className='p-3 d-flex flex-column border-bottom'>
                    <header className='mt-auto d-flex justify-content-between column-gap-2'>
                        <h5> {producto.producto.nombre} {numberToMoney(producto.producto.precio)}</h5>
                        <button className='btn btn-sm ratio ratio-1x1'
                            onClick={onDelete ? () => onDelete(producto) : null}
                            style={{ width: "20px", height: "20px" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" />
                            </svg>
                        </button>
                    </header>
                    <section className='d-flex flex-row column-gap-3'>
                        <div className='d-flex flex-column flex-nowrap flex-grow-1' >
                            <span className='text-muted lh-sm mb-2 '>{producto.producto.descripcion}</span>
                            <ul>
                                {
                                    producto.opciones.map(opt => (
                                        <li key={opt.id}>
                                            <span className='fw-bold'>{opt.precio != 0 ? `${numberToMoney(opt.precio)}` : null}</span> <small>{opt.descripcion}</small>
                                        </li>
                                    ))
                                }
                            </ul>
                            {producto.anotacion ? (
                                <span>Nota: {producto.anotacion}</span>
                            ) : null}
                        </div>
                        <div className='ratio ratio-1x1 flex-grow-0 flex-shrink-0 d-flex align-self-start m-2' style={{ flexBasis: 'clamp(50px, 10vw, 90px)' }}  >
                            <img src={producto.producto.imagen ?? null} alt={producto.producto.imagen ? `Imagen para ${producto.producto.nombre}` : 'Imagen de producto'} className='bg-body-secondary rounded-3 shadow img-fluid object-fit-contain' />
                        </div>
                    </section>
                    <footer className='mt-auto d-flex justify-content-end column-gap-2'>
                        <span>Subtotal:</span> <h4> {numberToMoney(producto.subtotal)} </h4>
                    </footer>
                </article>
            ) : null}
        </>

    )
}