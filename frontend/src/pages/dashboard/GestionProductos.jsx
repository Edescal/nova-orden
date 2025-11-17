import React, { useEffect, useRef, useState } from 'react'
import Template from './Template'
import { get } from '../../utils/apiUtils'
import ProductTable from './ProductTable'
import FormProducto from '../../components/formularios/FormProducto'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Paper } from '@mui/material'

export default function GestionProductos() {
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

	const handleSubmitProducto = (productos) => {
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

			<Dialog 
				open={open} 
				onClose={() => { setOpen(false); setType('editar') }}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle sx={{ 
					bgcolor: '#f5f5f5', 
					fontWeight: 600,
					fontSize: '1.25rem'
				}}>
					{type === 'crear' ? 'Agregar un nuevo producto' : 'Editar producto existente'}
				</DialogTitle>
				<DialogContent sx={{ mt: 2 }}>
					<FormProducto 
						producto={editProducto} 
						onSubmit={handleSubmitProducto} 
						type={type}
					/>
				</DialogContent>
				<DialogActions sx={{ p: 2.5, bgcolor: '#fafafa' }}>
					<Button 
						onClick={() => { setOpen(false); setType('editar') }}
						sx={{ 
							textTransform: 'none',
							color: '#666'
						}}
					>
						Cerrar
					</Button>
					<Button 
						type="submit" 
						form="subscription-form"
						variant="contained"
						sx={{ 
							textTransform: 'none',
							px: 3
						}}
					>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</Template>
	)
}