import React, { useEffect, useState } from 'react'
import CrearOpciones from './CrearOpciones'
import { TextField, Button, Select, MenuItem, InputLabel, InputAdornment } from '@mui/material'
import { CrossIcon } from '../../assets/CrossIcon'
import { PlusIcon } from '../../assets/PlusIcon'


export default function CrearGrupoOpciones({ initialData = null, onZeroItems = null }) {
    const defaultValue = [{
        id: "grupo_1",
        descripcion: "Grupo 1",
        producto: -1,
    }]
    const [grupos, setGrupos] = useState([...defaultValue])
    useEffect(() => {
        if (!grupos) return
        if (grupos.length === 0 && onZeroItems) {
            onZeroItems()
        }
    }, [grupos])

    useEffect(() => {
        if (!initialData || initialData?.length === 0) return
        setGrupos([...initialData])
    }, [initialData])

    const addItem = () => {
        setGrupos(
            [...grupos, {
                id: `grupo_${grupos.length + 1}`,
                descripcion: `Grupo ${grupos.length + 1}`,
                producto: -1,
            }]
        )
    }
    const removeItem = ({ id }) => {
        setGrupos(grupos.filter(opcion => opcion.id !== id))
    }

    return (
        <div className='mb-3 bg-body-tertiary' >
            <Button variant='standard'
                startIcon={<PlusIcon />}
                onClick={() => addItem()}
                sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': {
                        backgroundColor: '#333'
                    }
                }}
            >
                Añadir nuevo grupo de opciones
            </Button>

            <fieldset className='mb-3'>
                {grupos.length > 0
                    ? grupos.map((grupo) => {
                        return (
                            <div key={grupo.id} className='d-flex flex-column border-bottom' >
                                <CrearOpciones initialData={grupo} onZeroItems={() => { removeItem(grupo) }} />
                            </div>
                        );
                    }) : null}
            </fieldset>
        </div>
    )
}
