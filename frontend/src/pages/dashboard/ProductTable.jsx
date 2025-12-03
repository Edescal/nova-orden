import noimgfound from '../../assets/noimgfound.jpg'
import Paper from '@mui/material/Paper';
import { Box, Button, IconButton, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { numberToMoney } from '../../utils/numberToMoney';
import { useEffect, useState } from 'react';
import AxiosInstance from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';

const ProductTable = ({ products = [], categorias = [], onEdit = null, onDelete = null }) => {
    const modal = useModal()

    const convertCategoria = (id) => {
        if (!categorias || categorias.length === 0) return 'No definido'
        const filter = categorias.find(c => c.id === id)
        return filter.nombre ?? id
    }

    const handleEdit = (producto) => {
        if (producto) {
            console.log('Editando: ', producto.nombre)
            onEdit?.(producto)
        }
    }

    const handleChangeVisibility = async (producto, evt) => {
        console.log('Cambiando visibilidad')
        if (producto) {
            console.log(evt.target.checked);
            const response = await AxiosInstance.put(`/api/productos/${producto.id}/update-visible/`, {
                visible: evt.target.checked,
            })
            if (response) {
                console.log(response)
            }
        }
    }

    const handleDelete = (producto) => {
        if (producto) {
            console.log('Eliminando: ', producto.nombre)
            modal.confirm(
                <div className="text-center">
                    <p className="mt-3 mb-1">¿Quieres eliminar el producto <strong>{producto.nombre}</strong>? Esta acción es irreversible.</p>
                </div>,
                () => {
                    console.log('Eliminando: ', producto.nombre)
                    onDelete?.(producto)
                }
            )
        }
    }

    return (
        <TableContainer component={Paper} elevation={2} style={{ overflowX: 'auto' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Imagen</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Precio</TableCell>
                        <TableCell>Visible</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((producto, index) => (
                        <TableRow key={producto.id}>
                            <TableCell>{producto.id}</TableCell>
                            <TableCell>
                                <div className='ratio ratio-1x1'>

                                <img src={producto.imagen || noimgfound} alt="Producto"  />
                                </div>
                            </TableCell>
                            <TableCell>{producto.nombre}</TableCell>
                            <TableCell>{numberToMoney(producto.precio)}</TableCell>
                            <TableCell>
                                <Switch defaultChecked={producto.visible} onChange={handleChangeVisibility.bind(null, producto)} />
                            </TableCell>
                            <TableCell>{convertCategoria(producto.categoria)}</TableCell>
                            <TableCell>
                                <Box
                                    display={'flex'}
                                    columnGap={1}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                >
                                    <IconButton
                                        onClick={handleEdit.bind(null, producto)}
                                        color="primary"
                                        sx={{
                                            border: 2
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1m-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71m10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z" /></svg>
                                    </IconButton>
                                    <IconButton
                                        onClick={handleDelete.bind(null, producto)}
                                        color="error"
                                        sx={{
                                            border: 2
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 26 26"><path fill="currentColor" d="M11.5-.031c-1.958 0-3.531 1.627-3.531 3.594V4H4c-.551 0-1 .449-1 1v1H2v2h2v15c0 1.645 1.355 3 3 3h12c1.645 0 3-1.355 3-3V8h2V6h-1V5c0-.551-.449-1-1-1h-3.969v-.438c0-1.966-1.573-3.593-3.531-3.593zm0 2.062h3c.804 0 1.469.656 1.469 1.531V4H10.03v-.438c0-.875.665-1.53 1.469-1.53zM6 8h5.125c.124.013.247.031.375.031h3c.128 0 .25-.018.375-.031H20v15c0 .563-.437 1-1 1H7c-.563 0-1-.437-1-1zm2 2v12h2V10zm4 0v12h2V10zm4 0v12h2V10z" /></svg>
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProductTable;
