import { useEffect, useState } from "react";
import { get } from "../utils/apiUtils";
import OrdenCard from "./dashboard/OrdenCard";
import { Box, Button, ButtonBase } from '@mui/material'
import { getCSRFToken, getSession, getWhoami, logout } from "../utils/loginUtils";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [csrf, setCSRF] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate()
    const [user, setUser] = useState({})

    const [ordenes, setOrdenes] = useState([])

    const [recibidas, setRecibidas] = useState([])
    const [enProceso, setEnProceso] = useState([])
    const [listas, setListas] = useState([])
    const [entregadas, setEntregadas] = useState([])
    const [canceladas, setCanceladas] = useState([])

    useEffect(() => {
        (async () => {
            const session = await getSession()
            console.log(session)
            if (session.ok) {
                const json = await session.json()
                if (json) {
                    if (!json.isAuthenticated) {
                        navigate('/dashboard')
                    }
                }
            }

            const whoami = await getWhoami()
            if (whoami) {
                setUser(whoami.user)
            }

            const token = await getCSRFToken()
            if (token) {
                setCSRF(token)
            }
        })()

        fetchOrdenes();
    }, [])

    const handleLogout = async () => {
        const response = await logout(csrf)
        if (response) {
            navigate('/login')
        }
    }

    const fetchOrdenes = async () => {
        const data = await get('/api/ordenes/')
        if (data) {
            setOrdenes(data.results)

            setRecibidas(data.results.filter(orden => orden.estado === 0))
            setEnProceso(data.results.filter(orden => orden.estado === 1))
            setListas(data.results.filter(orden => orden.estado === 2))
            setEntregadas(data.results.filter(orden => orden.estado === 3))
            setCanceladas(data.results.filter(orden => orden.estado === 4))
        }
    }

    const menuItems = [
        { icon: '🏠', label: 'Inicio', active: true },
        { icon: '📊', label: 'Análisis' },
        { icon: '👥', label: 'Usuarios' },
        { icon: '📄', label: 'Documentos' },
        { icon: '⚙️', label: 'Configuración' },
    ];

    const cardStyle = {
        minHeight: "800px"
    }

    return (
        <>
            <div className="d-flex vh-100">
                <aside className={`bg-dark text-white ${sidebarOpen ? '' : 'd-none d-md-block'}`} style={{ width: sidebarOpen ? '250px' : '0', transition: 'all 0.3s' }}>
                    <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Dashboard</h4>
                        <button className="btn btn-dark btn-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            ✕
                        </button>
                    </div>

                    <nav className="p-3">
                        <ul className="nav flex-column row-gap-3 w-100">
                            <li className="text-center fs-4 fw-semibold">¡Hola Eduardo!</li>
                            <li className="d-flex justify-content-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="7em" height="7em" viewBox="0 0 50 50"><path fill="currentColor" d="M25.1 42c-9.4 0-17-7.6-17-17s7.6-17 17-17s17 7.6 17 17s-7.7 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.8-15-15-15" /><path fill="currentColor" d="m15.3 37.3l-1.8-.8c.5-1.2 2.1-1.9 3.8-2.7s3.8-1.7 3.8-2.8v-1.5c-.6-.5-1.6-1.6-1.8-3.2c-.5-.5-1.3-1.4-1.3-2.6c0-.7.3-1.3.5-1.7c-.2-.8-.4-2.3-.4-3.5c0-3.9 2.7-6.5 7-6.5c1.2 0 2.7.3 3.5 1.2c1.9.4 3.5 2.6 3.5 5.3c0 1.7-.3 3.1-.5 3.8c.2.3.4.8.4 1.4c0 1.3-.7 2.2-1.3 2.6c-.2 1.6-1.1 2.6-1.7 3.1V31c0 .9 1.8 1.6 3.4 2.2c1.9.7 3.9 1.5 4.6 3.1l-1.9.7c-.3-.8-1.9-1.4-3.4-1.9c-2.2-.8-4.7-1.7-4.7-4v-2.6l.5-.3s1.2-.8 1.2-2.4v-.7l.6-.3c.1 0 .6-.3.6-1.1c0-.2-.2-.5-.3-.6l-.4-.4l.2-.5s.5-1.6.5-3.6c0-1.9-1.1-3.3-2-3.3h-.6l-.3-.5c0-.4-.7-.8-1.9-.8c-3.1 0-5 1.7-5 4.5c0 1.3.5 3.5.5 3.5l.1.5l-.4.5c-.1 0-.3.3-.3.7c0 .5.6 1.1.9 1.3l.4.3v.5c0 1.5 1.3 2.3 1.3 2.4l.5.3v2.6c0 2.4-2.6 3.6-5 4.6c-1.1.4-2.6 1.1-2.8 1.6" /></svg>
                            </li>
                            <li className="text-center fw-semibold">Bienvenido de nuevo al panel de administración de tu negocio</li>
                            <ButtonBase onClick={handleLogout} className={`btn border border-3 rounded-3 text-white fs-5 fw-semibold p-2 px-3 ${sidebarOpen ? '' : 'd-none'}`}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        color: 'white',
                                        borderColor: 'white',
                                    },
                                }}
                            >
                                <span className="text-white fs-6 fw-semibold">Ordenes terminadas</span>
                            </ButtonBase>
                            <ButtonBase onClick={handleLogout} className={`btn border border-3 rounded-3 text-white fs-5 fw-semibold p-2 px-3 ${sidebarOpen ? '' : 'd-none'}`}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        color: 'white',
                                        borderColor: 'white',
                                    },
                                }}
                            >
                                <span className="text-white fs-6 fw-semibold">Papelera</span>
                            </ButtonBase>
                            <ButtonBase onClick={handleLogout} className={`bg-danger rounded-3 text-white fs-5 fw-semibold p-2 px-3 ${sidebarOpen ? '' : 'd-none'}`} >
                                <span className="text-white fs-6 fw-semibold">Cerrar sesión</span>
                            </ButtonBase>
                        </ul>
                    </nav>
                </aside>

                <div className="flex-fill d-flex flex-column">
                    <header className="bg-white border-bottom shadow-sm">
                        <div className="d-flex justify-content-between align-items-center px-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                                <button className="btn btn-light" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                    ☰
                                </button>
                                <h2 className="mb-0">Panel Principal de Órdenes</h2>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                    U
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-fill overflow-auto p-4 bg-light">
                        <div className="row g-4">

                            <div className="col-12 col-lg-4">
                                <div className="ca rd" style={cardStyle}>
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">Órdenes recibidas</h5>
                                        <div className="rounded">
                                            {recibidas ? recibidas.map(orden => (
                                                <OrdenCard key={orden.id} orden={orden} onUpdate={() => fetchOrdenes()}

                                                    prevParam={{
                                                        btnClass: 'btn btn-primary fw-semibold',
                                                        btnText: 'En proceso',
                                                        nextState: 1
                                                    }}

                                                />
                                            )) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-4">
                                <div className="ca rd" style={cardStyle}>
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">Órdenes en proceso</h5>
                                        <div className="rounded">
                                            {enProceso ? enProceso.map(orden => (
                                                <OrdenCard key={orden.id} orden={orden} onUpdate={() => fetchOrdenes()}
                                                    prevParam={{
                                                        btnClass: 'btn btn-warning text-white fw-semibold',
                                                        btnText: 'Recibidas',
                                                        nextState: 0
                                                    }}
                                                    nextParam={{
                                                        btnClass: 'btn btn-success text-white fw-semibold',
                                                        btnText: 'Lista',
                                                        nextState: 2
                                                    }}

                                                />
                                            )) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-4">
                                <div className="ca rd" style={cardStyle}>
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">Órdenes listas para entregar</h5>
                                        <div className="rounded">
                                            {listas ? listas.map(orden => (
                                                <OrdenCard key={orden.id} orden={orden} onUpdate={() => fetchOrdenes()}
                                                    prevParam={{
                                                        btnClass: 'btn btn-primary fw-semibold',
                                                        btnText: 'En proceso',
                                                        nextState: 1
                                                    }}
                                                    
                                                    nextParam={{
                                                        btnClass: 'btn btn-success text-white fw-semibold',
                                                        btnText: 'Entregada',
                                                        nextState: 3
                                                    }}
                                                />
                                            )) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}