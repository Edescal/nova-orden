import { useEffect, useRef, useState } from 'react'
import AxiosInstance, { useAuth } from '../context/AuthContext'
import SelectProducto from '../components/SelectProducto'
import FormCategorias from '../components/formularios/FormCategorias'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import FormNegocio from '../components/formularios/FormNegocio'

import io from 'socket.io-client';


export default function Test() {
    const [negocio, setNegocio] = useState(null)
    const [openNegocio, setOpenNegocio] = useState(false)
    const formNegocio = useRef()
    const auth = useAuth()

    useEffect(() => {
        // Conectarse al servidor WebSocket de Django
        const socket = io("http://localhost:8000", {
            transports: ["websocket"],  // Usar WebSocket
            cors: {
                origin: "http://localhost:5173",  // Asegúrate de que coincida con la URL de tu frontend
                methods: ["GET", "POST"],
                allowedHeaders: ["content-type"],
                credentials: true,
            },
        });

        // Conectarse cuando el WebSocket se establece
        socket.on('connect', () => {
            console.log('Conectado al servidor de WebSocket');
        });

        // Escuchar el mensaje recibido del servidor
        socket.on('message', (data) => {
            setMessage(data);
        });

        // Limpiar la conexión cuando el componente se desmonte
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        (async () => {
            const res = await auth.whoami()
            if (res) {
                console.log(res.data.user.negocios[0])
                setNegocio(res.data.user.negocios[0])
            } else {
                console.log('Redirigir al login')
            }
        })()
    }, [])

    const btnResetNegocioForm = (evt) => {
        evt.preventDefault()
        formNegocio.current?.reset()
        setOpenNegocio(false)
    }

    const btnSubmitNegocioForm = (evt) => {
        evt.preventDefault()
        formNegocio.current?.submit()
    }

    const handleSubmitNegocio = async (data) => {
        if (!negocio) return

        const formData = new FormData()

        formData.append('nombre', data.nombre);
        formData.append('descripcion', data.descripcion);
        formData.append('direccion', data.direccion);
        formData.append('telefono', data.telefono);
        if (data.banner_img && data.banner_img[0]) {
            formData.append('banner_img', data.banner_img);
        }

        const response = await AxiosInstance.patch(`/api/negocios/${negocio.uuid}/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if (response) {
            console.log(response)
        } else {
            console.log('Error al actualizar el negocio')
        }
    }

    return (
        <div>
            <button onClick={() => { setOpenNegocio(true) }}>PUTAAA</button>

            <Dialog open={openNegocio} onClose={() => setOpenNegocio(false)} maxWidth="sm" fullScreen >
                <DialogTitle sx={{
                    fontSize: '1.7rem',
                    borderBottom: '1px solid #e0e0e0',
                }}>
                    {negocio ? 'Editar negocio' : 'Crear negocio'}
                </DialogTitle>
                <DialogContent>
                    <FormNegocio ref={formNegocio} negocio={negocio} onSubmit={handleSubmitNegocio} />
                </DialogContent>
                <DialogActions sx={{
                    p: 2.5,
                    bgcolor: '#fafafa',
                    borderTop: '1px solid #e0e0e0',
                }}>
                    <Button onClick={btnResetNegocioForm} type="submit" variant="contained" color='primary' className='fw-semibold'>
                        Cerrar
                    </Button>
                    <Button onClick={btnSubmitNegocioForm} variant="contained" color='secondary' className='fw-semibold'>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
