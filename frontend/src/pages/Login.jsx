import React, { useEffect, useEffectEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function Login() {
    const auth = useAuth();
    const [disableSubmit, setDisableSubmit] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        username: '',
        password: '',
    })
    const navigate = useNavigate();

    const handleSubmit = useEffectEvent(async (evt) => {
        evt.preventDefault();
        let handleErrors = {
            username: '',
            password: '',
        }
        if (username === '') {
            handleErrors = ({
                ...handleErrors,
                username: 'El usuario está vacío.'
            })
        }
        if (password === '') {
            handleErrors = ({
                ...handleErrors,
                password: 'La contraseña está vacía.'
            })
        }

        setErrors(handleErrors)
        if (Boolean(handleErrors.username) || Boolean(handleErrors.password)) {
            console.error('Hay errores en el formulario')
            return
        }

        setDisableSubmit(true)
        const response = await auth.login(username, password);
        if (response) {
            console.log('Login:', { username, password });
        }
        setDisableSubmit(false)
    });

    useEffect(() => {
        (async () => {
            const session = await auth.whoami()
            if (session) {
                navigate('/dashboard')
            } else {
                console.log(session)
            }
        })()
    }, [auth.user]);

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        width: '100%',
                        borderRadius: 4,
                        overflow: 'hidden',
                    }}
                >
                    {/* Header similar al de Register */}
                    <Box
                        sx={{
                            px: 4,
                            py: 4,
                            background: 'linear-gradient(135deg, #4f46e5 0%, #1e293b 100%)',
                            color: 'white',
                            textAlign: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255,255,255,0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2,
                            }}
                        >
                            <LoginIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                            Iniciar sesión
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Accede a tu cuenta para continuar
                        </Typography>
                    </Box>

                    {/* Cuerpo del formulario */}
                    <Box
                        component='form'
                        onSubmit={handleSubmit}
                        sx={{ px: 4, py: 4 }}
                    >
                        <TextField
                            disabled={disableSubmit}
                            fullWidth
                            label="Nombre de usuario"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                            variant="outlined"
                            error={Boolean(errors.username)}
                            helperText={errors.username}
                        />

                        <TextField
                            disabled={disableSubmit}
                            fullWidth
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            variant="outlined"
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                        />

                        <Button
                            disabled={disableSubmit}
                            className="btn-login"
                            variant="contained"
                            fullWidth
                            type="submit"
                            sx={{
                                mt: 3,
                                mb: 1,
                                py: 1.5,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                fontWeight: 700,
                            }}
                        >
                            Iniciar Sesión
                        </Button>
                    </Box>

                    <div className='text-center mb-5'>
                        <Link to={'/#'}> Regresar al inicio</Link>
                    </div>
                </Paper>
            </Box>
        </Container>
    );
}
