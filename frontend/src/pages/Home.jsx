import { useEffect, useState } from 'react'
import '../css/Home.css'
import { useNavigate } from 'react-router-dom'
import { get } from '../utils/apiUtils'
import Navbar from '../components/Navbar'
import NegocioCard from '../components/home/NegocioCard'


export default function Home() {
  const navigate = useNavigate()
  const [negocio, setNegocio] = useState()

  useEffect(() => {
    (async () => {
      const data = await get('/api/negocios')
      if (data?.count > 0) {
        console.log(data)
        setNegocio(data.results[0])
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
