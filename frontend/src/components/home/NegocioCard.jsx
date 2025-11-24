import { ButtonBase, Card, CardActionArea, CardContent, CardMedia, useMediaQuery } from '@mui/material'
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
        <Card variant="outlined" sx={{ display: 'flex' }} onPointerUp={negocio ? handleClick : null}>
            <CardActionArea>
                <CardContent className='bg-white w-100 border-0 d-flex flex-row flex-sm-column h-100 p-0'>
                    <div className='col-4 col-sm-12 d-flex align-items-center'>
                    <div className={`ratio ${res ? 'ratio-4x3' : 'ratio-1x1'}`}>
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
                    <span className='mb-3'>{negocio ? negocio.descripcion : 'Nombre del negocio '}</span>
                    <p className='text-end fw-semibold mt-auto mb-0'>{negocio ? <>
                        Teléfono <span className='fw-normal'>{negocio.telefono}</span>
                    </> : 'Teléfono '}
                    </p>
                    {negocio ? null : <span className='text-center fw-bolder'>¡ANUNCIA TU RESTAURANTE!</span>}
                </div>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
