import { useState } from 'react'
import ProductoCard from './components/ProductoCard'
import Navbar from './components/Navbar'
import './css/style.css'
import Footer from './components/Footer'
import { Route, Routes } from 'react-router-dom'
import DrawerCarrito from './components/DrawerCarrito'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Success from './pages/Success'
import Papelera from './pages/dashboard/Papelera'
import OrdenesEntregadas from './pages/dashboard/OrdenesEntregadas'

function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<Menu></Menu>} />
				<Route path='/home' element={<Home />} />
				<Route path='/checkout' element={<ProductoCard />} />
				<Route path='/success' element={<Success />} />
				<Route path='/login' element={<Login />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/ordenes-entregadas' element={<OrdenesEntregadas />} />
				<Route path='/papelera' element={<Papelera />} />
			</Routes>
		</>
	)
}
export default App
