import React from 'react'
import ButtonDark from './ButtonDark'

export default function ProductoCard({ producto = {} }) {

    const formatDecimal = (value) => {
        const n = Number(value);
        if (!Number.isFinite(n))
            return <>$ 0.<span className="decimal">00</span></>;

        const [ent, dec] = n.toFixed(2).split('.');
        return (
            <>
                $ {ent}.<span className="d-flex align-content-start decimal">{dec}</span>
            </>
        )
    }

    return (
        <div className='card border-0 shadow-sm rounded-4 my-2'>
            <div className='card-body d-flex p-3'>
                <div className='ratio ratio-1x1 flex-grow-0 flex-shrink-0 d-flex align-self-center m-3' style={{ flexBasis: 'clamp(80px, 18vw, 140px)' }}  >
                    <img src={producto.imagen ?? null} alt={producto.imagen ? `Imagen para ${producto.nombre}` : 'Imagen de producto'} className='bg-body-secondary rounded-4 shadow img-fluid object-fit-contain' />
                </div>
                <div className='container d-flex flex-column flex-nowrap flex-grow-1' >
                    <h3 className='card-title mb-0'>{producto.nombre ?? ''}</h3>
                    <small className='text-secondary mb-2'>{producto.categoria ? producto.categoria.nombre : ''}</small>
                    <span className='text-muted lh-sm mb-3'>{producto.descripcion ?? ''}</span>
                    <h6 className='card-text d-flex'>{formatDecimal(producto.precio)}</h6>
                </div>
                <div className='container d-flex justify-content-center flex-column flex-nowrap flex-shrink-1 px-0' style={{ flexBasis: 'clamp(25px, 15vw, 80px)' }}>
                    <ButtonDark text="" onClick={() => console.log(producto)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                            <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" />
                        </svg>
                    </ButtonDark>
                </div>
            </div>
        </div>
    )
}
