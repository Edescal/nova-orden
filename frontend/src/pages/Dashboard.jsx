import { useEffect, useEffectEvent, useState } from "react";
import { get } from "../utils/apiUtils";
import OrdenCard from "./dashboard/OrdenCard";
import { Box, Button, ButtonBase, Table } from '@mui/material'
import { getCSRFToken, getSession, logout } from "../utils/loginUtils";
import { useNavigate } from "react-router-dom";
import TableroOrdenes from "./dashboard/TableroOrdenes";
import Template from "./dashboard/Template";
import { useAuth } from "../context/AuthContext";

export default function Dashboard({ children }) {
    const auth = useAuth()

    const [csrf, setCSRF] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate()


    const handleSubmit = useEffectEvent(async () => {
        const response = await auth.login(username, password)
    })

    const handleWhoAmI = useEffectEvent(async () => {
        const response = await auth.whoami()
        console.log(response)
    })

    const handleLogout = useEffectEvent(async () => {
        const response = await auth.logout()
        if (!auth.user) {
            navigate('/login')
        }
    })

    return (
        <>
            <Template activeBtns={['tablero']}>
                <TableroOrdenes></TableroOrdenes>
            </Template>
        </>
    );
}