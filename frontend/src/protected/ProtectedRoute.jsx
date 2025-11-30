import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Route, Outlet, Navigate, useNavigate } from 'react-router-dom'

export default function ProtectedRoute({ permissions = [], redirectTo = 'login' }) {
    const { whoami, user } = useAuth()
    return user === null ? < Navigate to={redirectTo} replace /> : <Outlet />
}
