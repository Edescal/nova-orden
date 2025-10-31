import React, { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import '../css/Home.css'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const { cart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    console.log(navigate)
  }, [])

  return (
    <section className='d-flex flex-column justify-content-center'>
      <div className='container-fluid'>
        <div className='row py-3 justify-content-center'>
          <div className='input-group' style={{ width: "300px" }}>
            <button className='input-group-text bg-white rounded-start-5 pe-2'>
              <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"><path d="M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z" /><path strokeLinecap="round" d="M26.657 14.343A7.98 7.98 0 0 0 21 12a7.98 7.98 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485" /></g></svg>
            </button>
            <input type="text" className='form-control-lg form-control rounded-end-5' placeholder='Busca restaurantes' />
          </div>
        </div>
      </div>

      <div className='container-fluid py-3'>
        <h3 className='m-3'>Restaurantes populares</h3>
        <div className='row justify-content-center g-3'>
        {[0, 0, 0, 0, 0, 0].map(e => (
            <div className='col-sm-12 col-md-3' onClick={() => navigate('/')}>
              <div className='bg-white p-0 rounded-4 overflow-hidden'>
                <div className='img-fluid overflow-hidden p-0 m-0' style={{ height: "150px" }}>
                  <img src="/public/burger.webp" alt="" className='img-fluid' style={{}} />
                </div>
                <div className='d-flex flex-column p-3'>
                  <span className='fw-bold fs-5'>Pedazo de mierda</span>
                  <span className='text-secondary'>adasjdaajd hajksd h hasjkd hsajkd h</span>
                </div>
              </div>
            </div>
        ))}
        </div>
      </div>
    </section>
  )

}
