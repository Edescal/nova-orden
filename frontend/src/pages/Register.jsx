import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, IconButton, InputAdornment, Alert } from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import { Axios } from 'axios';
import AxiosInstance from '../context/AuthContext';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        nombre: '',
        apellidos: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'El correo es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El correo no es válido';
        }

        if (!formData.username) {
            newErrors.username = 'El nombre de usuario es requerido';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Debe tener al menos 3 caracteres';
        }

        if (!formData.nombre) {
            newErrors.nombre = 'El nombre es requerido';
        }
        if (!formData.apellidos) {
            newErrors.apellidos = 'Los apellidos son requeridos';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Debe tener al menos 6 caracteres';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar la contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const response = await AxiosInstance.post('/api/register/', formData).catch((error) => {
                setErrors({...errors, ...error.response.data.errors})
            });
            
            if (response?.status === 201) {
                console.log('Registro exitoso');
                setSubmitted(true);
                console.log(response.data);
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
            }}
            >
                <Paper elevation={4} sx={{
                    width: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                }}
                >
                    <Box sx={{
                        px: 4,
                        py: 4,
                        background: 'linear-gradient(135deg, #4f46e5 0%, #1e293b 100%)',
                        color: 'white',
                        textAlign: 'center',
                    }}
                    >
                        <Box sx={{
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
                            <PersonAdd sx={{ fontSize: 40 }} />
                        </Box>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                            Registro
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Crea tu cuenta para comenzar
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} sx={{ px: 4, py: 4 }}>
                        {submitted && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                ¡Registro exitoso! Bienvenido, {formData.nombre}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            label="Correo electrónico"
                            name="email"
                            type="email"
                            value={formData?.email}
                            onChange={handleChange}
                            error={!!errors?.email}
                            helperText={errors?.email}
                            margin="normal"
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            label="Nombre de usuario"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={!!errors.username}
                            helperText={errors.username}
                            margin="normal"
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            label="Nombre(s)"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            error={!!errors.nombre}
                            helperText={errors.nombre}
                            margin="normal"
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            label="Apellidos"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            error={!!errors.apellidos}
                            helperText={errors.apellidos}
                            margin="normal"
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            label="Contraseña"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Confirmar contraseña"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                fontWeight: 700,
                            }}
                        >
                            Registrarse
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
