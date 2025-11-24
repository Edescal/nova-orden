import { ButtonBase, Card, CardActionArea, CardContent, CardMedia, Paper, useMediaQuery } from '@mui/material'
import noimgfound from '../../assets/noimgfound.jpg'
import { useNavigate } from 'react-router-dom'

export default function NegocioCard({ negocio = null }) {
    const navigate = useNavigate()
    const res = useMediaQuery('(min-width: 576px)')

    const handleClick = () => {
        console.log("Negocio clickeado:", negocio)
        if (navigate) {
            navigate(`/${negocio.slug}/menu`)
        }
    }

    return (
        <Paper elevation={3} sx={{ marginBottom: 2, borderRadius: 6 }} >
            <Card variant="outlined" elevation={5} onPointerUp={negocio ? handleClick : null} sx={{ borderRadius: 6 }}>
                <CardActionArea className='d-flex flex-column'>
                    <CardContent className='bg-white w-100 border-0  h-100 p-0'>
                        <div className=' d-flex align-items-center'>
                            <div className={`ratio  ratio-16x9`}>
                                <img
                                    src={negocio?.banner_img ? negocio.banner_img : noimgfound}
                                    alt="Preview del archivo"
                                    className="w-100 h-100 object-fit-cover"
                                />
                            </div>
                        </div>
                        <div className='col-8 col-sm-12 px-3 d-flex flex-column py-3 py-sm-3 text-start'>
                            <p className='fw-bolder mb-0'>{negocio ? negocio.nombre : 'Nombre del negocio '}</p>
                            <small className='text-muted'>{negocio ? negocio.direccion : 'Nombre del negocio '}</small>
                            <span className='mb-2'>{negocio ? negocio.descripcion : 'Nombre del negocio '}</span>
                            <p className='fw-semibold mt-auto mb-0'>
                                {
                                    negocio ? <>Teléfono <span className='fw-normal'>{negocio.telefono}</span></> : 'Teléfono '
                                }
                            </p>

                            {negocio ? null : <span className='text-center fw-bolder'>¡ANUNCIA TU RESTAURANTE!</span>}
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Paper>
    )
}
