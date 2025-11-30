import { useEffect, useRef, useState } from 'react'
import AxiosInstance, { useAuth } from '../context/AuthContext'
import SelectProducto from '../components/SelectProducto'
import FormCategorias from '../components/formularios/FormCategorias'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

export default function Test() {
    const [negocio, setNegocio] = useState(null)
    const [openCategoria, setOpenCategoria] = useState(false)
    const [editCategoria, setEditCategoria] = useState(null)
    const auth = useAuth()
    const form = useRef()

    useEffect(() => {
        (async () => {
            const res = await auth.whoami()
            if (res) {
                console.log(res.data.user.negocios[0].uuid)
                setNegocio(res.data.user.negocios[0].uuid || null)
            }
            const respo = await AxiosInstance.get('/api/categorias/1')
            if (respo) {
                setEditCategoria(respo.data)
            }
        })()
    }, [])


    const btnResetForm = (evt) => {
        evt.preventDefault()
        form.current?.reset()
        setOpenCategoria(false)
    }

    const btnSubmitForm = (evt) => {
        evt.preventDefault()
        form.current?.submit()
    }

    const handleSubmitCategoria = async (data) => {
        data = {
            ...data,
            negocio,
        }
        console.log(data)
        if (data.pk) {
            console.log('Actualizar categoría');            
            const response = await AxiosInstance.patch(`/api/categorias/${data.pk}/`, data)
            if (response) {
                console.log(response)
                setOpenCategoria(false);
            }
        } else {
            console.log('Crear categoría');
            const response = await AxiosInstance.post('/api/categorias/', data)
            if (response) {
                console.log(response)
                setOpenCategoria(false);
            }
        }
    }

    return (
        <div>
            <button onClick={() => { setOpenCategoria(true) }}>PUTAAA</button>
            <button onClick={() => { setOpenCategoria(true) }}>PUTAAA</button>

            <Dialog open={openCategoria} onClose={() => setOpenCategoria(false)} maxWidth="sm" >
                <DialogTitle sx={{
                    fontSize: '1.7rem',
                    borderBottom: '1px solid #e0e0e0',
                }}>
                    {editCategoria ? 'Editar categoría' : 'Crear categoría'}
                </DialogTitle>
                <DialogContent>
                    <FormCategorias ref={form} categoria={editCategoria} onSubmit={handleSubmitCategoria} />
                </DialogContent>
                <DialogActions sx={{
                    p: 2.5,
                    bgcolor: '#fafafa',
                    borderTop: '1px solid #e0e0e0',
                }}>
                    <Button onClick={btnResetForm} type="submit" variant="contained" color='primary' className='fw-semibold'>
                        Cerrar
                    </Button>
                    <Button onClick={btnSubmitForm} variant="contained" color='secondary' className='fw-semibold'>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
