import { BottomNavigation, BottomNavigationAction, IconButton, Paper, styled } from "@mui/material";
import { useCart } from "../context/CartContext"
import ReturnIcon from "../assets/ReturnIcon";
import Badge, { badgeClasses } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useState } from "react";

export default function Footer({ onCartClick = null }) {
    const { cart } = useCart()
    const [value, setValue] = useState(0);
    const CartBadge = styled(Badge)`
    & .${badgeClasses.badge} {
        top: -26px;
        right: -16px;
    }`

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={10}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={({ }, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction label="Mi carrito" icon={
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path d="M17 17h-11v-14h-2" />
                            <path d="M6 5l14 1l-1 7h-13" />
                        </svg>
                        <CartBadge badgeContent={`${cart.length}`} color="error" overlap="circular" />
                    </>
                    // <IconButton disableTouchRipple >
                    // </IconButton>
                } onClick={evt => onCartClick(evt)} />
            </BottomNavigation>
        </Paper>
    )
}
