import { useEffect, useState } from 'react'
import '../css/Home.css'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import NegocioCard from '../components/home/NegocioCard'
import AxiosInstance, { useAuth } from '../context/AuthContext'

export default function Home() {
  const navigate = useNavigate()
  const [negocio, setNegocio] = useState()

  useEffect(() => {
    (async () => {
      const response = await AxiosInstance.get('/api/negocios')
      if (response?.data?.count > 0) {
        setNegocio(response.data.results[0])
        console.log(response.data)
      }
    })()
  }, [])

  return (
    <>
      <Navbar title='Nova Orden'
        onLeftButtonClick={() => navigate('/menu')}
        onRightButtonClick={() => console.log("TODO: Abrir el menú lateral...")}
      />
      <main className='container-fluid' style={{ marginTop: 20 }}>

        <section className="d-flex flex-column row-gap-sm-2 justify-content-center">
          <h4 className='fw-bold'>Restaurantes populares</h4>
          {[1, 2, 3, 4].map((value, index) => (
            <NegocioCard key={index} negocio={value == 1 ? negocio : null}></NegocioCard>
          ))}
        </section>
      </main>
    </>
  )

}
