import { useEffect, useState } from 'react'
import { TextField, Button, Select, MenuItem, InputLabel, InputAdornment, Input, IconButton } from '@mui/material'
import { PlusIcon } from '../../assets/PlusIcon'

//onZeroItems lo elimina en el padre 
export default function CrearOpciones({ initialData = null, onZeroItems = null, onChangeData = null }) {
    const [nombre, setNombre] = useState('Nombre del grupo')

    const [id, setId] = useState(-1)
    const [productoId, setProductoId] = useState(-1)
    const [opciones, setOpciones] = useState([{
        id: "campo_1",
        descripcion: "Opción extra 1",
        precio: 0,
    }])

    useEffect(() => {
        onChangeData?.(generarDatos())
    }, [nombre, id, productoId, opciones])

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

    const generarDatos = () => {
        const objeto = {
            id: id,
            nombre: nombre,
            producto: productoId,
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
        return objeto
    }

    useEffect(() => {
        if (initialData === null) return
        setId(initialData.id)
        setNombre(initialData.descripcion ?? 'default')
        setProductoId(initialData.producto)
        if (initialData.options) {
            setOpciones(initialData.options)
        }
    }, [initialData])

    useEffect(() => {
        if (opciones.length === 0 && onZeroItems) {
            onZeroItems()
        }
    }, [opciones])


    return (
        <div className='card p-3 my-2'>
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
                                type='number'
                                value={opcion.precio}
                                onChange={({ target }) => {
                                    if (!isNaN(target.value)) {
                                        updateOption(opcion.id, { precio: target.value })
                                    }
                                }}
                                onBlur={({ target }) => {
                                    let value = target.value;
                                    if (isNaN(value)) value = "";
                                    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                                        updateOption(opcion.id, { precio: Number(value < 0 ? 0 : value > 100 ? 100 : value).toFixed(2) })
                                    }
                                    else {
                                        updateOption(opcion.id, { precio: Number(0).toFixed(2) })
                                    }
                                }}
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
            {/* <button type='button' className='btn btn-danger' onClick={submit}>Test submit</button> */}
        </div>
    )
}
