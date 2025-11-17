import React, { useEffect, useEffectEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext'

import { useNavigate } from 'react-router-dom'

export default function Login() {
    const auth = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = useEffectEvent(async (evt) => {
        evt.preventDefault()
        const response = await auth.login(username, password)
        console.log('Login:', { username, password });
    })

    useEffect(() => {
        if (auth.user) {
            navigate('/dashboard')
        }
    }, [auth.user])

    return (
        <>

            <style>{`
    .login-container {
        min-height: 100vh;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .login-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        max-width: 440px;
        width: 100%;
    }

    .login-header {
        background: linear-gradient(135deg, #4f4f6b 0%, #333333 100%); /* Cambiado a tonos oscuros */
        padding: 50px 40px;
        text-align: center;
        position: relative;
    }

    .login-header::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 40px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 24px 24px 0 0;
    }

    .avatar-circle {
        width: 100px;
        height: 100px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        position: relative;
        z-index: 2;
    }

    .login-title {
        color: white;
        font-size: 32px;
        font-weight: 700;
        margin: 0 0 8px;
        position: relative;
        z-index: 2;
    }

    .login-subtitle {
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
        margin: 0;
        position: relative;
        z-index: 2;
    }

    .login-body {
        padding: 50px 40px 40px;
    }

    .form-group {
        margin-bottom: 28px;
    }

    .form-label {
        display: block;
        margin-bottom: 10px;
        color: #333;
        font-weight: 600;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .input-wrapper {
        position: relative;
    }

    .input-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        stroke: #999;
        transition: all 0.3s ease;
        pointer-events: none;
    }

    .form-input {
        width: 100%;
        padding: 16px 16px 16px 48px;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        font-size: 16px;
        transition: all 0.3s ease;
        background: #fafafa;
    }

    .form-input:focus {
        outline: none;
        border-color: #667eea;
        background: white;
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .form-input:focus + .input-icon {
        stroke: #667eea;
    }

    .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 28px;
        font-size: 14px;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #666;
    }

    .checkbox-label input {
        margin-right: 8px;
        width: 18px;
        height: 18px;
        cursor: pointer;
    }

    .forgot-link {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .forgot-link:hover {
        color: #5a4d78; /* Morado oscuro */
    }

    .btn-login {
        width: 100%;
        padding: 18px;
        background: linear-gradient(135deg, #4f4f6b 0%, #5a4d78 100%); /* Mantener morado oscuro */
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .btn-login:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
    }

    .btn-login:active {
        transform: translateY(0);
    }

    .divider {
        display: flex;
        align-items: center;
        margin: 32px 0;
        color: #999;
        font-size: 14px;
    }

    .divider::before,
    .divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #e0e0e0;
    }

    .divider span {
        padding: 0 16px;
    }

    .social-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 32px;
    }

    .btn-social {
        padding: 12px;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-weight: 600;
        color: #333;
    }

    .btn-social:hover {
        border-color: #667eea;
        background: #f8f9ff;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .footer-text {
        text-align: center;
        color: #666;
        font-size: 15px;
    }

    .signup-link {
        color: #667eea;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .signup-link:hover {
        color: #5a4d78; /* Morado oscuro */
    }

    @media (max-width: 576px) {
        .login-body {
            padding: 40px 24px 24px;
        }

        .login-header {
            padding: 40px 24px;
        }
    }
`}</style>



            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="avatar-circle">
                            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 className="login-title">¡Bienvenido!</h1>
                        <p className="login-subtitle">Inicia sesión para continuar</p>
                    </div>

                    <form className="login-body">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <div className="input-wrapper">
                                <input
                                    id="email"
                                    type="email"
                                    className="form-input"
                                    placeholder="tu@email.com"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <svg className="input-icon" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <svg className="input-icon" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>

                        <button className="btn-login" type='submit' onClick={handleSubmit}>
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}