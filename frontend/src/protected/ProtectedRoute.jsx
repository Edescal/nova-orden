import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Route } from 'react-router-dom'

export default function ProtectedRoute({ children, permissions=[] }) {
    const auth = useAuth()

    useEffect(() => {   
        console.log(auth)
    }, [])


    return (<Route>
        {children}
    </Route>)
}
