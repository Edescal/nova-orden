import React, { useImperativeHandle, useState, useEffect, useRef } from 'react'
import Opciones from './Opciones'
import ButtonDark from './ButtonDark'
import { useCart } from '../context/CartContext'
import { numberToMoney } from '../utils/numberToMoney'
import { useNotification } from '../context/NotificationContext'
import noimgfound from '../assets/noimgfound.jpg'
import AxiosInstance from '../context/AuthContext'


export default function AgregarProduto({ ref }) {
    const { addItem } = useCart()
    const { showSnack } = useNotification()

    const dialog = useRef()
    const form = React.useRef()
    const textArea = React.useRef()
    const [producto, setProducto] = useState(null)
    const [cantidad, setCantidad] = useState(1)
    const [grupos, setGrupos] = useState([])
    const [precio, setPrecio] = useState(0)

    useImperativeHandle(ref, () => ({
        open: (callback) => {
            if (dialog.current) {
                dialog.current.showModal()
            }
        },
        close: (callback) => {
            if (dialog.current) {
                dialog.current.close()
            }
        },
        update: (p) => {
            if (p) {
                setProducto(p)
                setPrecio(p.precio)
                setGrupos(p.option_groups.map(({ id, opciones }) => ({
                    id,
                    opciones: opciones.map(({ id }) => ({ id })),
                    selected: null
                })))
            }
        }
    }), [])

    const updateOrderPrice = evt => {
        if (producto === null) return
        let suma = 0
        const array = form.current.querySelectorAll('input[data-precio]')
        array.forEach(element => {
            if (element.checked) {
                suma += Number(element.dataset.precio)
            }
        });
        setPrecio(Number(producto.precio) + suma)
    }

    const handleOptionChange = (id_grupo, id_opcion) => {
        console.log(id_grupo, Number(id_opcion))
        setGrupos()

    }

    const handleSubmit = async evt => {
        evt.preventDefault()
        try {
            if (producto === null) {
                throw new Error('Se intentaron agregar 0 productos...')
            }
            else if (cantidad <= 0) {
                throw new Error('Se intentaron agregar 0 productos...')
            }

            const wrapperOptions = []
            const query = form.current.querySelectorAll('[data-group]')
            query.forEach(radioGroup => {
                const radios = radioGroup.querySelectorAll('.atomic-data')
                const inputs = Array.from(radios).map(radio => radio.querySelector('input'))
                const selected = inputs.filter(i => i.checked)
                if (selected.length !== 1) {
                    throw new Error(`Hay un grupo de opciones que no fue seleccionado...`)
                }
                const opcion = {
                    'id': selected[0].parentNode.dataset.id,
                    'precio': selected[0].parentNode.dataset.precio,
                }
                console.log(opcion)
                wrapperOptions.push(opcion)
            });

            const response = await AxiosInstance.post('/api/wrappers/', {
                'producto': producto.id,
                'cantidad': cantidad,
                'options': wrapperOptions,
                'anotacion': textArea.current.value.trim()
            })
            if (response) {
                console.log({
                    'producto': producto.id,
                    'cantidad': cantidad,
                    'options': wrapperOptions,
                    'anotacion': textArea.current.value.trim()
                })
                console.log('----')
                console.info(response.data)
                addItem(response.data)
                dialog.current?.close()

                showSnack('Se añadió un producto al carrito', 'success')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const aumentarCantidad = (value) => {
        const number = Number(value)
        if (Number.isNaN(number)) {
            return
        }
        const newValue = cantidad + number
        if (newValue > 0 && newValue <= 100) {
            setCantidad(cantidad + number)
        }
    }

    return (
        <dialog ref={dialog}>
            <div className=' p-3'>
                <div className="pb-3 d-flex justify-content-end border-bottom">
                    <button type="submit" onClick={() => dialog.current?.close()} className="btn btn-close align-self-end"></button>
                </div>

                <div className='d-flex flex-column flex-md-row column-gap-3 align-items-start overflow-x-hidden overflow-y-scroll' style={{ height: "clamp(20vh, 60vh, 70vh)" }}>
                    <div className='d-flex flex-column p-2 h-100' style={{ flex: "2 0 0" }} >
                        <div className='ratio ratio-4x3 flex-grow-0 flex-shrink-0 d-flex align-self-center mt-0 mb-3' style={{ flexBasis: 'clamp(80px, 18vw, 140px)' }}  >
                            <img src={producto && producto.imagen ? producto.imagen : noimgfound} alt={producto ? `Imagen para ${producto.nombre}` : 'Imagen de producto'} className='bg-body-secondary rounded-3 shadow img-fluid object-fit-cover' />
                        </div>
                        <div className='container d-flex flex-column flex-nowrap flex-grow-1' >
                            <h3 className='card-title mb-0'>{producto ? producto.nombre : ''}</h3>
                            <small className='text-secondary mb-2'>{producto ? producto.categoria.nombre : ''}</small>
                            <span className='text-muted lh-sm mb-3'>{producto ? producto.descripcion : ''}</span>
                        </div>
                    </div>
                    <div className='d-flex h-100 w-100' style={{ flex: "3 0 0" }}>
                        <form className='align-items-start overflow-flex w-100 p-2' ref={form} data-precio={producto ? producto.precio : ''} onChange={evt => updateOrderPrice(evt)} >
                            <span className='px-2 text-secondary'>Customiza tu pedido:</span>
                            {
                                producto?.option_groups?.map(group => (
                                    <Opciones group={group} key={group.id} onChange={({ target }) => handleOptionChange(group.id, target.value)} />
                                ))
                            }
                            <div className="input-group w-100">
                                <label htmlFor="anotacion" className="d-flex flex-column w-100">
                                    <textarea ref={textArea} name="anotacion" id="anotacion" className="input-decorator" cols="30" rows="2" maxLength="255" placeholder='¿Quieres dejar alguna nota?'></textarea>
                                </label>
                            </div>
                        </form>
                    </div>
                </div>

                <div className='pt-3 d-flex justify-content-end border-top'>
                    <div className='d-flex flex-grow-1 align-items-center column-gap-3'>
                        <p onClick={() => aumentarCantidad(-1)} className='m-0 btn btn-sm ratio ratio-1x1' style={{ height: "35px", width: "35px" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" />
                            </svg>
                        </p>
                        <p onClick={() => console.log('puta madre')} className='fs-3 m-0'>{cantidad}</p>
                        <p onClick={() => aumentarCantidad(1)} className='m-0 btn btn-sm ratio ratio-1x1' style={{ height: "35px", width: "35px" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                        </p>
                    </div>
                    <div className='d-flex flex-grow-0 flex-shrink-0'>
                        <ButtonDark onClick={e => handleSubmit(e)} text={`añadir ${numberToMoney(precio)}`} />
                    </div>
                </div>
            </div>
        </dialog>
    )
}
