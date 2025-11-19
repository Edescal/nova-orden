import React, { useEffect, useRef, useState } from 'react'
import Template from './Template'
import { get } from '../../utils/apiUtils'
import ProductTable from './ProductTable'
import FormProducto from '../../components/formularios/FormProducto'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Paper } from '@mui/material'
import AxiosInstance from '../../context/AuthContext'

export default function GestionProductos() {
	const formRef = useRef()
	const [type, setType] = useState(false)
	const [open, setOpen] = useState(false)
	const dialog = useRef()
	const [productos, setProductos] = useState([])
	const [page, setPage] = useState(0)
	const [editProducto, setEditProducto] = useState(null)

	useEffect(() => {
		fetchProductos()
	}, [])

	const cambiarPagina = async (value) => {
		setPage(value)
		if (value > page && productos.next) {
			const data = await get(productos.next)
			if (data) {
				setProductos(data)
				console.log(data)
			}
		} else if (value < page && productos.previous) {
			const data = await get(productos.previous)
			if (data) {
				setProductos(data)
				console.log(data)
			}
		}
	}

	const fetchProductos = async () => {
		const data = await get('/api/productos')
		if (data) {
			setProductos(data)
			console.log(data)
		}
	}

	const handleCreateProducto = () => {
		setEditProducto(null)
		setOpen(true)
		setType('crear')
		dialog.current?.showModal()
	}

	const handleEditProducto = (producto) => {
		setEditProducto(producto)
		setOpen(true)
		setType('editar')
		dialog.current?.showModal()
	}

	const handleSubmitProducto = async (formData) => {
		if (editProducto) {
			console.log('Producto editado:')
			console.log(Object.fromEntries(formData))
			const response = await AxiosInstance.put(`api/productos/${editProducto.id}/`, formData)
			if (response) {
				console.log(response)
			}

		} else {
			console.log('Producto creado:')
			const response = await AxiosInstance.post('/api/productos/', formData)
			if (response) {
				console.log(response)
			}
		}

		fetchProductos()
		setOpen(false)
		console.log('Actualizando la vista de productos')
		dialog.current?.close()
	}


	return (
		<Template activeBtns={['productos']}>
			<Box sx={{ p: 4 }}>
				<Box sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 4
				}}>
					<Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2' }}>
						Gestión de Productos
					</Typography>
					<Button
						variant="contained"
						onClick={handleCreateProducto}
						color="secondary"
						sx={{
							borderRadius: 2,
							px: 3,
							py: 1.5,
							textTransform: 'none',
							fontSize: '1rem',
							fontWeight: 500,
							boxShadow: 3,
							'&:hover': {
								boxShadow: 6
							}
						}}
					>
						Añadir un nuevo producto
					</Button>
				</Box>

				<Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
					<ProductTable
						products={productos.results}
						onEdit={handleEditProducto}
						rowcount={productos.count}
						page={page}
					/>
				</Paper>

				<Box sx={{
					display: 'flex',
					justifyContent: 'center',
					gap: 2,
					mt: 3
				}}>
					<Button
						variant="contained"
						color="primary"
						onClick={() => cambiarPagina(page - 1)}
						disabled={!productos.previous}
						sx={{
							borderRadius: 2,
							px: 4,
							py: 1,
							textTransform: 'none',
							fontWeight: 500
						}}
					>
						Anterior
					</Button>

					<Button
						variant="contained"
						color="primary"
						onClick={() => cambiarPagina(page + 1)}
						disabled={!productos.next}
						sx={{
							borderRadius: 2,
							px: 4,
							py: 1,
							textTransform: 'none',
							fontWeight: 500
						}}
					>
						Siguiente
					</Button>
				</Box>
			</Box>

			<Dialog open={open} onClose={() => { setOpen(false); setType('editar') }} maxWidth="sm" fullWidth >
				<DialogTitle sx={{
					fontWeight: 600,
					fontSize: '1.7rem',
					borderBottom: '1px solid #e0e0e0',
				}}>
					{editProducto ? 'Editar producto existente' : 'Agregar un nuevo producto'}
				</DialogTitle>
				<DialogContent>
					<FormProducto ref={formRef} producto={editProducto} onSubmit={handleSubmitProducto} type={type} />
				</DialogContent>
				<DialogActions sx={{
					p: 2.5,
					bgcolor: '#fafafa',
					borderTop: '1px solid #e0e0e0',
				}}>
					<Button onClick={() => { formRef.current?.reset(); setOpen(false) }} variant="contained" color='secondary' className='fw-semibold'>
						Cerrar
					</Button>
					<Button onClick={() => formRef.current?.submit()} type="submit" variant="contained" color='primary' className='fw-semibold'>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</Template>
	)
}