import Cookie from 'universal-cookie'
import Cookies from 'js-cookie';

import React, { useCallback, useEffect, useState } from 'react'
import { TextField, Button, useEventCallback } from '@mui/material'
import { UserIcon } from '../assets/UserIcon'
import { get } from '../utils/apiUtils'
import { useNavigate } from 'react-router-dom'
import { getCSRFToken, getSession, login, logout } from '../utils/loginUtils'


export default function Login() {
    const [csrf_token, setCSRF] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            // const session = await getSession()
            // console.log(session)
            // if (session && session.isAuthenticated) {
            //     console.log('Redirigir al dashboard')
            // }
        }
        )()
    }, [])

    const handleSubmit = useEventCallback(async () => {
        const token = await getCSRFToken()
        if (token){
            console.log(token)
        }
        const response = await login(username, password)

        if (response) {
            console.log(response)
            console.log(response.headers)
            const json = await response.json()
            console.log(json)
            // navigate('/dashboard')

        }
    })

    const handleSession = async () => {
        const response = await getSession()
        if (response) {
            console.log(response)
        }
    }


    const handleLogout = async () => {
        const response = await logout()
        if (response) {
            console.log(response)
            const json = await response.json()
            console.log(json)
        }
    }

    return (
        <main className='container-fluid'>
            <div className="row d-flex justify-content-center">
                <div className="col-10 col-sm-6">
                    <div className='card p-3 mt-5 mx-3'>
                        <div className='d-flex justify-content-center my-3'>
                            <span className='rounded-circle d-flex justify-content-center align-items-center border border-4 border-black' style={{ width: "90px", height: "90px" }}>
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
                                value={username}
                                onChange={({ target }) => setUsername(target.value.trim())}
                            />
                        </div>
                        <div className='py-3 px-4'>
                            <label htmlFor="password" className='form-label'>Contraseña</label>
                            <TextField hiddenLabel id='password' name='password' placeholder='Escribe tu contraseña' type="password" autoComplete="current-password" size='small'
                                variant='standard'
                                fullWidth
                                value={password}
                                onChange={({ target }) => setPassword(target.value.trim())}
                            />
                        </div>
                        <div className='py-3 px-4'>
                            <Button variant='contained' className='fw-semibold fs-5' onClick={handleSubmit} fullWidth>
                                Iniciar sesión
                            </Button>
                        </div>
                        <div className='py-3 px-4'>
                            <Button variant='contained' className='fw-semibold fs-5' onClick={handleSession} fullWidth>
                                Get session
                            </Button>
                        </div>
                        <div className='py-3 px-4'>
                            <Button variant='contained' className='fw-semibold fs-5' onClick={handleLogout} fullWidth>
                                Cerrar sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
