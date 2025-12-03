import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import NegocioCard from '../components/home/NegocioCard'
import AxiosInstance from '../context/AuthContext'
import '../css/Home.css'
import { Box, Card, Paper } from '@mui/material'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


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

	const coordenadas = [21.2822136, -89.6636637]

	return (
		<>
			<Navbar title='Nova Orden'
				hideNaviButton
				hideMenuButton
			/>
			<main className='container-fluid' style={{ marginTop: 20 }}>
				<h1 className='display-2 fw-semibold px-3'>Hola, bievenido</h1>
				<div className='d-flex align-items-end gap-2 display-2 px-3' style={{ color: 'var(--color-naranja)' }}>
					<svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C7.589 2 4 5.589 4 9.995C3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12c0-4.411-3.589-8-8-8m0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4" /></svg>
					<h2 className='fw-bold lh-1'>Progreso, Yuc.</h2>
				</div>
				<Paper elevation={3} sx={{ margin: 2, borderRadius: 6 }} >
					<Card variant="outlined" elevation={5} sx={{ borderRadius: 6 }}>
						<MapContainer center={coordenadas} zoom={15} scrollWheelZoom={false}
							style={{ height: 250, width: '100%' }}
						>
							<TileLayer
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							/>
							<Marker position={coordenadas} >
								<Popup>
									Progreso, Yucatán<br /> Busca restaurantes en tu zona.
								</Popup>
							</Marker>
						</MapContainer>
					</Card>
				</Paper>

				<section className="container mb-4">
					<div className="row">
						<div className="col-12">
							<div className="card border-0 shadow-sm hero rosado" >
								<div className="card-body text-white p-4 p-md-5">
									<h1 className="display-5 text-center fw-bold mb-3">
										¡Descubre los mejores<br />restaurantes! 🍽️
									</h1>
									<p className="text-center lead mb-3">
										Ordena tu comida favorita desde la comodidad de tu hogar
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="d-flex flex-column row-gap-sm-2 justify-content-center">
					<h1 className='fw-bold px-3'>Recomendado para ti</h1>
					<NegocioCard negocio={negocio}></NegocioCard>
				</section>

			</main>
		</>
	)
}
