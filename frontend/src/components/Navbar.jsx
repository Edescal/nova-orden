import { TextField, Button, Select, MenuItem, InputLabel, InputAdornment, Typography, Box, IconButton, Icon } from '@mui/material'
import ReturnIcon from '../assets/ReturnIcon'

export default function Navbar({ title = 'Navbar', onLeftButtonClick = null, onRightButtonClick = null}) {
    return (
        <header className="nav navbar sticky-top d-flex justify-content-between px-2 bg-white  border-bottom">
            <IconButton size='medium' onClick={() => onLeftButtonClick?.()}>
                <ReturnIcon width='1.5em' height='1.5em' stroke='black' />
            </IconButton>

            <h4 className="text-center fw-semibold my-3">{title}</h4>

            <IconButton size='medium' onClick={() => onRightButtonClick?.()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 6l16 0" />
                    <path d="M4 12l16 0" />
                    <path d="M4 18l16 0" />
                </svg>
            </IconButton>
        </header>
    )
}
