import { useEffect, useState } from 'react'
import { TextField, Button, Select, MenuItem, InputLabel, InputAdornment, Input, IconButton } from '@mui/material'
import { PlusIcon } from '../../assets/PlusIcon'
import { CrossIcon } from '../../assets/CrossIcon'

export default function CrearOpciones({ initialData = null, onZeroItems = null }) {
    const [nombre, setNombre] = useState('Nombre del grupo')

    const [id, setId] = useState(-1)
    const [productoId, setProductoId] = useState(-1)
    const [opciones, setOpciones] = useState([{
        id: "campo_1",
        descripcion: "Opción extra 1",
        precio: 0,
    }])

    const addItem = () => {
        setOpciones(
            [...opciones, {
                id: `campo_${opciones.length + 1}`,
                descripcion: `Opción extra ${opciones.length + 1}`,
                precio: 0,
            }]
        )
    }
    const removeItem = ({ id }) => {
        setOpciones(opciones.filter(opcion => opcion.id !== id))
    }

    const updateOption = (id, data) => {
        setOpciones(prev => prev.map(opcion =>
            opcion.id === id ? {
                ...opcion,
                descripcion: data.descripcion ?? opcion.descripcion,
                precio: data.precio ?? opcion.precio
            } : opcion
        ));
    }

    const submit = () => {
        const objeto = {
            id: id,
            nombre: nombre,
            producto: undefined,
            options: []
        }
        opciones.forEach(element => {
            const opcion = {
                id: element.id,
                descripcion: element.descripcion,
                precio: element.precio,
            }
            objeto.options.push(opcion)
        });

        console.log(objeto)
    }

    useEffect(() => {
        if (initialData === null) return
        console.log(initialData)
        setId(initialData.id)
        setNombre(initialData.descripcion ?? 'default')
        setProductoId(initialData.producto)
        if (initialData.options) {
            setOpciones(initialData.options)
        }
    }, [initialData])

    useEffect(() => {
        console.log(opciones)
        if (opciones.length === 0 && onZeroItems) {
            onZeroItems()
        }
    }, [opciones])


    return (
        <div className='p-4 my-2'>
            <div className='d-flex justify-content-between mb-3'>
                <h5 className='text-secondary'>{nombre ? nombre : 'Grupo de opciones'}</h5>
                <button type='button' className='btn btn-lg btn-close' onClick={() => onZeroItems?.()} ></button>
            </div>
            <div className='d-flex flex-row mb-3 column-gap-4'>
                <Input
                    id='nombreGrupo'
                    placeholder='Nombre del grupo'
                    fullWidth
                    value={nombre}
                    onChange={({ target }) => setNombre(target.value)}
                    sx={{
                        flex: 3,
                    }}
                />

                <Button variant='standard'
                    startIcon={<PlusIcon />}
                    onClick={() => addItem()}
                    fullWidth
                    sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 12,
                        flex: 2,
                        '&:hover': {
                            backgroundColor: '#333'
                        }
                    }}
                >
                    Opción
                </Button>
            </div>
            <fieldset className='ps-5'>
                {opciones.length > 0 ? opciones.map((opcion, index) => {
                    return (
                        <div key={opcion.id} className='d-flex flex-row gap-2 mb-2' >

                            <TextField
                                placeholder={`Opción ${index + 1}`}
                                variant='standard'
                                hiddenLabel
                                fullWidth
                                value={opcion.descripcion}
                                onChange={({ target }) => updateOption(opcion.id, { descripcion: target.value })}
                                sx={{
                                    flex: 4,
                                }}
                            />
                            <TextField
                                placeholder={`00.00`}
                                variant='standard'
                                fullWidth
                                value={opcion.precio}
                                onChange={({ target }) => updateOption(opcion.id, { precio: target.value })}
                                slotProps={{
                                    input: {
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    },
                                }}
                                sx={{
                                    flex: 2,
                                }}
                            />

                            <button type='button' className='btn btn-close  mt-auto' onClick={() => removeItem(opcion)}></button>
                        </div>
                    );
                }) : null}
            </fieldset>
            <button type='button' className='btn btn-danger' onClick={submit}>Test submit</button>
        </div>
    )
}
