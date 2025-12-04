import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function FooterDefault() {


  return (
    <footer className=' container-fluid py-4 mt-5 text-center bg-dark text-white text-center py-3'>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Nova Orden. Todos los derechos reservados.</p>
        <ul className="list-inline">
          <li className="list-inline-item">
            <Link to="/" className="text-white">Inicio</Link>
          </li>
          <li className="list-inline-item">
            <Link to="/login" className="text-white">Iniciar sesión</Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
