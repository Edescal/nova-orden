import { useEffect, useState } from "react";
import CrearGrupoOpciones from "./CrearGrupoOpciones";
import { get } from "../../utils/apiUtils";
import { TextField, Button, Select, MenuItem, InputLabel, InputAdornment, Typography, Box, IconButton, Icon } from '@mui/material'
import DropZone from "./DropZone";
import { CrossIcon } from "../../assets/CrossIcon";
import noimgfound from '../../assets/noimgfound.jpg'

export default function FormProducto({ producto = null }) {
    const NOMBRE_MAX_LENGTH = 64
    const DESCRIPCION_MAX_LENGTH = 128

    const [categorias, setCategorias] = useState([])

    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [precio, setPrecio] = useState(0)
    const [categoria, setCategoria] = useState(-1)
    const [imagen, setImagen] = useState('')
    const [grupos, setGrupos] = useState([])
    const [file, setFile] = useState(null)

    useEffect(() => {
        (async () => {
            const data = await get('/api/categorias')
            if (data) {
                const filter = data.results.map(({ id, nombre }) => ({ id, nombre }))
                setCategorias(filter)
            }
        })()
    }, [])

    useEffect(() => {
        if (!producto) return
        setNombre(producto.nombre)
        setDescripcion(producto.descripcion)
        setPrecio(producto.precio)
        setCategoria(producto.categoria)
        setImagen(producto.imagen)
        setGrupos(producto.option_groups)
    }, [producto])

    useEffect(() => {
        if (!file) {
            setImagen(null)
            return
        }
        const url = URL.createObjectURL(file)
        setImagen(url)
        return () => URL.revokeObjectURL(url)
    }, [file])

    return (
        <form action="#" className='card p-3 d-flex flex-column flex-sm-row w-100'>
            <div className="col-12 col-sm-6 p-3">
                <h5 className="text-center mb-4">Agregar un nuevo producto</h5>
                <div className="mb-3 row">
                    <div className="col-4 col-sm-3 d-flex align-items-center">
                        <div className="ratio ratio-1x1">
                            <img
                                src={imagen ? imagen : noimgfound}
                                alt="Preview del archivo"
                                className="img-thumbnail w-100 h-100 object-fit-cover"
                            />
                        </div>
                    </div>
                    <div className="col-8 col-sm-9 d-flex flex-column row-gap-3">
                        <Box sx={{ position: 'relative', width: '100%' }}>
                            <InputLabel>Nombre</InputLabel>
                            <TextField
                                id='nombre'
                                name='nombre'
                                size="small"
                                hiddenLabel
                                fullWidth
                                value={nombre}
                                onChange={({ target }) => {
                                    if (target.value.length <= NOMBRE_MAX_LENGTH)
                                        setNombre(target.value)
                                }}
                                onBlur={({ target }) => { setNombre(target.value.trim()) }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    position: 'absolute',
                                    bottom: 4,
                                    right: 12,
                                    color: nombre.length === NOMBRE_MAX_LENGTH ? 'error.main' :
                                        nombre.length >= Math.floor(NOMBRE_MAX_LENGTH * 0.75) ? '#ffb700ff' :
                                            'text.secondary'
                                    ,
                                }}
                            >
                                {`${nombre.length}/${NOMBRE_MAX_LENGTH}`}
                            </Typography>
                        </Box>
                        <Box sx={{ position: 'relative', width: '100%' }}>
                            <InputLabel>Descripción</InputLabel>
                            <TextField
                                id="descripcion"
                                hiddenLabel
                                multiline
                                fullWidth
                                rows={2}
                                value={descripcion}
                                onChange={({ target }) => {
                                    if (target.value.length <= DESCRIPCION_MAX_LENGTH)
                                        setDescripcion(target.value)
                                }}
                                onBlur={({ target }) => { setDescripcion(target.value.trim()) }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    position: 'absolute',
                                    bottom: 4,
                                    right: 12,
                                    color: descripcion.length === DESCRIPCION_MAX_LENGTH ? 'error.main' :
                                        descripcion.length >= Math.floor(DESCRIPCION_MAX_LENGTH * 0.75) ? '#ffb700ff' :
                                            'text.secondary'
                                    ,
                                }}
                            >
                                {`${descripcion.length}/${DESCRIPCION_MAX_LENGTH}`}
                            </Typography>
                        </Box>
                    </div>
                </div>
                <div className="mb-3">
                </div>
                <div className="mb-3">
                    <InputLabel id="precioLabel">Precio</InputLabel>
                    <TextField
                        id="precio"
                        size="small"
                        value={precio}
                        onChange={({ target }) => setPrecio(target.value)}
                        hiddenLabel
                        fullWidth
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            },
                        }}
                    />
                </div>

                <div className="mb-3">
                    <InputLabel id="categoriaLabel">Categoría</InputLabel>
                    <Select
                        labelId="categoriaLabel"
                        id="categoria"
                        value={categoria}
                        onChange={({ target }) => setCategoria(target.value)}
                        fullWidth
                    >
                        <MenuItem value={-1} disabled>Elige la categoría</MenuItem>
                        {
                            categorias.length > 0 ? (
                                categorias.map(categoria => <MenuItem key={categoria.id} value={categoria.id}>{categoria.nombre}</MenuItem>)) :
                                <MenuItem value="" disables>No hay categorías para mostrar</MenuItem>
                        }
                    </Select>
                </div>

                <div className='mb-3'>
                    <InputLabel id="imagenLabel">Sube una fotografía del producto</InputLabel>
                    <DropZone currentFile={file} onFileUploaded={(file) => setFile(file)} ></DropZone>
                    {
                        file ?
                            <div className='d-flex justify-content-end align-items-center gap-3 py-2'>
                                <button className='btn btn-sm btn-danger d-flex align-items-center column-gap-2 fw-semibold' type='button' onClick={() => setFile(null)}>
                                    <CrossIcon /> Eliminar archivo
                                </button>
                            </div> : null
                    }
                </div>
            </div>

            <hr />

            <div className="col-12 col-sm-6 p-3">
                <CrearGrupoOpciones initialData={grupos}></CrearGrupoOpciones>
            </div>
        </form>
    )
}
