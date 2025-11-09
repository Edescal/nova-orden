import React, { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import '../css/Home.css'
import { useNavigate } from 'react-router-dom'
import Categorias from '../components/home/Categorias'
import FormProducto from '../components/formularios/FormProducto'
import { get } from '../utils/apiUtils'

export default function Home() {
  const [producto, setProducto] = useState(null)

  const onTest = async () => {
    const data = await get('/api/productos/1')
    if (data) {
      console.log(data)
      setProducto(data)
    }
  }

  return (
    <section className='w-100 d-flex flex-column justify-content-center align-items-center' style={{width: "50rem"}}>
      <button className='btn btn-danger' onClick={onTest}>Testear producto</button>
      <FormProducto producto={producto} />
    </section>
  )

}
