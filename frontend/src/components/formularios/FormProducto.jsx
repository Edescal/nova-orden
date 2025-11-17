import { useEffect, useEffectEvent, useState } from "react";
import CrearGrupoOpciones from "./CrearGrupoOpciones";
import { get, post, put } from "../../utils/apiUtils";
import { TextField, Button, Select, MenuItem, InputLabel, InputAdornment, Typography, Box, IconButton, Icon } from '@mui/material'
import DropZone from "./DropZone";
import { CrossIcon } from "../../assets/CrossIcon";
import noimgfound from '../../assets/noimgfound.jpg'
import '../../css/FormProducto.css'
import { useModal } from "../../context/ModalContext";

export default function FormProducto({ producto = null, onSubmit = null, type = 'editar' }) {
    const modal = useModal()

    const NOMBRE_MAX_LENGTH = 64
    const DESCRIPCION_MAX_LENGTH = 128

    const [categorias, setCategorias] = useState([])

    const [id, setId] = useState(-1)
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [precio, setPrecio] = useState(0)
    const [categoria, setCategoria] = useState(-1)
    const [imagen, setImagen] = useState('')
    const [base64imagen, setBase64Imagen] = useState(null)
    const [grupos, setGrupos] = useState([])
    const [file, setFile] = useState(null)

    const validarDatos = () => {
        if (!nombre.trim()) {
            console.log('El nombre está vacío');
            return false;
        }

        if (!descripcion.trim()) {
            console.log('La descripción está vacía');
            return false;
        }

        if (precio <= 0) {
            console.log('El precio debe ser mayor que 0');
            return false;
        }

        if (categoria === -1) {
            console.log('La categoría no está seleccionada');
            return false;
        }

        return true;
    };

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
        setId(producto.id)
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
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result.split(',')[1]
            setBase64Imagen(base64)
        }
        reader.readAsDataURL(file)

        const url = URL.createObjectURL(file)
        setImagen(url)
        return () => URL.revokeObjectURL(url)
    }, [file])

    const handleSubmit = (grupos) => {
        if (!validarDatos()) {
            console.log('Hay datos no válidos')
            return
        }

        console.log('Recuperando información de grupos...')
        // console.log(grupos.map(p => p.id))
        const producto = {
            id,
            nombre,
            descripcion,
            precio,
            'option_groups': grupos,
            categoria: categoria,
            visible: true,
            negocio: "3c02f6c8-b916-424e-9bd0-0cb1334b3de2",
        }
        console.log(producto)

        modal.confirm(
            <>
                <span>Estás a punto de modificar un producto, ¿estás de acuerdo?</span>
            </>,
            () => realizarTransacción(producto)
        )
    }

    const realizarTransacción = useEffectEvent(async (producto) => {
        const method = type === 'editar' ? put : type === 'crear' ? post : null
        if (!method) {
            console.log('No method!')
            return
        }
        const URL = type === 'editar' ? `/api/productos/${id}/` : type === 'crear' ? `/api/productos/` : null
        const response = await method(URL, producto)
        if (response) {
            console.log(response)
            console.log('Se actualizó un producto')
            if (file) {
                const formdata = new FormData()
                formdata.append('imagen', file)
                formdata.append('categoria', categoria)
                console.log(file)
                const imgResponse = await put(`/api/productos/${response.id}/`, formdata, true)
                if (imgResponse) {
                    console.log('Se actualizó su imagen')
                    console.log(imgResponse)
                }
            }
            onSubmit?.(response)
        }
    })

    return (
        <form action="#" className='p-3 d-flex flex-column w-100' method="dialog">
            <div className="col-12 p-3">
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
                        onChange={({ target }) => {
                            const value = target.value;
                            setPrecio(value);
                        }}
                        onBlur={({ target }) => {
                            let value = parseFloat(target.value);
                            if (isNaN(value)) value = "";
                            if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                                setPrecio(Number(value).toFixed(2));
                            }
                        }}
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
                                <MenuItem value="" disabled>No hay categorías para mostrar</MenuItem>
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
            <div className="border-end d-none d-sm-block"></div>

            <div className="col-12 p-3" >
                <CrearGrupoOpciones initialData={grupos} onSubmit={handleSubmit}></CrearGrupoOpciones>
            </div>
        </form>
    )
}
