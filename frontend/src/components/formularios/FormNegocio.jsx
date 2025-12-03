import React, { useEffect, useEffectEvent, useImperativeHandle } from 'react'
import noimgfound from '../../assets/noimgfound.jpg'
import DropZone from './DropZone'
import { Box, CircularProgress, InputLabel, TextField, Typography } from '@mui/material'

const NOMBRE_MAX_LENGTH = 64
const DESCRIPCION_MAX_LENGTH = 128
const DIRECCION_MAX_LENGTH = 128
const TELEFONO_MAX_LENGTH = 10

export default function FormNegocio({ negocio = null, onSubmit = null, ref }) {
    const [nombre, setNombre] = React.useState(negocio ? negocio.nombre : '')
    const [descripcion, setDescripcion] = React.useState(negocio ? negocio.descripcion : '')
    const [direccion, setDireccion] = React.useState(negocio ? negocio.direccion : '')
    const [telefono, setTelefono] = React.useState(negocio ? negocio.telefono : '')
    const [file, setFile] = React.useState(null)
    const [preview, setPreview] = React.useState(negocio ? negocio.banner_img : '')
    const [errors, setErrors] = React.useState({})

    useEffect(() => {
        console.log(file)
    }, [file])

    const validarTelefono = (value) => {
        const phoneRegex = /^\d{10}$/;
        if (value && !phoneRegex.test(value)) {
            setErrors({
                telefono: 'El número de teléfono debe contener exactamente 10 dígitos numéricos.'
            });
            return false
        } else {
            setErrors({});
            return true
        }
    }
    const handleSubmit = useEffectEvent(() => {
        if (!nombre.trim()) {
            console.log('El nombre está vacío');
            return false;
        }
        if (!descripcion.trim()) {
            console.log('La descripción está vacía');
            return false;
        }
        if (!direccion.trim()) {
            console.log('La dirección está vacía');
            return false;
        }
        if (!telefono.trim()) {
            console.log('El teléfono está vacío');
            return false;
        }

        if (!validarTelefono(telefono.trim())) {
            console.log('El teléfono es inválido');
            return false;
        }

        onSubmit?.({
            pk: negocio ? negocio.uuid : null,
            nombre,
            descripcion,
            direccion,
            telefono,
            banner_img: file,
        })
    })
    const handleReset = () => {
        setNombre('')
        setDescripcion('')
        setDireccion('')
        setTelefono('')
    }
    useImperativeHandle(ref, () => ({
        submit: handleSubmit,
        reset: handleReset,
    }), [])

    if (!negocio) {
        return (
            <CircularProgress />
        )
    }

    return (
        <form action="#" method="get" className='p-3 d-flex flex-column w-100'>
            <div className="mb-3 row justify-content-center row-gap-3">
                <div className="col-6 col-sm-3 d-flex align-items-center">
                    <div className="ratio ratio-1x1">
                        <img
                            src={preview || noimgfound}
                            alt="Preview del archivo"
                            className="img-thumbnail w-100 h-100 object-fit-cover"
                        />
                    </div>
                </div>
                <div className="col-12 col-sm-9 d-flex flex-column row-gap-3">
                    {/* <DropZone currentFile={file} onFileUploaded={handleFileUploaded} ></DropZone> */}

                    <DropZone onFileUploaded={(file) => {
                        console.log(file)
                        setFile(file)
                        const fileReader = new FileReader()
                        fileReader.onload = (e) => {
                            setPreview(e.target.result)
                        }
                        fileReader.readAsDataURL(file)
                    }} />
                </div>
            </div>

            <div className="mb-3 row justify-content-center row-gap-3">
                <Box sx={{ position: 'relative', width: '100%' }}>
                    <InputLabel>Nombre del negocio</InputLabel>
                    <TextField
                        name='nombre'
                        size="medium"
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
                            right: 16,
                            color: nombre.length === NOMBRE_MAX_LENGTH ? 'error.main' :
                                nombre.length >= Math.floor(NOMBRE_MAX_LENGTH * 0.75) ? '#ffb700ff' :
                                    'text.secondary'
                            ,
                        }}
                    >
                        {`${nombre.length}/${NOMBRE_MAX_LENGTH}`}
                    </Typography>
                </Box>
            </div>

            <div className="mb-3 row justify-content-center row-gap-3">
                <Box sx={{ position: 'relative', width: '100%' }}>
                    <InputLabel>Descripción del negocio</InputLabel>
                    <TextField
                        size="medium"
                        hiddenLabel
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={4}
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
                            right: 16,
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

            <div className="mb-3 row justify-content-center row-gap-3">
                <Box sx={{ position: 'relative', width: '100%' }}>
                    <InputLabel>Dirección del negocio</InputLabel>
                    <TextField
                        size="medium"
                        hiddenLabel
                        fullWidth
                        multiline
                        minRows={1}
                        maxRows={2}
                        value={direccion}
                        onChange={({ target }) => {
                            if (target.value.length <= DIRECCION_MAX_LENGTH)
                                setDireccion(target.value)
                        }}
                        onBlur={({ target }) => { setDireccion(target.value.trim()) }}
                    />
                    <Typography
                        variant="caption"
                        sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 16,
                            color: direccion.length === DIRECCION_MAX_LENGTH ? 'error.main' :
                                direccion.length >= Math.floor(DIRECCION_MAX_LENGTH * 0.75) ? '#ffb700ff' :
                                    'text.secondary'
                            ,
                        }}
                    >
                        {`${direccion.length}/${DIRECCION_MAX_LENGTH}`}
                    </Typography>
                </Box>
            </div>

            <div className="mb-3 row justify-content-center row-gap-3">
                <Box sx={{ position: 'relative', width: '100%' }}>
                    <InputLabel>Teléfono del negocio</InputLabel>
                    <TextField
                        size="medium"
                        hiddenLabel
                        fullWidth
                        multiline
                        minRows={1}
                        maxRows={2}
                        value={telefono}
                        onChange={({ target }) => {
                            if (target.value.length <= TELEFONO_MAX_LENGTH) {
                                validarTelefono(target.value);
                                setTelefono(target.value)
                            }
                        }}
                        onBlur={({ target }) => { setTelefono(target.value.trim()) }}
                        error={!!errors.telefono}
                        helperText={errors.telefono || ''}
                    />
                    <Typography
                        variant="caption"
                        sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 16,
                            color: telefono.length === TELEFONO_MAX_LENGTH ? 'error.main' :
                                telefono.length >= Math.floor(TELEFONO_MAX_LENGTH * 0.75) ? '#ffb700ff' : 'text.secondary'
                            ,
                        }}
                    >
                        {`${telefono.length}/${TELEFONO_MAX_LENGTH}`}
                    </Typography>
                </Box>
            </div>
        </form>
    )
}
