import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grow, IconButton, TextField } from '@mui/material'
import { forwardRef, useState } from 'react'
import Opciones from './Opciones'
import ButtonDark from './ButtonDark'
import { numberToMoney } from '../utils/numberToMoney'
import noimgfound from '../assets/noimgfound.jpg'
import ReturnIcon from '../assets/ReturnIcon'
import { isNumber } from '@mui/x-data-grid/internals'


export default function SelectProducto({ producto = null }) {
    const [open, setOpen] = useState(true)
    const [cantidad, setCantidad] = useState(1)

    const handleClose = () => {
        setOpen(false)
    }

    const changeCantidad = ({ target }) => {
        const value = Number(target.value)
        if (isNumber(value)) {
            setCantidad(value > 99 ? 99 : value < 1 ? 1 : value)
        }
    }

    const handleSubmit = (e) => {

    }

    return (
        <Dialog
            open={open}
            fullScreen
            slots={{ transition: Grow }}
            transitionDuration={800}   
            onClose={() => setOpen(false)}
        >
            <DialogTitle id="alert-dialog-title">
                <IconButton size='small' onClick={() => onLeftButtonClick?.()}>
                    <ReturnIcon width='1.5em' height='1.5em' stroke='black' />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div className='d-flex justify-content-center mb-3'>
                    <div className='ratio ratio-1x1' style={{ width: 150, }}  >
                        <img
                            src={producto && producto.imagen ? producto.imagen : noimgfound}
                            alt={producto ? `Imagen para ${producto.nombre}` : 'Imagen de producto'}
                            className='shadow img-fluid object-fit-cover'
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

                <hr />

                {producto && producto?.option_groups?.map(group => (
                    <Opciones group={group} key={group.id} />
                ))}
            </DialogContent>
            <DialogActions className='d-flex flex-column'>
                <div className="input-group w-100  p-3">
                    <TextField
                        id="filled-multiline-static"
                        label="¿Quieres dejar alguna nota?"
                        multiline
                        fullWidth
                        rows={1}
                        maxRows={2}
                        variant="outlined"
                    />
                </div>
                <div className='d-flex justify-content-between align-items-center w-100 mb-3 px-3'>
                    <p className='fw-bold fs-4'>Cantidad</p>
                    <Box
                        sx={{
                            borderRadius: 10,
                            backgroundColor: 'rgb(242 127 13 / 0.2)',
                        }}
                    >
                        <IconButton onClick={() => setCantidad(cantidad - 1 < 1 ? 1 : cantidad - 1)} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(242 127 13)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" />
                            </svg>
                        </IconButton>
                        <TextField
                            variant='standard'
                            size='small'
                            value={cantidad}
                            onChange={changeCantidad}
                            sx={{
                                paddingTop: 1,
                                width: 35,
                                "& input": {
                                    padding: 0,
                                    textAlign: "center",
                                    fontSize: 18,
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(242 127 13)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                        </IconButton>
                    </Box>
                </div>
                <ButtonDark onClick={e => handleSubmit(e)} text={`Añadir al carrito ${numberToMoney(producto?.precio)}`} />
                <Button onClick={handleClose} autoFocus>Agree</Button>
            </DialogActions>
        </Dialog >
    )
}
