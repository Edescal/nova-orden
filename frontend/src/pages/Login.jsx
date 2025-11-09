import React, { useEffect, useState } from 'react'
import { TextField, Button } from '@mui/material'
import { UserIcon } from '../assets/UserIcon'
import { get } from '../utils/apiUtils'

export default function Login() {
    useEffect(() => {
        (async ()=> {
            const res = await get('/api/negocios')
            if (res) {
                console.log(res)
            }
        })()
    }, [])


    return (
        <div className='card p-3 mt-5 mx-3'>
            <div className='d-flex justify-content-center my-3'>
                <span className='rounded-circle d-flex justify-content-center align-items-center border border-4 border-black' style={{width: "90px", height:"90px"}}>
                    
                <UserIcon width="4em" height="4em" className="mb-3" />
                </span>
            </div>
            <h2 className='text-center'>Inicia sesión</h2>
            <div className='py-3 px-4'>
                <label htmlFor="email" className='form-label'>Correo electrónico</label>
                <TextField id='email' name='email' placeholder='correo_electronico@email.com'
                    variant='standard'
                    fullWidth
                    hiddenLabel
                    size='small'
                    sx={{
                        '& .MuiInputBase-input': {
                            fontSize: '1.2rem',
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: '1.35rem',
                        },
                        '& .MuiInputBase-input::placeholder': {
                            fontSize: '1.2rem',
                            opacity: 0.5,
                        },
                    }}

                />
            </div>
            <div className='py-3 px-4'>
                <label htmlFor="password" className='form-label'>Contraseña</label>
                <TextField hiddenLabel id='password' name='password' placeholder='Escribe tu contraseña' type="password" autoComplete="current-password" size='small'
                    variant='standard'
                    fullWidth
                    sx={{
                        '& .MuiInputBase-input': {
                            fontSize: '1.2rem',
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: '1.35rem',
                        },
                        '& .MuiInputBase-input::placeholder': {
                            fontSize: '1.2rem',
                            opacity: 0.5,
                        },
                    }}
                />
            </div>
            <div className='py-3 px-4'>

                <Button variant='contained' className='fw-semibold fs-5' fullWidth>
                    Iniciar sesión
                </Button>
            </div>
        </div>
    )
}
