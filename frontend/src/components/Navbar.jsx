import { MenuItem, IconButton, Menu } from '@mui/material'
import ReturnIcon from '../assets/ReturnIcon'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ title = 'Navbar', negocio = null, onLeftButtonClick = null, hideMenuButton = false, hideNaviButton = false }) {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleMenuButton = (evt) => {
        setAnchorEl(evt.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const navigateToLogin = () => {
        setAnchorEl(null)
        navigate('/login')
    }

    return (
        <header className="nav navbar sticky-top d-flex justify-content-between px-2 bg-white  border-bottom" style={{ height: 80 }}>
            <div className='col-2 d-flex justify-content-start'>
                <IconButton size='medium' onClick={onLeftButtonClick}>
                    {!hideNaviButton && <>
                        <ReturnIcon width='1.5em' height='1.5em' stroke='black' />
                    </>}
                </IconButton>
            </div>
            <div className='col-8 d-flex justify-content-center'>
                {negocio ? <>
                    <div className='d-flex flex-column row-gap-0 fw-bold justify-content-start'>
                        <div className='d-flex gap-2 align-items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512"><path fill="currentColor" d="M342.7 223.94h14.87a79.48 79.48 0 0 0 56.58-23.44L496 118l-22.22-22.4l-83.58 83.58l-17.37-17.37l83.58-83.59l-23-22.31l-83.27 83.26l-17.32-17.37l83.58-83.59L394 16l-82.5 81.85a79.5 79.5 0 0 0-23.44 56.59v14.86l-43.13 43.13L48 16C3.72 70.87 29.87 171.71 79.72 221.57l85.5 85.5c26.55 26.55 31.82 28.92 61.94 16.8c6.49-2.61 8.85-2.32 14.9 3.72l13 12.13c2.93 3 3 3.88 3 9.62v5.54c0 21.08 13.48 33.2 22.36 42.24L384 496l72-72l-156.43-156.93Z" /><path fill="currentColor" d="M227.37 354.59c-29.82 6.11-48.11 11.74-83.08-23.23c-.56-.56-1.14-1.1-1.7-1.66l-19.5-19.5L16 416l80 80l144-144Z" /></svg>
                            <h6 className='m-0'>{negocio.nombre}</h6>
                        </div>
                    </div>

                </> :
                    <h3 className="text-center fw-semibold my-3">{title}</h3>
                }
            </div>
            <div className='col-2 d-flex justify-content-end'>
                {!hideMenuButton && <>
                    <IconButton size='medium' onClick={handleMenuButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 6l16 0" />
                            <path d="M4 12l16 0" />
                            <path d="M4 18l16 0" />
                        </svg>
                    </IconButton>
                </>}
                <Menu
                    onClose={handleMenuClose}
                    anchorEl={anchorEl}
                    open={open}
                    slotProps={{
                        list: {
                            'aria-labelledby': 'basic-button',
                        },
                    }}
                >
                    <MenuItem onClick={navigateToLogin}>Iniciar sesión</MenuItem>
                </Menu>
            </div>
        </header>
    )
}
