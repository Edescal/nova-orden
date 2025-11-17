import noimgfound from '../../assets/noimgfound.jpg'
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, Button, Checkbox } from '@mui/material';
import { numberToMoney } from '../../utils/numberToMoney';
import { useEffect, useState } from 'react';
import { get, put } from '../../utils/apiUtils';
import Dialog from '../../components/Dialog';
import { useModal } from '../../context/ModalContext';

const ProductTable = ({ products = [], onAdd, onEdit, page = 0, rowcount = 10, handlePaginationChange = null }) => {
    const modal = useModal()

    const [categorias, setCategorias] = useState([])
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([])
    const [api, setApi] = useState(null)


    useEffect(() => {
        (async () => {
            const response = await get('/api/categorias/')
            if (response) {
                console.log(response)
                setCategorias(response.results)
            }
        })()
    }, [])


    useEffect(() => {
        setRows(products);
    }, [products]);

    const handleSelectionChange = (newSelection, p, s) => {
        setApi(p.api)
        setSelectedRows([...newSelection.ids])
    }

    const handleDeleteSelection = () => {
        if (selectedRows.length > 0) {

        }
    }
    const handleSaveSelection = () => {
        modal.confirm(
            <>
                <span>¿Deseas actualizar la información seleccionada?</span>
            </>,
            () => {
                if (selectedRows.length > 0) {
                    selectedRows.forEach(async id => {
                        const productoValues = api.getRowParams(id).row
                        console.log(productoValues)
                        const data = {
                            'id': productoValues.id,
                            'categoria': productoValues.categoria,
                            'visible': productoValues.visible,
                        }
                        const response = await put(`/api/productos/${id}/`, data)
                        if (response) {
                            console.log(response)
                        }
                    })
                }
            }
        )
    }

    const handleParsePrecio = (value, object) => {
        console.log(value)
        console.log(object)
        if (isNaN(value) || value < 0) {
            return 0
        }
        return value
    }

    const handleEdit = (id) => {
        const producto = products.find(p => p.id === id)
        if (producto) {
            console.log(producto)
            onEdit?.(producto)
        }
    }


    useEffect(() => {
        console.log(rows)
    }, [])

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            description: 'ID único del producto.',
            sortable: true,
            width: 80,
        },
        {
            field: 'imagen',
            headerName: 'Imagen',
            description: 'Imagen del producto.',
            align: 'center',
            sortable: false,
            resizable: false,
            width: 150,
            renderCell: (params) => <img src={params.value ?? noimgfound} alt="Producto" style={{ width: '50px', height: 'auto' }} />,
        },
        {
            field: 'nombre',
            headerName: 'Nombre',
            description: 'Nombre del producto.',
            sortable: true,
            resizable: false,
            width: 200,
        },
        {
            field: 'precio',
            headerName: 'Precio',
            description: 'Precio del producto.',
            editable: true,
            sortable: true,
            resizable: false,
            width: 80,
            renderCell: (col) => `${numberToMoney(col.value)}`,
            valueGetter: (col) => `${Number(col).toFixed(2)}`,
            valueParser: (value, params) => handleParsePrecio(value, params)
        },
        {
            field: 'visible',
            headerName: 'Visible',
            description: 'Indica si el producto es visible.',
            width: 100,
            editable: true,
            type: 'boolean',
            resizable: false,
        },
        {
            field: 'categoria',
            headerName: 'Categoría',
            description: 'Categoría del producto.',
            sortable: true,
            width: 150,
            valueGetter: (value) => {
                const filter = categorias.find(c => c.id === value)
                return filter.nombre ?? value
            },
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 200,
            sortable: false,
            flex: 1,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(params.row.id)}
                        style={{ marginRight: 8 }}
                    >
                        Editar
                    </Button>
                </div>
            ),
        }
    ]

    return (
        <>
            <div className='row d-flex justify-content-center'>
                <div className='col-12' >
                    <DataGrid
                        sx={{
                            display: 'grid',
                            gridTemplateRows: 'auto 1f auto',
                        }}
                        disableAutosize
                        editMode="cell"
                        checkboxSelection

                        columns={columns}
                        rows={rows}
                        pagination={false}
                        paginationModel={{ page, pageSize: 10 }}
                        paginationMode='server'
                        rowCount={rowcount}
                        handlePaginationChange={(evt) => { console.log(evt) }}

                        onPageSizeChange={() => { }}
                        onPaginationMetaChange={handlePaginationChange}

                        onRowSelectionModelChange={handleSelectionChange}
                    />
                </div>
            </div>
            <div className=' d-flex justify-content-between'>
                <Button variant="contained" color="secondary" onClick={handleSaveSelection} disabled={selectedRows.length === 0}>
                    Guardar visibilidad
                </Button>
                <Button variant="contained" color="secondary" onClick={handleDeleteSelection} disabled={selectedRows.length === 0}>
                    Eliminar seleccionados
                </Button>
            </div>
        </>

    );
};

export default ProductTable;
