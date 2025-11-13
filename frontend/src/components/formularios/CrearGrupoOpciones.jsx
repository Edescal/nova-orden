import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { PlusIcon } from '../../assets/PlusIcon'
import CrearOpciones from './CrearOpciones'

/// Este componeente triggerea el submit de FormProducto
export default function CrearGrupoOpciones({ initialData = null, onZeroItems = null, onSubmit = null }) {
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

    const handleOpcionUpdated = (grupo) => {
        console.log('Grupo actualizado:')
        const newCtx = grupos.map(g => { 
            if (g.id === grupo.id) {
                g['submitedData'] = grupo
            }
            return g
         })
        setGrupos(newCtx)
    }

    const handleSubmit = (evt) => {
        console.log('Inicia el submit de un producto')
        const faltanDatos = grupos.some(g => !g.submitedData)
        console.log(`Faltan datos de grupos: ${faltanDatos}`)
        onSubmit?.(grupos)
    }

    return (
        <div className='mb-3'>
            <div className='d-flex column-gap-3 justify-content-between'>
                <Button variant='standard'
                    className='mb-2'
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

                <Button variant='standard'
                    className='mb-2'
                    startIcon={<PlusIcon />}
                    onClick={evt => handleSubmit(evt)}
                    sx={{
                        backgroundColor: 'blue',
                        color: 'white',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: '#520effff'
                        }
                    }}
                >
                    Guardar producto
                </Button>
            </div>

            <fieldset className='mb-3'>
                {grupos.length > 0
                    ? grupos.map((grupo) => {
                        return (
                            <div key={grupo.id} className='d-flex flex-column border-bottom-0' >
                                <CrearOpciones initialData={grupo} onZeroItems={() => { removeItem(grupo) }} onChangeData={handleOpcionUpdated}/>
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
    )
}
