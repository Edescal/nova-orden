import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ButtonDark from './ButtonDark'
// import './App.css'
import './css/style.css'
import ProductoCard from './ProductoCard'
import FormProducto from './FormProducto'
import Navbar from './Navbar'
import Dialog from './Dialog'



function App() {
  const URLOrdenes = 'http://192.168.0.5:8000/api/ordenes/'
  const URLProductos = 'http://192.168.0.5:8000/api/productos/'

  const [productos, setProductos] = useState([])

  useEffect(() => {
    cargarProducto()
  }, [])

  const cargarProducto = async () => {
    fetch(URLProductos)
      .then(res => res.json())
      .then(json => json.results)
      .then(productos => {
        setProductos(productos)
      })
      .catch(error => {
        console.error(error)
        setError(error)
      })
  }

  const cargarOrdenes = async () => {
    fetch(URLOrdenes)
      .then(res => res.json())
      .then(json => json.results)
      .then(ordenes => {
        ordenes.forEach(orden => {
          console.log(orden)
        });
      })
      .catch(error => {
        console.error(error)
      })
  }

  return (
    <>
      <Navbar></Navbar>
      <Dialog children= { <FormProducto/> }/>
      <div className='container-fluid bg-body-secondary min-vh-100'>
        {
          productos.map(p => (
            <div className='row' key={p.id} >
              <div className='col-sm-12 col-md-6 h-100'>
                <ProductoCard producto={p} />
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default App
