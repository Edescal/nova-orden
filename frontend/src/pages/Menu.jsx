import React, { useEffect, useEffectEvent, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { get } from '../utils/apiUtils'
import ProductoCard from '../components/ProductoCard'
import Dialog from '../components/Dialog'
import AgregarProduto from '../components/AgregarProducto'
import Categorias from '../components/home/Categorias'
import SearchBar from '../components/home/SearchBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DrawerCarrito from '../components/DrawerCarrito'

export default function Menu() {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const [categorias, setCategorias] = useState([])
    const detalleProducto = useRef(null)

    useEffect(() => {
        (async () => {
            const data = await get('/api/categorias')
            if (data) {
                console.log(data)
                setCategorias(data.results)
            }
        })()
    }, [])

    const searchProductos = evt => {
        const productos = document.querySelectorAll('[id*=producto-id-]')
        const input = evt.target.value.trim()
        if (input) {
            Array.from(productos).forEach(e => {
                const nombre = e.querySelector('[id*=producto-nombre-]')
                if (nombre) {
                    const included = nombre.textContent.includes(input)
                    if (included) {
                        e.classList.remove('d-none')
                        e.classList.add('d-block')
                    } else {
                        e.classList.add('d-none')
                        e.classList.remove('d-block')
                    }
                }
            })
        } else {
            Array.from(productos).forEach(e => {
                e.classList.remove('d-none')
                e.classList.add('d-block')
            })
        }

        const categoriaCards = Array.from(document.querySelectorAll('.categoria'))
        categoriaCards.forEach(ele => {
            const visibles = ele.querySelectorAll(':scope > :not(.d-none):not(.categoria-nombre)')
            if (visibles.length === 0) {
                ele.classList.add('d-none')
                ele.classList.remove('d-block')
            } else {
                ele.classList.remove('d-none')
                ele.classList.add('d-block')
            }
        })

        const empty = categoriaCards.filter(x => x.querySelectorAll(':scope > :not(.d-none):not(.categoria-nombre)').length === 0)
        const noItems = document.querySelector('.no-items-shown')
        if (empty.length === categoriaCards.length) {
            noItems.classList?.toggle('d-none', false)
        } else {
            noItems.classList?.toggle('d-none', true)
        }
    }

    return (
        <>
            <Navbar title='¡Ordena ahora!'
                onLeftButtonClick={() => navigate('/')}
                onRightButtonClick={() => console.log("TODO: Abrir el menú lateral...")}
            />
            <main className='container-fluid px-0'>
                <AgregarProduto ref={detalleProducto} />

                <div className='container-fluid g-0 p-0 m-0'>
                    <div className='row py-3 justify-content-center mb-0 mx-0'>
                        <SearchBar func={searchProductos} />
                        <Categorias />
                    </div>

                    <div className='py-4'>
                        {
                            categorias.map(categoria => (categoria.productos.length > 0 ?
                                <article
                                    key={categoria.id}
                                    className='categoria mb-4'
                                    id={categoria.nombre.split(' ').join('-').toLowerCase()}
                                >
                                    <h5 className='categoria-nombre rounded-top-4 bg-dark text-white text-center mb-0 px-3'>
                                        {categoria.nombre}
                                    </h5>
                                    {
                                        categoria.productos.map(producto => producto.visible ? (
                                            <ProductoCard
                                                key={producto.id}
                                                producto={producto}
                                                onDetail={() => {
                                                    detalleProducto.current.update(producto)
                                                    detalleProducto.current.open()
                                                }}
                                            />
                                        ) : null)
                                    }
                                </article> : null))
                        }
                    </div>


                    <div className='no-items-shown d-none'>
                        <div className='d-flex flex-column align-items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M14.986 3.51a9 9 0 1 0 1.514 16.284c2.489 -1.437 4.181 -3.978 4.5 -6.794" />
                                <path d="M10 10h.01" />
                                <path d="M14 8h.01" />
                                <path d="M12 15c1 -1.333 2 -2 3 -2" />
                                <path d="M20 9v.01" />
                                <path d="M20 6a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
                            </svg>
                            <h3>No hay productos para mostrar</h3>
                        </div>
                    </div>
                </div>
            </main>
            <Footer onCartClick={() => setOpen(!open)} />
            <DrawerCarrito open={open} setOpen={setOpen}></DrawerCarrito>
        </>
    )
}