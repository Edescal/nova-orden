import React, { useEffect } from 'react'
import AxiosInstance from '../../context/AuthContext';
import { numberToMoney } from '../../utils/numberToMoney';

export default function UltimasOrdenes() {
    const [ordenes, setOrdenes] = React.useState([]);
    useEffect(() => {
        (async () => {
            const response = await AxiosInstance.get('/api/utils/last-ordenes/');
            if (response) {
                setOrdenes(response.data.map(({ nombre_cliente, total, fecha }) => ({
                    nombre_cliente,
                    total,
                    'fecha': new Date(fecha)
                })));
            }
        })()
    }, [])
    return (
        <>
            {ordenes.map(({ nombre_cliente, total, fecha }, index) => (
                <div key={index} className="card mb-2">
                    <div className="card-body d-flex justify-content-between align-items-center p-2">
                        <div className='d-flex flex-column'>
                            <span className="card-title mb-1">{nombre_cliente}</span>
                            <small className="card-text text-muted mb-0">{fecha.toLocaleDateString()}</small>
                        </div>
                        <div className="text-end">
                            <p className="card-text h5">{numberToMoney(total)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
