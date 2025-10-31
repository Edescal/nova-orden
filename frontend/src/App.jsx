import { useEffect, useRef, useState } from 'react'
import ProductoCard from './components/ProductoCard'
import Navbar from './components/Navbar'
import './css/style.css'
import Footer from './components/Footer'
import { Route, Routes } from 'react-router-dom'
import DrawerCarrito from './components/DrawerCarrito'
import Home from './pages/Home'
import { useCart } from './context/CartContext'
import { get } from './utils/apiUtils'
import Menu from './pages/Menu'

function App() {
	const carrito = useCart()
	useEffect(() => {
		async function init() {
			const data = await get('/api/wrappers/10/')
			if (data) {
				carrito.addItem(data)
			}
		}
		init();
	}, [])

	const [productos, setProductos] = useState([])

	useEffect(() => {
		const cargarProductos = async () => {
			const productos = await get('/api/productos/')
			if (productos) {
				setProductos(productos.results)
			}
		}
		cargarProductos()
	}, [])

	const [open, setOpen] = useState(false)
	return (
		<>
			<Navbar />
			<main className='container-fluid' style={{ height: "calc(100vh - 100px)" }}>
				<Routes>
					<Route path='/' element={<Menu></Menu>} />
					<Route path='/home' element={<Home />} />
					<Route path='/checkout' element={<ProductoCard />} />
				</Routes>
			</main>
			<Footer onCartClick={() => setOpen(!open)} />
			<DrawerCarrito open={open} setOpen={setOpen}></DrawerCarrito>
		</>
	)
}

export default App
