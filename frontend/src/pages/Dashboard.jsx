import { useEffect, useState } from "react";
import { get } from "../utils/apiUtils";
import OrdenCard from "./dashboard/OrdenCard";
import { Box, Button, ButtonBase, Table } from '@mui/material'
import { getCSRFToken, getSession, getWhoami, logout } from "../utils/loginUtils";
import { useNavigate } from "react-router-dom";
import TableroOrdenes from "./dashboard/TableroOrdenes";
import Template from "./dashboard/Template";

export default function Dashboard({ children }) {
    const [csrf, setCSRF] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            const session = await getSession()
            console.log(session)
            if (session.ok) {
                const json = await session.json()
                if (json) {
                    if (!json.isAuthenticated) {
                        // navigate('/dashboard')
                    }
                }
            }
        })()

    }, [])

    const handleLogout = async () => {
        const response = await logout(csrf)
        if (response) {
            navigate('/login')
        }
    }

    return (
        <>
            <Template>
                <TableroOrdenes></TableroOrdenes>
            </Template>
        </>
    );
}