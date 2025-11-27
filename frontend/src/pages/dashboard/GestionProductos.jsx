import { useCallback, useEffect, useRef, useState } from 'react'
import Template from './Template'
import ProductTable from './ProductTable'
import FormProducto from '../../components/formularios/FormProducto'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Paper } from '@mui/material'
import AxiosInstance from '../../context/AuthContext'
import { PlusIcon } from '../../assets/PlusIcon'

export default function GestionProductos() {
	const formRef = useRef()
	const dialog = useRef()
	const [type, setType] = useState(false)
	const [open, setOpen] = useState(false)
	const [productos, setProductos] = useState([])
	const [page, setPage] = useState(1)
	const [editProducto, setEditProducto] = useState(null)

	useEffect(() => {
		fetchProductos()
	}, [])

	const cambiarPagina = async (value) => {
		setPage(value)
		if (value > page && productos.next) {
			const response = await AxiosInstance.get(productos.next)
			if (response) {
				setProductos(response.data)
				console.log(response.data)
			}
		} else if (value < page && productos.previous) {
			const response = await AxiosInstance.get(productos.previous)
			if (response) {
				setProductos(response.data)
				console.log(response.data)
			}
		}
	}

	const displayPagination = useCallback(() => {
		const min = (((page) * 10) + 1) - 10
		const max = ((page + 1) * 10) - 10
		return `Mostrando ${min}-${max > productos.count ? productos.count : max} de ${productos.count}`
	}, [page, productos])

	const fetchProductos = async () => {
		const response = await AxiosInstance.get('/api/productos')
		if (response) {
			setProductos(response.data)
			console.log(response)
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

			<Typography
				variant='h4'
			>
				Gestión de productos
			</Typography>

			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					padding: 2
				}}>
				<Button
					startIcon={<PlusIcon />}
					variant="contained"
					onClick={handleCreateProducto}
					color="primary"
					sx={{
						flex: 1,
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
				<Box
					sx={{
						flex: 3,
						display: 'flex',
						justifyContent: 'right',
						alignItems: 'center',
						width: '100%',
						gap: 2,
					}}>
					<Button
						variant="contained"
						color=""
						onClick={() => cambiarPagina(page - 1)}
						disabled={!productos.previous}
						sx={{
							border: 1,
							borderRadius: 2,
							px: 4,
							py: 1,
							textTransform: 'none',
							fontWeight: 500
						}}
					>
						Anterior
					</Button>

					<Typography
						align='center'
					>
						{displayPagination()}
					</Typography>

					<Button
						variant="contained"
						color=""
						onClick={() => cambiarPagina(page + 1)}
						disabled={!productos.next}
						sx={{
							border: 1,
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


			<ProductTable
				products={productos.results}
				onEdit={handleEditProducto}
				rowcount={productos.count}
				page={page}
			/>

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