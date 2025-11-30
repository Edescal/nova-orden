import { useCallback, useEffect, useEffectEvent, useImperativeHandle, useState } from "react";
import { TextField, Button, Select, MenuItem, InputLabel, InputAdornment, Typography, Box, Switch } from '@mui/material'
import DropZone from "./DropZone";
import { CrossIcon } from "../../assets/CrossIcon";
import noimgfound from '../../assets/noimgfound.jpg'
import '../../css/FormProducto.css'
import { useModal } from "../../context/ModalContext";
import { PlusIcon } from "../../assets/PlusIcon";
import CrearOpciones from "./CrearOpciones";
import AxiosInstance from "../../context/AuthContext";

export default function FormProducto({ producto = null, onSubmit = null, ref = null }) {
    const modal = useModal()
    const NOMBRE_MAX_LENGTH = 64
    const DESCRIPCION_MAX_LENGTH = 128

    const [categorias, setCategorias] = useState([])
    const [id, setId] = useState(null)
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [precio, setPrecio] = useState(0)
    const [categoria, setCategoria] = useState(-1)
    const [imagen, setImagen] = useState('')
    const [grupos, setGrupos] = useState([])
    const [file, setFile] = useState(null)
    const [visible, setVisible] = useState(true)
    const [previewURL, setPreviewURL] = useState('')

    useEffect(() => {
        (async () => {
            const response = await AxiosInstance.get('/api/categorias')
            if (response) {
                const filter = response.data.results.map(({ id, nombre }) => ({ id, nombre }))
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
        setVisible(producto.visible)
    }, [producto])

    useEffect(() => {
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setPreviewURL(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            setPreviewURL(null)
        }
    }, [file])

    const addGroup = () => {
        setGrupos(
            [...grupos, {
                id: null,
                descripcion: `Opción extra ${grupos.length + 1}`,
                precio: 0,
            }]
        )
    }
    const removeGroup = ({ id }) => {
        setGrupos(grupos.filter(grupo => grupo.id !== id))
    }
    const updateGroup = (data) => {
        setGrupos(prev => prev.map(grupo => {
            if (grupo.id !== data.id) {
                return grupo
            }
            grupo.descripcion = data.descripcion ?? grupo.descripcion
            grupo.producto = data.producto ?? grupo.producto
            grupo.opciones = data.opciones ?? grupo.opciones
            return grupo
        }))
    }

    const handleFileUploaded = (file) => {
        setFile(file)
    }

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
    }

    const handleSubmit = useEffectEvent(() => {
        if (!validarDatos()) {
            console.log('Hay datos no válidos')
            return
        }
        const formData = new FormData()
        formData.append('id', id)
        formData.append('nombre', nombre)
        formData.append('descripcion', descripcion)
        formData.append('precio', precio)
        formData.append('categoria', categoria)
        formData.append('visible', visible)
        formData.append('negocio', "3c02f6c8-b916-424e-9bd0-0cb1334b3de2")
        formData.append('option_groups', JSON.stringify(grupos))
        if (file) {
            formData.append('imagen', file)
        }
        console.log('Datos válidos:');
        console.log(Object.fromEntries(formData))
        modal.confirm(
            <p className='text-center mb-2'>Estás a punto de modificar un producto, ¿estás de acuerdo?</p>,
            () => onSubmit?.(formData)
        )
    })

    const reset = useCallback(() => {
        setId(null)
        setNombre('')
        setDescripcion('')
        setPrecio(0)
        setCategoria('-1')
        setImagen('')
        setGrupos([])
        setVisible(false)
    }, [])

    useImperativeHandle(ref, () => {
        return {
            submit: handleSubmit,
            reset: reset,
        }
    }, [])

    return (
        <form action="#" className='p-3 d-flex flex-column w-100' method="dialog">
            <div className="col-12 p-3">
                <div className="mb-3 row">
                    <div className="col-4 col-sm-3 d-flex align-items-center">
                        <div className="ratio ratio-1x1">
                            <img
                                src={previewURL ? previewURL : imagen ? imagen : noimgfound}
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

                {producto && (
                    <div className="mb-3 d-flex align-items-center justify-content-end">
                        <Switch defaultChecked={!producto.visible}
                            value={visible}
                            onChange={() => setVisible(!visible)}
                        />
                        <InputLabel id="precioLabel">Ocultar producto</InputLabel>
                    </div>
                )}

                <div className="mb-3 d-flex flex-row justify-content-between column-gap-3">
                    <div className="w-50">
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

                    <div className="w-50">
                        <InputLabel id="categoriaLabel">Categoría</InputLabel>
                        <Select
                            labelId="categoriaLabel"
                            id="categoria"
                            size="small"
                            defaultValue=""
                            value={categorias.length > 0 ? categoria : ""}
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
                </div>

                <div className='mb-3'>
                    <InputLabel id="imagenLabel">Sube una fotografía del producto</InputLabel>
                    <DropZone currentFile={file} onFileUploaded={handleFileUploaded} ></DropZone>
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
                <div className='mb-3'>
                    <div className='d-flex column-gap-3 justify-content-between'>
                        <Button variant='standard'
                            className='mb-2'
                            startIcon={<PlusIcon />}
                            onClick={() => addGroup()}
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '#333'
                                }
                            }}
                        >
                            Nuevo grupo de opciones
                        </Button>
                    </div>

                    <fieldset className='mb-3'>
                        {grupos.length > 0 ? grupos.map((grupo) => {
                            return (
                                <div key={grupo.id} className='d-flex flex-column border-bottom-0' >
                                    <CrearOpciones initialData={grupo} onZeroItems={() => { removeGroup(grupo) }} onChangeData={updateGroup} />
                                </div>
                            );
                        }) :
                            <div className='card p-3 d-flex flex-column justify-content-center align-items-center text-secondary mb-3' style={{ height: 150 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24"><path fill="currentColor" d="M18.06 23h1.66c.84 0 1.53-.65 1.63-1.47L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26c1.44 1.42 2.43 2.89 2.43 5.29zM1 22v-1h15.03v1c0 .54-.45 1-1.03 1H2c-.55 0-1-.46-1-1m15.03-7C16.03 7 1 7 1 15zM1 17h15v2H1z" /></svg>
                                <span>No hay ningún grupo de opciones</span>
                            </div>
                        }
                    </fieldset>
                </div>
            </div>
        </form>
    )
}
