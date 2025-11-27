import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grow, IconButton, Slide, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import Opciones from './Opciones'
import ButtonDark from './ButtonDark'
import { numberToMoney } from '../utils/numberToMoney'
import noimgfound from '../assets/noimgfound.jpg'
import ReturnIcon from '../assets/ReturnIcon'
import { isNumber } from '@mui/x-data-grid/internals'
import AxiosInstance from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { useCart } from '../context/CartContext'

const ANOTACION_MAX_LENGTH = 128

export default function SelectProducto({ producto = null, open = false, onClose = null }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const { addItem } = useCart()
    const { showSnack } = useNotification()
    const [cantidad, setCantidad] = useState(1)
    const [anotacion, setAnotacion] = useState('')
    const [grupos, setGrupos] = useState([])
    const [precioTotal, setPrecioTotal] = useState(0)

    // Al cargar el componente con un producto
    useEffect(() => {
        if (producto) {
            console.log(producto)
            const s = producto.option_groups.map(({ id, opciones }) => ({
                id,
                opciones: opciones.map(({ id, precio }) => ({ id, precio })),
                selected: opciones[0].id
            }))
            setGrupos(s)
        }
    }, [producto])

    // Resetea al cerrar
    useEffect(() => {
        if (!open) {
            setCantidad(1)
            setAnotacion('')
            setGrupos([])
            setPrecioTotal(0)
        }
    }, [open])

    // Recalcular precio total
    useEffect(() => {
        if (producto) {
            let precio = Number(producto.precio)
            for (const grupo of grupos) {
                for (const opcion of grupo.opciones) {
                    if (opcion.id === grupo.selected) {
                        precio += Number(opcion.precio)
                        break
                    }
                }
            }
            setPrecioTotal(precio * Number(cantidad))
        }
    }, [producto, cantidad, grupos])

    const changeCantidad = ({ target }) => {
        const value = Number(target.value)
        if (isNumber(value)) {
            setCantidad(value > 99 ? 99 : value < 1 ? 1 : value)
        }
    }

    const onInputAnotacion = useCallback(({ target }) => {
        if (target.value.length <= ANOTACION_MAX_LENGTH) {
            setAnotacion(target.value)
        }
    }, [])

    const onBlurAnotacion = useCallback(({ target }) => {
        setAnotacion(target.value.trim())
    }, [])

    const onChangeSelect = useCallback(({ }, value) => {
        for (const grupo of grupos) {
            let found = false
            for (const op of grupo.opciones) {
                if (op.id == value) {
                    found = true
                    break
                }
            }
            if (found) {
                setGrupos(grupos.map(g => {
                    if (g.id === grupo.id) {
                        return { ...g, selected: Number(value), }
                    }
                    return g
                }));
                break
            }
        }
    }, [grupos])

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        if (producto === null) {
            console.error('Se intentaron agregar 0 productos...')
            return
        }
        else if (cantidad <= 0) {
            console.error('Se intentaron agregar 0 productos...')
            return
        }
        const opciones = grupos.map(({ id, selected }) => ({
            id: selected,
            id_grupo: id,
        }))
        try {
            const response = await AxiosInstance.post('/api/wrappers/', {
                'producto': producto.id,
                'cantidad': cantidad,
                'options': opciones,
                'anotacion': anotacion
            })
            if (response) {
                console.info(response.data)
                addItem(response.data)
                showSnack('Se añadió un producto al carrito', 'success')
                onClose?.()
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Dialog
            open={open}
            fullScreen={isMobile}
            maxWidth={'sm'}
            fullWidth
            slots={{ transition: Slide }}
            transitionDuration={400}
        >
            <DialogTitle id="alert-dialog-title">
                <IconButton size='small' onClick={onClose}>
                    <ReturnIcon width='1.5em' height='1.5em' stroke='black' />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div className='d-flex justify-content-center mb-3'>
                    <div className='ratio ratio-1x1' style={{ width: producto?.option_groups?.length === 0 ? 300 : isMobile ? 100 : 200, }}  >
                        <img
                            src={producto && producto.imagen ? producto.imagen : noimgfound}
                            alt={producto ? `Imagen para ${producto.nombre}` : 'Imagen de producto'}
                            className='shadow img-fluid object-fit-cover'
                            loading='lazy'
                        />
                    </div>
                </div>

                <div className='container d-flex flex-column flex-nowrap flex-grow-1' >
                    <div className='d-flex justify-content-between'>
                        <h1 className='card-title mb-0'>{producto ? producto.nombre : ''}</h1>
                        <h1 className='card-title mb-0'>{producto ? numberToMoney(producto.precio) : ''}</h1>
                    </div>
                    <span className='text-secondary mb-2'>{producto ? producto.categoria.nombre : ''}</span>
                    <span className='text-muted lh-sm mb-3'>{producto ? producto.descripcion : ''}</span>
                </div>
                {producto?.option_groups?.length > 0 && <>
                    <hr />
                    {producto && producto?.option_groups?.map(group => (
                        <Opciones group={group} key={group.id} onChange={onChangeSelect} />
                    ))}
                </>
                }
            </DialogContent>
            <DialogActions className='d-flex flex-column'>
                {/* Anotacion */}
                <Box sx={{ position: 'relative', width: '100%', marginBottom: 1 }}>
                    <TextField
                        id="filled-multiline-static"
                        label="¿Quieres dejar alguna nota?"
                        multiline
                        fullWidth
                        maxRows={2}
                        variant="outlined"
                        value={anotacion}
                        onChange={onInputAnotacion}
                        onBlur={onBlurAnotacion}
                    />
                    <Typography
                        variant="subtitle2"
                        sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 12,
                            color: anotacion.length === ANOTACION_MAX_LENGTH ? 'error.main' :
                                anotacion.length >= Math.floor(ANOTACION_MAX_LENGTH * 0.75) ? '#ffb700ff' :
                                    'text.secondary'
                            ,
                        }}
                    >
                        {`${anotacion.length}/${ANOTACION_MAX_LENGTH}`}
                    </Typography>
                </Box>
                <div className='d-flex justify-content-between align-items-center w-100 mb-3 px-3'>
                    <p className='fw-bold fs-4'>Cantidad</p>
                    <Box
                        sx={{
                            borderRadius: 10,
                            backgroundColor: 'rgb(242 127 13 / 0.2)',
                        }}
                    >
                        <IconButton onClick={() => setCantidad(cantidad - 1 < 1 ? 1 : cantidad - 1)} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(242 127 13)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" />
                            </svg>
                        </IconButton>
                        <TextField
                            variant='standard'
                            size='small'
                            value={cantidad}
                            onChange={changeCantidad}
                            sx={{
                                paddingTop: 0.75,
                                width: 30,
                                "& input": {
                                    padding: 0,
                                    textAlign: "center",
                                    fontSize: 16,
                                },
                                '&>*::after': {
                                    borderColor: 'rgb(242 127 13)',
                                },
                                '&>*::before': {
                                    borderColor: 'rgb(242 127 13)',
                                }
                            }}
                            inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                            }}
                        >
                        </TextField>
                        <IconButton onClick={() => setCantidad(cantidad + 1 > 99 ? 99 : cantidad + 1)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(242 127 13)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                        </IconButton>
                    </Box>
                </div>
                <ButtonDark disabled={!open} onClick={e => handleSubmit(e)} text={`Añadir al carrito ${numberToMoney(precioTotal)}`} />
            </DialogActions>
        </Dialog >
    )
}