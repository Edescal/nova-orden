import { Box, InputLabel, TextField, Typography } from '@mui/material'
import React, { useEffect, useEffectEvent, useImperativeHandle, useState } from 'react'
import { useModal } from '../../context/ModalContext'

const NOMBRE_MAX_LENGTH = 48

export default function FormCategorias({ categoria = null, onSubmit = null, ref = null }) {
    const modal = useModal()
    const [nombre, setNombre] = useState('')

    useEffect(() => {
        setNombre(categoria ? categoria.nombre : '')
    }, [categoria])

    const handleSubmit = useEffectEvent(() => {
        if (!nombre.trim()) {
            console.log('El nombre está vacío');
            return false;
        }
        const formData = {
            'pk': categoria ? categoria.id : null,
            'nombre': nombre,
        }
        modal.confirm(
            <p className='text-center mb-2'>¿Estás seguro de crear una nueva categoría?</p>,
            () => onSubmit?.(formData)
        )
    })

    const handleReset = () => {
        setNombre('')
    }

    useImperativeHandle(ref, () => {
        return {
            submit: handleSubmit,
            reset: handleReset,
        }
    }, [])

    return (
        <form action="#" method='dialog' className='d-flex flex-column' >
            <div className="col-12 p-3">
                <div className="mb-3 row">
                    <Box sx={{ position: 'relative', width: '100%' }}>
                        <InputLabel>Nombre</InputLabel>
                        <TextField
                            id='nombre'
                            name='nombre'
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
                                bottom: 3,
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
            </div>

        </form>
    )
}
