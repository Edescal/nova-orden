import { useState } from 'react'
import Navbar from './components/Navbar'
import './css/style.css'
import Footer from './components/Footer'
import { Navigate, Route, Routes } from 'react-router-dom'
import DrawerCarrito from './components/DrawerCarrito'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Success from './pages/Success'
import Papelera from './pages/dashboard/Papelera'
import OrdenesEntregadas from './pages/dashboard/OrdenesEntregadas'
import GestionProductos from './pages/dashboard/GestionProductos'
import Test from './pages/Test'
import ProtectedRoute from './protected/ProtectedRoute'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import TestTemplate from './pages/TestTemplate'

function App() {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/home' element={<Home />} />
			<Route path='/:slug/menu' element={<Menu />} />

			<Route path='/success' element={<Success />} />
			<Route path='/login' element={<Login />} />
			<Route path='/register' element={<Register />} />

			<Route element={<ProtectedRoute  />} >
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/ordenes-entregadas' element={<OrdenesEntregadas />} />
				<Route path='/productos' element={<GestionProductos />} />
				<Route path='/papelera' element={<Papelera />} />
				<Route path='/test' element={<Test />} />
			</Route>

			<Route path="*" element={<Navigate to='/not-found' />} />
			<Route path="/not-found" element={<NotFound />} />
		</Routes>
	)
}
export default App
