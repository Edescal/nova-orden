import noimgfound from '../../assets/noimgfound.jpg'
import Paper from '@mui/material/Paper';
import { Box, Button, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { numberToMoney } from '../../utils/numberToMoney';
import { useEffect, useState } from 'react';
import AxiosInstance from '../../context/AuthContext';

const ProductTable = ({ products = [], onEdit = null, onDelete = null }) => {
    const [categorias, setCategorias] = useState([])

    const convertCategoria = (id) => {
        if (!categorias || categorias.length === 0) return 'No definido'
        const filter = categorias.find(c => c.id === id)
        return filter.nombre ?? id
    }

    useEffect(() => {
        (async () => {
            const response = await AxiosInstance.get('/api/categorias/')
            if (response) {
                console.log(response.data)
                setCategorias(response.data.results ?? [])
            }
        })()
    }, [])

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
            onDelete?.(producto)
        }
    }

    return (
        <TableContainer component={Paper} elevation={4} style={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                                <img src={producto.imagen ?? noimgfound} alt="Producto" style={{ width: '50px', height: '100%' }} />
                            </TableCell>
                            <TableCell>{producto.nombre}</TableCell>
                            <TableCell>{numberToMoney(producto.precio)}</TableCell>
                            <TableCell>
                                <Switch defaultChecked={producto.visible} onChange={handleChangeVisibility.bind(null, producto)} />
                            </TableCell>
                            <TableCell>{convertCategoria(producto.categoria)}</TableCell>
                            <TableCell>
                                <Box alignItems={'center'}
                                    justifyContent={'center'}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleEdit.bind(null, producto)}
                                        style={{ marginRight: 8 }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleDelete.bind(null, producto)}
                                        style={{ marginRight: 8 }}
                                    >
                                        Eliminar
                                    </Button>
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
