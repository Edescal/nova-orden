import React, { useImperativeHandle, useState, useEffect } from 'react'
import Opciones from './Opciones'
import ButtonDark from './ButtonDark'
import { useCart } from '../context/CartContext'
import { post } from '../utils/apiUtils'
import { numberToMoney } from '../utils/numberToMoney'

export default function DetalleProduto({ ref }) {
    const { addItem } = useCart()

    const form = React.useRef()
    const textArea = React.useRef()
    const [producto, setProducto] = useState(null)

    useImperativeHandle(ref, () => ({
        update: (p) => {
            setProducto(p)
            setPrecio(p.precio)
        }
    }), [])

    const [precio, setPrecio] = useState(producto ? producto.precio : 0)
    const updateOrderPrice = evt => {
        const array = form.current.querySelectorAll('input[data-precio]')
        let suma = 0
        array.forEach(element => {
            if (element.checked) {
                const n = Number(element.dataset.precio)
                suma += n
            }
        });
        setPrecio(Number(producto.precio) + suma)
    }

    const handleSubmit = async evt => {
        evt.preventDefault()
        const wrapperOptions = []
        form.current.querySelectorAll('[data-group]').forEach(g => {
            g.querySelectorAll('input').forEach(opt => {
                if (opt.checked) {
                    wrapperOptions.push({
                        'id': opt.id,
                        'precio': opt.dataset.precio,
                    })
                }
            });
        });

        const data = await post('/api/wrappers/', {
            'producto': producto.id,
            'options': wrapperOptions,
            'anotacion': textArea.current.value.trim()
        })
        if (data) {
            addItem(data)
        }
    }

    return (<>
        <div className='overflow-x-hidden overflow-scroll' style={{ maxHeight: "clamp(60vh, 15vw, 100%)" }}>
            <div className='d-flex flex-column p-2'>
                <div className='ratio ratio-4x3 flex-grow-0 flex-shrink-0 d-flex align-self-center mt-0 mb-3' style={{ flexBasis: 'clamp(80px, 18vw, 140px)' }}  >
                    <img src={producto ? producto.imagen : null} alt={producto ? `Imagen para ${producto.nombre}` : 'Imagen de producto'} className='bg-body-secondary rounded-3 shadow img-fluid object-fit-cover' />
                </div>
                <div className='container d-flex flex-column flex-nowrap flex-grow-1' >
                    <h3 className='card-title mb-0'>{producto ? producto.nombre : ''}</h3>
                    <small className='text-secondary mb-2'>{producto ? producto.categoria.nombre : ''}</small>
                    <span className='text-muted lh-sm mb-3'>{producto ? producto.descripcion : ''}</span>
                </div>
            </div>
            <hr />
            <form ref={form} data-precio={producto ? producto.precio : ''} onChange={evt => updateOrderPrice(evt)} >
                {
                    producto?.option_groups?.map(group => (
                        <Opciones group={group} key={group.id} />
                    ))
                }
                <div className="input-group w-100">
                    <label htmlFor="anotacion" className="d-flex flex-column w-100">
                        <textarea ref={textArea} name="anotacion" id="anotacion" className="input-decorator" cols="30" rows="2" maxLength="255" placeholder='¿Quieres dejar alguna nota?'></textarea>
                    </label>
                </div>
            </form>
        </div>
        <div className='pt-3 d-flex justify-content-end'>
            <div className='d-flex flex-grow-1 align-items-center column-gap-3'>
                <p onClick={() => console.log('puta madre')} className='m-0'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" />
                    </svg>
                </p>
                <p onClick={() => console.log('puta madre')} className='fs-3 m-0'>0</p>
                <p onClick={() => console.log('puta madre')} className='m-0'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                </p>
            </div>
            <div className='d-flex flex-grow-0 flex-shrink-0'>
                <ButtonDark onClick={e => handleSubmit(e)} text={`añadir ${numberToMoney(precio)}`}>
                </ButtonDark>
            </div>
        </div>
    </>)
}
