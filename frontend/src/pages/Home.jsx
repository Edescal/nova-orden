import React, { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import '../css/Home.css'
import { useNavigate } from 'react-router-dom'
import { get } from '../utils/apiUtils'
import Navbar from '../components/Navbar'
import noimgfound from '../assets/noimgfound.jpg'
import NegocioCard from '../components/home/NegocioCard'
import { Box, Button, ButtonBase } from '@mui/material'


export default function Home() {
  const navigate = useNavigate()
  const [negocio, setNegocio] = useState()

  useEffect(() => {
    (async () => {
      const data = await get('/api/negocios')
      if (data?.count > 0) {
        setNegocio(data.results[0])
      }
    })()
  }, [])

  // Esto es para testear el form de producto
  const [producto, setProducto] = useState(null)
  const onTest = async () => {
    const data = await get('/api/productos/1')
    if (data) {
      console.log(data)
      setProducto(data)
    }
  }

  const handleClick = () => {
    setTimeout(() => {
      navigate('/')
    }, 300)
  }

  return (
    <>
      <Navbar title='¡Busca restaurantes!'
        onLeftButtonClick={() => navigate('/')}
        onRightButtonClick={() => console.log("TODO: Abrir el menú lateral...")}
      />
      <main className='container-fluid px-0'>
        <section className="d-flex flex-column flex-md-row flex-wrap row-gap-sm-2 justify-content-center">
          {[1, 2, 3, 4].map((value, index) => (
            <ButtonBase key={index} className='col-12 col-sm-3 border-bottom bg-'
              onPointerUp={value == 1 ? handleClick : null}
            >
              <NegocioCard negocio={value == 1 ? negocio : null}></NegocioCard>
            </ButtonBase>
          ))}
        </section>
      </main>
    </>
  )

}
