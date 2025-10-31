import React, { useEffect, useRef, useState } from 'react'
import { get } from '../utils/apiUtils'
import ProductoCard from '../components/ProductoCard'
import Dialog from '../components/Dialog'
import DetalleProduto from '../components/DetalleProduto'

export default function Menu() {
    const dialog = useRef(null)
    const detalleProducto = useRef(null)
    const [productos, setProductos] = useState([])

    useEffect(() => {
        (async () => {
            const data = await get('/api/productos')
            if (data) {
                setProductos(data.results)
            }
        })()
    }, [])

    return (
        <>
            <Dialog children={<DetalleProduto ref={detalleProducto} />} ref={dialog} />

            <div className='container-fluid'>
                <div className='row py-3 justify-content-center'>
                    <div className='input-group' style={{ width: "400px" }}>
                        <button className='input-group-text bg-white rounded-start-5 pe-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 48 48">
                                <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4">
                                    <path d="M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z" />
                                    <path strokeLinecap="round" d="M26.657 14.343A7.98 7.98 0 0 0 21 12a7.98 7.98 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485" />
                                </g>
                            </svg>
                        </button>
                        <input type="text" className='form-control-lg form-control rounded-end-5' placeholder='Busca restaurantes' />
                    </div>
                </div>
                <h3>Productos populares</h3>
                {
                    productos.map(p => (
                        <div className='row' key={p.id} >
                            <div className='col-12 h-100 p-0'>
                                <ProductoCard producto={p} onDetail={() => {
                                    dialog.current.open(p)
                                    detalleProducto.current.update(p)
                                }} />
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
