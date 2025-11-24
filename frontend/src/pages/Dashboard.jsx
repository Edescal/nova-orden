import { useEffect, useEffectEvent, useState } from "react";
import { get } from "../utils/apiUtils";
import OrdenCard from "./dashboard/OrdenCard";
import { Box, Button, ButtonBase, Table } from '@mui/material'
import { getCSRFToken, getSession, logout } from "../utils/loginUtils";
import { useNavigate } from "react-router-dom";
import TableroOrdenes from "./dashboard/TableroOrdenes";
import Template from "./dashboard/Template";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    return (
        <>
            <Template activeBtns={['tablero']}>
                <TableroOrdenes></TableroOrdenes>
            </Template>
        </>
    );
}