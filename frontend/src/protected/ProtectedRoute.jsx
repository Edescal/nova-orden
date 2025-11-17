import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Route, Outlet, Navigate } from 'react-router-dom'

export default function ProtectedRoute({ permissions = [], redirectTo = 'login' }) {
    const auth = useAuth()
    return auth.user ? <Outlet /> : <Navigate to={redirectTo} replace />
}
