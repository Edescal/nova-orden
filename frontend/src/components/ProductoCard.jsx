import React, { useEffect, useRef } from 'react'
import ButtonDark from './ButtonDark'
import { numberToMoney } from '../utils/numberToMoney';

export default function ProductoCard({ producto = null, onDetail = null }) {
    return (producto ? (
        <article className='bg-light border-bottom p-3' onClick={onDetail ?? null}>
            <div className='d-flex'>
                <div className='ratio ratio-1x1 flex-grow-0 flex-shrink-0 d-flex align-self-center' style={{ flexBasis: 'clamp(70px, 16vw, 140px)' }}  >
                    <img src={producto.imagen ?? null} alt={producto.imagen ? `Imagen para ${producto.nombre}` : 'Imagen de producto'} className='bg-body-secondary rounded-3 shadow img-fluid object-fit-contain' />
                </div>
                <div className='container d-flex flex-column flex-nowrap flex-grow-1' >
                    <div className='d-flex justify-content-between align-items-center'>
                        <h4 className='card-title mb-0'>{producto.nombre}</h4>
                        <h4 className='card-text d-flex'>{numberToMoney(producto.precio)}</h4>
                    </div>
                    <small className='text-secondary mb-2'>{producto.categoria.nombre}</small>
                    <span className='text-muted lh-sm mb-3 pe-5'>{producto.descripcion}</span>
                </div>
            </div>
        </article>
    ) : null)
}
