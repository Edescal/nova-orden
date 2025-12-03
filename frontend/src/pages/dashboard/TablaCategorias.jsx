import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import { useModal } from '../../context/ModalContext'

export default function TablaCategorias({ categorias = [], onEdit = null, onDelete = null }) {
    const modal = useModal()

    const handleEdit = (categoria) => {
        if (categoria) {
            console.log('Editando: ', categoria.nombre)
            onEdit?.(categoria)
        }
    }

    const handleDelete = (categoria) => {
        if (categoria) {
            modal.confirm(
                <div className="text-center">
                    <p className="mt-3 mb-1">¿Quieres eliminar la categoría <strong>{categoria.nombre}</strong>? Esta acción es irreversible.</p>
                </div>,
                () => {
                    console.log('Eliminando: ', categoria.nombre)
                    onDelete?.(categoria)
                }
            )
        }
    }

    return (
        <TableContainer component={Paper} elevation={2} style={{ overflowX: 'auto', overflowY: 'hidden' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categorias && categorias.map(categoria => (
                        <TableRow key={categoria.id}>
                            <TableCell>{categoria.id}</TableCell>
                            <TableCell>{categoria.nombre}</TableCell>
                            <TableCell>
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'centers'}
                                    columnGap={1}
                                >
                                    <IconButton
                                        onClick={handleEdit.bind(null, categoria)}
                                        color="primary"
                                        size='small'
                                        sx={{
                                            border: 2
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1m-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71m10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z" /></svg>
                                    </IconButton>
                                    <IconButton
                                        onClick={handleDelete.bind(null, categoria)}
                                        color="error"
                                        size='small'
                                        sx={{
                                            border: 2
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 26 26"><path fill="currentColor" d="M11.5-.031c-1.958 0-3.531 1.627-3.531 3.594V4H4c-.551 0-1 .449-1 1v1H2v2h2v15c0 1.645 1.355 3 3 3h12c1.645 0 3-1.355 3-3V8h2V6h-1V5c0-.551-.449-1-1-1h-3.969v-.438c0-1.966-1.573-3.593-3.531-3.593zm0 2.062h3c.804 0 1.469.656 1.469 1.531V4H10.03v-.438c0-.875.665-1.53 1.469-1.53zM6 8h5.125c.124.013.247.031.375.031h3c.128 0 .25-.018.375-.031H20v15c0 .563-.437 1-1 1H7c-.563 0-1-.437-1-1zm2 2v12h2V10zm4 0v12h2V10zm4 0v12h2V10z" /></svg>
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </TableContainer>
    )
}
