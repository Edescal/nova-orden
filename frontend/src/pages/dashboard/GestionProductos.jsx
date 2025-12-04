import { useCallback, useEffect, useRef, useState } from 'react'
import Template from './Template'
import ProductTable from './ProductTable'
import FormProducto from '../../components/formularios/FormProducto'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Paper, IconButton, Grid } from '@mui/material'
import AxiosInstance, { useAuth } from '../../context/AuthContext'
import { PlusIcon } from '../../assets/PlusIcon'
import TablaCategorias from './TablaCategorias'
import FormCategorias from '../../components/formularios/FormCategorias'
import TestTemplate from '../TestTemplate'
import FormNegocio from '../../components/formularios/FormNegocio'
import noimgfound from '../../assets/noimgfound.jpg'
import { Link } from 'react-router-dom'
import ProductoChart from '../../components/charts/ProductoChart'
import UltimasOrdenes from '../../components/charts/UltimasOrdenes'


export default function GestionProductos() {

	const auth = useAuth()
	const formRef = useRef()
	const form = useRef() //form categorias

	const [open, setOpen] = useState(false)
	const [productos, setProductos] = useState([])
	const [categorias, setCategorias] = useState([])
	const [page, setPage] = useState(1)
	const [editProducto, setEditProducto] = useState(null)
	const [disablePaginationButtons, setDisablePaginationButtons] = useState(false)

	//Para el CRUD de categorias
	const [negocio, setNegocio] = useState(null)
	const [openCategoria, setOpenCategoria] = useState(false)
	const [editCategoria, setEditCategoria] = useState(null)

	// CRUD negocio
	const [openNegocio, setOpenNegocio] = useState(false)
	const formNegocio = useRef()

	useEffect(() => {
		fetchNegocio()
		fetchProductos()
		fetchCategorias()
	}, [])

	const cambiarPagina = async (value) => {
		setDisablePaginationButtons(true)
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
		setDisablePaginationButtons(false)
	}

	const displayPagination = useCallback(() => {
		const min = (((page) * 10) + 1) - 10
		const max = ((page + 1) * 10) - 10
		return `Mostrando ${min}-${max > productos.count ? productos.count : max} de ${productos.count}`
	}, [page, productos])

	const fetchNegocio = async () => {
		const res = await auth.whoami()
		if (res) {
			console.log(res.data.user.negocios[0])
			setNegocio(res.data.user.negocios[0] || null)
		}
	}

	const fetchProductos = async () => {
		const response = await AxiosInstance.get('/api/productos')
		if (response) {
			console.log(response)
			setProductos(response.data)
			setPage(1)
		}
	}

	const fetchCategorias = async () => {
		const response = await AxiosInstance.get('/api/categorias')
		if (response) {
			setCategorias(response.data)
			console.log(response)
		}
	}

	// CRUD productos
	const handleCreateProducto = () => {
		setEditProducto(null)
		setOpen(true)
	}

	const handleEditProducto = (producto) => {
		setEditProducto(producto)
		setOpen(true)
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
		console.log('Success')
		fetchProductos()
		setOpen(false)
	}

	const handleDeleteProducto = async (producto) => {
		console.log('Eliminar producto: ', producto.nombre)
		const response = await AxiosInstance.delete(`/api/productos/${producto.id}/`)
		if (response) {
			console.log('Producto eliminado')
			console.log(response)
			fetchProductos()
		}
	}


	// Categorias
	const handleCreateCategoria = () => {
		setEditCategoria(null)
		setOpenCategoria(true)
	}

	const btnResetFormCategoria = (evt) => {
		evt.preventDefault()
		form.current?.reset()
		setOpenCategoria(false)
	}

	const btnSubmitFormCategoria = (evt) => {
		evt.preventDefault()
		form.current?.submit()
	}

	const handleSubmitCategoria = async (data) => {
		data = {
			...data,
			negocio: negocio.id,
		}
		console.log(data)
		if (data.pk) {
			console.log('Actualizar categoría');
			const response = await AxiosInstance.patch(`/api/categorias/${data.pk}/`, data)
			if (response) {
				console.log('Success');
				console.log(response)
				setOpenCategoria(false);
				fetchCategorias()
			}
		} else {
			console.log('Crear categoría');
			const response = await AxiosInstance.post('/api/categorias/', data)
			if (response) {
				console.log('Success');
				console.log(response)
				setOpenCategoria(false);
				fetchCategorias()
			}
		}
	}

	const handleDeleteCategoria = async (categoria) => {
		console.log('Eliminar categoría: ', categoria.nombre)
		const response = await AxiosInstance.delete(`/api/categorias/${categoria.id}/`)
		if (response) {
			console.log('Categoría eliminada')
			fetchCategorias()
		}
	}

	// NEGOCIO
	const btnResetNegocioForm = (evt) => {
		evt.preventDefault()
		formNegocio.current?.reset()
		setOpenNegocio(false)
	}

	const btnSubmitNegocioForm = (evt) => {
		evt.preventDefault()
		formNegocio.current?.submit()
	}

	const handleSubmitNegocio = async (data) => {
		if (!negocio) return

		const formData = new FormData()

		formData.append('nombre', data.nombre);
		formData.append('descripcion', data.descripcion);
		formData.append('direccion', data.direccion);
		formData.append('telefono', data.telefono);
		if (data.banner_img && data.banner_img[0]) {
			formData.append('banner_img', data.banner_img);
		}

		const response = await AxiosInstance.patch(`/api/negocios/${negocio.uuid}/`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			}
		})
		if (response) {
			console.log(response)
			console.log('Actualización exitosa');
			setOpenNegocio(false)
			fetchNegocio()
		} else {
			console.log('Error al actualizar el negocio')
		}
	}

	return (
		<TestTemplate>
			<div className='d-flex flex-column'>
				<Typography
					variant='h4'
					sx={{
						marginBottom: 2,
					}}
				>
					Gestión del negocio
				</Typography>


				<Grid container spacing={3} sx={{ marginBottom: 3 }} alignItems={'stretch'}>
					<Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }} flex={1} >
						<Paper elevation={5} sx={{ padding: 3, borderRadius: 5, marginBottom: 1, height: '100%' }}>
							<Box sx={{
								display: 'flex',
								flexFlow: 'row wrap',
								justifyContent: 'space-between',
								alignItems: 'center',
								width: '100%',
								gap: 3,
								paddingBottom: 2
							}}>
								<Typography variant='h4' sx={{
									flex: 2,
								}}>
									Tu negocio
								</Typography>
								<Button
									startIcon={<PlusIcon />}
									variant="contained"
									onClick={() => setOpenNegocio(true)}
									color="primary"
									sx={{
										alignSelf: 'center',
										borderRadius: 2,
										padding: 1,
										textTransform: 'none',
										fontSize: '1rem',
										fontWeight: 500,
										boxShadow: 3,
										'&:hover': {
											boxShadow: 6
										}
									}}
								>
									Editar
								</Button>
							</Box>

							<div className='row d-flex align-items-center w-100'>
								<div className='col-5'>
									<div className="ratio ratio-1x1">
										<img
											src={negocio?.banner_img || noimgfound}
											alt="Preview del archivo"
											className="img-thumbnail w-100 h-100 object-fit-cover"
										/>
									</div>
								</div>
								<div className='col-7'>
									<Typography variant='h6' className="font-weight-bold mb-2">
										<Link to={negocio ? `/${negocio.slug}/menu` : '#'} className='text-decoration-none'>
											{negocio ? negocio.nombre : 'N/A'}
										</Link>
									</Typography>
									<Typography variant='body1' className="text-muted mb-3">
										{negocio ? negocio.descripcion : 'N/A'}
									</Typography>
									<div className="mb-2">
										<Typography variant='body2' className="text-secondary">Dirección: <strong>{negocio ? negocio.direccion : 'N/A'}</strong></Typography>
										<Typography variant='body2' className="text-secondary">Teléfono: <strong>{negocio ? negocio.telefono : 'N/A'}</strong></Typography>
									</div>
								</div>
							</div>

							<Dialog open={openNegocio} onClose={() => setOpenNegocio(false)} maxWidth="sm" fullWidth >
								<DialogTitle sx={{
									fontSize: '1.7rem',
									borderBottom: '1px solid #e0e0e0',
								}}>
									{negocio ? 'Editar negocio' : 'Crear negocio'}
								</DialogTitle>
								<DialogContent>
									<FormNegocio ref={formNegocio} negocio={negocio} onSubmit={handleSubmitNegocio} />
								</DialogContent>
								<DialogActions sx={{
									p: 2.5,
									bgcolor: '#fafafa',
									borderTop: '1px solid #e0e0e0',
								}}>
									<Button onClick={btnResetNegocioForm} type="submit" variant="contained" color='primary' className='fw-semibold'>
										Cerrar
									</Button>
									<Button onClick={btnSubmitNegocioForm} variant="contained" color='secondary' className='fw-semibold'>
										Guardar
									</Button>
								</DialogActions>
							</Dialog>
						</Paper>
					</Grid>

					<Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }} flex={1}>
						<Paper elevation={5} sx={{ padding: 3, paddingBottom: 1, borderRadius: 5, marginBottom: 1, height: '100%' }}>
							<Typography variant='h4' sx={{
								flex: 2,
								flexFlow: 'row wrap',
								marginBottom: 2,
							}}>
								Productos más vendidos
							</Typography>
							<ProductoChart></ProductoChart>
						</Paper>
					</Grid>

					<Grid size={{ xs: 12, sm: 12, md: 4 }} flex={1}>
						<Paper elevation={5} sx={{ padding: 3, paddingBottom: 1, borderRadius: 5, marginBottom: 1, height: '100%' }}>
							<Typography variant='h4' sx={{
								flex: 2,
								flexFlow: 'row wrap',
								marginBottom: 2,
							}}>
								Últimas órdenes
							</Typography>
							<div className='overflow-scroll' style={{ maxHeight: '150px' }}>
								<UltimasOrdenes />
							</div>
						</Paper>
					</Grid>
				</Grid>

				<Grid container spacing={3} >
					<Grid size={{ xs: 12, md: 7 }} >
						<Paper elevation={5} sx={{ padding: 2, borderRadius: 5, marginBottom: 1 }}>
							<Box sx={{
								display: 'flex',
								flexFlow: 'row wrap',
								justifyContent: 'center',
								alignItems: 'center',
								width: '100%',
								gap: 2,
								padding: 2,
								overflow: 'scroll'
							}}>
								<div className='d-flex justify-content-between flex-grow-1'>
									<Typography variant='h4' sx={{
										flex: 2,
									}}>
										Productos
									</Typography>
									<Button
										startIcon={<PlusIcon />}
										variant="contained"
										onClick={handleCreateProducto}
										color="primary"
										size='small'
										sx={{
											alignSelf: 'center',
											borderRadius: 2,
											padding: 1,
											textTransform: 'none',
											fontSize: '1rem',
											fontWeight: 500,
											boxShadow: 3,
											'&:hover': {
												boxShadow: 6
											}
										}}
									>
										Nuevo
									</Button>
								</div>

								<Box sx={{
									display: 'flex',
									justifyContent: 'right',
									alignItems: 'center',
									gap: 2,
								}}>
									<IconButton
										size='small'
										variant="contained"
										onClick={() => cambiarPagina(page - 1)}
										disabled={!productos.previous || disablePaginationButtons}
										sx={{
											border: 3,
											borderRadius: 2,
											padding: 1,
											textTransform: 'none',
											fontWeight: 500
										}}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z" /></svg>
									</IconButton>

									<Typography align='center' variant='subtitle2'>
										{displayPagination()}
									</Typography>

									<IconButton
										size='small'
										variant="contained"
										onClick={() => cambiarPagina(page + 1)}
										disabled={!productos.next || disablePaginationButtons}
										sx={{
											border: 3,
											borderRadius: 2,
											padding: 1,
											textTransform: 'none',
											fontWeight: 500
										}}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z" /></svg>
									</IconButton>
								</Box>
							</Box>

							<ProductTable
								products={productos.results}
								categorias={categorias.results}
								onEdit={handleEditProducto}
								onDelete={handleDeleteProducto}
								rowcount={productos.count}
								page={page}
							/>

							<Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth >
								<DialogTitle sx={{
									fontWeight: 600,
									fontSize: '1.7rem',
									borderBottom: '1px solid #e0e0e0',
								}}>
									{editProducto ? 'Editar producto existente' : 'Agregar un nuevo producto'}
								</DialogTitle>
								<DialogContent>
									<FormProducto ref={formRef} producto={editProducto} onSubmit={handleSubmitProducto} />
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
						</Paper>
					</Grid>

					<Grid size={{ xs: 12, md: 5 }} flex={1}>
						<Paper elevation={5} sx={{ padding: 2, borderRadius: 5, }}>
							<Box sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								width: '100%',
								gap: 3,
								padding: 2
							}}>
								<Typography variant='h4' sx={{
									flex: 2,
								}}>
									Categorías
								</Typography>
								<Button
									startIcon={<PlusIcon />}
									variant="contained"
									onClick={handleCreateCategoria}
									color="primary"
									sx={{
										alignSelf: 'center',
										borderRadius: 2,
										padding: 1,
										textTransform: 'none',
										fontSize: '1rem',
										fontWeight: 500,
										boxShadow: 3,
										'&:hover': {
											boxShadow: 6
										}
									}}
								>
									Nueva
								</Button>
							</Box>

							<TablaCategorias categorias={categorias.results} onDelete={handleDeleteCategoria} onEdit={(categoria) => { setEditCategoria(categoria); setOpenCategoria(true) }} />

							<Dialog open={openCategoria} onClose={() => setOpenCategoria(false)} maxWidth="sm" >
								<DialogTitle sx={{
									fontSize: '1.7rem',
									borderBottom: '1px solid #e0e0e0',
								}}>
									{editCategoria ? 'Editar categoría' : 'Crear categoría'}
								</DialogTitle>
								<DialogContent>
									<FormCategorias ref={form} categoria={editCategoria} onSubmit={handleSubmitCategoria} />
								</DialogContent>
								<DialogActions sx={{
									p: 2.5,
									bgcolor: '#fafafa',
									borderTop: '1px solid #e0e0e0',
								}}>
									<Button onClick={btnResetFormCategoria} type="submit" variant="contained" color='primary' className='fw-semibold'>
										Cerrar
									</Button>
									<Button onClick={btnSubmitFormCategoria} variant="contained" color='secondary' className='fw-semibold'>
										Guardar
									</Button>
								</DialogActions>
							</Dialog>
						</Paper>
					</Grid>
				</Grid>
			</div>
		</TestTemplate>
	)
}