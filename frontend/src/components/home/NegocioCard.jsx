import { ButtonBase, Card, CardActionArea, CardContent, CardMedia, Paper, Skeleton, Stack, useMediaQuery } from '@mui/material'
import noimgfound from '../../assets/noimgfound.jpg'
import { useNavigate } from 'react-router-dom'

export default function NegocioCard({ negocio = null }) {
    const navigate = useNavigate()

    const handleClick = () => {
        console.log("Negocio clickeado:", negocio)
        if (navigate) {
            navigate(`/${negocio.slug}/menu`)
        }
    }

    return (
        <Paper elevation={3} sx={{ margin: 2, marginTop: 1, borderRadius: 6 }} >
            <Card variant="outlined" elevation={5} onPointerUp={negocio ? handleClick : null} sx={{ borderRadius: 6 }}>
                <CardActionArea className='d-flex flex-column'>
                    {negocio ?
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
                            <div className='px-3 d-flex flex-column py-3 py-sm-3 text-start'>
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
                        :
                        <Stack spacing={1} className='w-100 p-4'>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="circular" width={60} height={60} />
                            <Skeleton variant="text" animation='wave'  height={60} />
                            <Skeleton variant="rounded" animation='wave' height={60} />
                        </Stack>
                    }
                </CardActionArea>
            </Card>
        </Paper>
    )
}
