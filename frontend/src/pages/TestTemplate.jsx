import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import { useCallback, useEffect, useState } from 'react';
import { createTheme, IconButton, Menu, MenuItem, Paper, ThemeProvider, useMediaQuery } from '@mui/material';
import AxiosInstance, { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function TestTemplate({ children = null }) {
    const isMobile = useMediaQuery("(max-width:600px)");
    const [open, setOpen] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null)
    const navigate = useNavigate()
    const auth = useAuth()

    const handleNavigation = (route, evt) => {
        navigate(route)
    }

    const handleLogout = useCallback(async () => {
        const response = await auth.logout()
        if (response) {
            navigate('/login')
        } else {
            navigate('/login')
        }
    }, [])

    const theme = createTheme({
        palette: {
            mode: "dark"   // Cambiar entre modo oscuro y claro
        },
    });

    const lightTheme = createTheme({
        palette: {
            mode: 'light',
        },
    });
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" className='bg-dark' variant='elevation'>
                    <Toolbar
                        sx={{
                            justifyContent: 'left',
                            gap: 2,
                            marginLeft: (open && !isMobile) ? `${drawerWidth}px` : 0,
                            transition: '0.3s',
                        }}>
                        {!isMobile && (
                            <IconButton onClick={() => setOpen(!open)}
                                size="large"
                                sx={{
                                    color: 'white'
                                }}>
                                <MenuIcon></MenuIcon>
                            </IconButton>
                        )}
                        <Typography variant="h4" noWrap component="div">
                            Panel de administración
                        </Typography>
                        {isMobile && (
                            <IconButton
                                size="large"
                                aria-label="display more actions"
                                edge="end"
                                color="inherit"
                                onClick={(evt) => setAnchorEl(evt.currentTarget)}
                                sx={{
                                    alignSelf: 'flex-left'
                                }}
                            >
                                <MoreIcon />
                            </IconButton>
                        )}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem onClick={handleNavigation.bind(null, '/dashboard')}>
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Tablero
                                </ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleNavigation.bind(null, '/ordenes-entregadas')}>
                                <ListItemIcon>
                                    <AssignmentTurnedInIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Órdenes entregadas
                                </ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleNavigation.bind(null, '/papelera')}>
                                <ListItemIcon>
                                    <DeleteSweepIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Papelera
                                </ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleNavigation.bind(null, '/productos')}>
                                <ListItemIcon>
                                    <BackupTableIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Ver productos
                                </ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon></LogoutIcon>
                                </ListItemIcon>
                                <ListItemText>
                                    Cerrar sesión
                                </ListItemText>
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Drawer
                    elevation={5}
                    variant="persistent"
                    open={open && !isMobile}
                    sx={{
                        width: isMobile ? 0 : open ? drawerWidth : 0,
                        flexShrink: 0,
                        transition: '0.3s',
                        [`& .MuiDrawer-paper`]: { width: isMobile ? 0 : drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar />
                    <Paper elevation={2} >
                        <Box textAlign='center' sx={{
                            p: 2,
                        }} >

                            <h4>¡Bienvenido!</h4>
                            <svg xmlns="http://www.w3.org/2000/svg" width="7em" height="7em" viewBox="0 0 50 50"><path fill="currentColor" d="M25.1 42c-9.4 0-17-7.6-17-17s7.6-17 17-17s17 7.6 17 17s-7.7 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.8-15-15-15" /><path fill="currentColor" d="m15.3 37.3l-1.8-.8c.5-1.2 2.1-1.9 3.8-2.7s3.8-1.7 3.8-2.8v-1.5c-.6-.5-1.6-1.6-1.8-3.2c-.5-.5-1.3-1.4-1.3-2.6c0-.7.3-1.3.5-1.7c-.2-.8-.4-2.3-.4-3.5c0-3.9 2.7-6.5 7-6.5c1.2 0 2.7.3 3.5 1.2c1.9.4 3.5 2.6 3.5 5.3c0 1.7-.3 3.1-.5 3.8c.2.3.4.8.4 1.4c0 1.3-.7 2.2-1.3 2.6c-.2 1.6-1.1 2.6-1.7 3.1V31c0 .9 1.8 1.6 3.4 2.2c1.9.7 3.9 1.5 4.6 3.1l-1.9.7c-.3-.8-1.9-1.4-3.4-1.9c-2.2-.8-4.7-1.7-4.7-4v-2.6l.5-.3s1.2-.8 1.2-2.4v-.7l.6-.3c.1 0 .6-.3.6-1.1c0-.2-.2-.5-.3-.6l-.4-.4l.2-.5s.5-1.6.5-3.6c0-1.9-1.1-3.3-2-3.3h-.6l-.3-.5c0-.4-.7-.8-1.9-.8c-3.1 0-5 1.7-5 4.5c0 1.3.5 3.5.5 3.5l.1.5l-.4.5c-.1 0-.3.3-.3.7c0 .5.6 1.1.9 1.3l.4.3v.5c0 1.5 1.3 2.3 1.3 2.4l.5.3v2.6c0 2.4-2.6 3.6-5 4.6c-1.1.4-2.6 1.1-2.8 1.6" /></svg>
                            <p className='text-start'>Bienvenido de nuevo al panel de administración de tu negocio
                            </p>
                        </Box>

                    </Paper>
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleNavigation.bind(null, '/dashboard')}>
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Tablero
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleNavigation.bind(null, '/ordenes-entregadas')}>
                                    <ListItemIcon>
                                        <AssignmentTurnedInIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Órdenes entregadas
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleNavigation.bind(null, '/papelera')}>
                                    <ListItemIcon>
                                        <DeleteSweepIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Papelera
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleNavigation.bind(null, '/productos')}>
                                    <ListItemIcon>
                                        <BackupTableIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Ver productos
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleLogout}>
                                    <ListItemIcon>
                                        <LogoutIcon></LogoutIcon>
                                    </ListItemIcon>
                                    <ListItemText>
                                        Cerrar sesión
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
                <Box component="main" className='bg-secondary-subtle text-black' sx={{ flexGrow: 1, p: 3, height: '100vh', maxHeight: '100%', overflow: 'scroll' }}>
                    <Toolbar />
                    <ThemeProvider theme={lightTheme}>
                        {children}
                    </ThemeProvider>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
