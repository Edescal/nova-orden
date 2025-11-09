import React, { useEffect, useState } from 'react'
import { get } from '../utils/apiUtils'
import { numberToMoney } from '../utils/numberToMoney'
import CrearOpciones from '../components/formularios/CrearOpciones'
import CrearGrupoOpciones from '../components/formularios/CrearGrupoOpciones'
import FormProducto from '../components/formularios/FormProducto'

export default function Dashboard() {
    const [disableBtns, setDisableBtns] = useState(false)
    const [categorias, setCategorias] = useState([])
    const [productos, setProductos] = useState([])
    const [pagination, setPagination] = useState({
        previous: null,
        next: null,
        count: 0,
        currentPage: 0,
    })

    useEffect(() => {
        (async () => {
            const data = await get('/api/productos').catch(error => {throw error})
            if (data) {
                const paginacion = {
                    previous: data.previous,
                    next: data.next,
                    count: data.count,
                    currentPage: 1,
                }
                setPagination(paginacion)
                setProductos(data.results)
            }
        })();
        (async () => {
            const data = await get('/api/categorias')
            if (data) {
                const filter = data.results.map(({ id, nombre }) => ({ id, nombre }))
                setCategorias(filter)
            }
        })()
    }, [])

    const getCategoriaById = (id) => {
        if (categorias.length === 0) return
        const map = categorias.filter(x => x.id === id)
        return map.length === 1 ? map[0].nombre : null
    }

    const onClickRow = (producto) => {
        console.log(producto)
    }

    const showItemCount = () => {
        return `Mostrando ${(1 + (pagination.currentPage - 1) * 10)}-${(pagination.currentPage * 10)}/${pagination.count}`
    }

    const changePage = async (URL, nextPageStep) => {
        if (disableBtns) return

        setDisableBtns(true)
        try {
            await (async () => {
                if (!URL) {
                    console.warn('La URL de paginación es null')
                    return
                }
                const data = await get(URL)
                if (data) {
                    const newPagination = {
                        previous: data.previous,
                        next: data.next,
                        count: data.count,
                        currentPage: pagination.currentPage + (nextPageStep ?? 0),
                    }
                    setPagination(newPagination)
                    setProductos(data.results)
                }
            })()
        } catch (error) {
            console.error(error)
        } finally {
            setDisableBtns(false)
        }

    }

    return (
        <div className='card p-3'>
            <div className='d-flex justify-content-between py-3'>
                <button className='btn btn-primary' onClick={() => changePage(pagination.previous, -1)} disabled={pagination.previous === null || disableBtns}>Previous page</button>
                <span>{showItemCount()}</span>
                <button className='btn btn-primary' onClick={() => changePage(pagination.next, 1)} disabled={pagination.next === null || disableBtns}>Next page</button>
            </div>
            <table className='table table-hover border' role='button'>
                <thead>
                    <tr>
                        <th colSpan={2}>Producto</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                    </tr>
                </thead>
                <tbody>
                    {productos ? productos.map((producto, index) => (
                        <tr key={producto.id} onClick={() => onClickRow(producto)}>
                            <td>
                                <img className='rounded-3' src={producto.imagen} alt="" style={{ height: "40px" }} />
                            </td>
                            <td className='fw-semibold'>{producto.nombre}</td>
                            <td className='text-secondary'>{producto.descripcion}</td>
                            <td>{numberToMoney(producto.precio)}</td>
                            <td className='fw-semibold'>{getCategoriaById(producto.categoria) ?? 'Error'}</td>
                        </tr>
                    )) : null}
                </tbody>
            </table>
            <FormProducto />
        </div>
    )
}
