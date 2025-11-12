import { useEffectEvent, useState, useEffect, useRef } from 'react'
import noimgfound from '../../assets/noimgfound.jpg'
import { useModal } from '../../context/ModalContext'
import { patch } from '../../utils/apiUtils'

export default function OrdenCard({ orden, onUpdate = null, nextParam = null, prevParam = null }) {
    const cardRef = useRef()
    const modal = useModal()
    const [data, setData] = useState(orden)

    const [next, setNext] = useState({
        btnClass: '',
        btnText: '',
        nextState: '',
    })
    const [prev, setPrev] = useState({
        btnClass: '',
        btnText: '',
        nextState: '',
    })

    const patchOrden = useEffectEvent(async (estado) => {
        console.log(estado)
        if (!orden || !orden.id) return
        const res = await patch(`/api/ordenes/${orden.id}/`, {
            "estado": estado
        })
        if (res) {
            if (cardRef.current) {
                cardRef.current.classList.add('card-close')
                setTimeout(() => {
                    cardRef.current.classList.remove('card-close')
                    setData(res)
                    onUpdate?.()
                }, 400)
            }
        }
    })

    useEffect(() => {
        if (cardRef.current) {
            cardRef.current.classList.add('card-open')
            setTimeout(() => {
                cardRef.current.classList.remove('card-open')
            }, 500)
        }
    }, [])

    useEffect(() => {
        setNext(nextParam)
        setPrev(prevParam)
        setData(orden)
    }, [orden, prevParam, nextParam])

    const handleModal = (nextState) => {
        console.log(`Nuevo estado: ${nextState}`)
        modal.confirm((
            <div className="text-center">
                <p className="mb-3">¿Quieres actualizar el <strong>estado</strong> de la orden?</p>
            </div>),
            async () => patchOrden(nextState),
        )
    }

    const getStatusColor = (numero) => {
        const colors = ['warning', 'primary', 'success', 'danger'];
        return colors[numero % colors.length];
    };

    const formatTime = (timestamp) => {
        const now = Date.now();
        const diff = Math.floor((now - timestamp) / 1000 / 60);
        if (diff < 1) return 'Hace un momento';
        if (diff < 60) return `Hace ${diff} minutos`;
        const hours = Math.floor(diff / 60);
        return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    };

    return (
        <div ref={cardRef} className={`card mb-3 shadow border-start-0 border-top-1 border-bottom-0 border-end-0 border-5 border-${getStatusColor(data.estado)}`}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h6 className="mb-1">
                            <span className="badge bg-dark me-2">#{data.numero}</span>
                            {data.nombre_cliente}
                        </h6>
                        <small className="text-muted">{formatTime(data.fecha)}</small>
                    </div>
                    <h5 className="mb-0">${data.total.toFixed(2)}</h5>
                </div>

                <hr className="my-2" />

                {data.pedidos.map((pedido, idx) => (
                    <div key={pedido.id} className={`d-flex gap-3 ${idx < data.pedidos.length - 1 ? 'mb-3' : ''}`}>
                        <div className="flex-fill">
                            <div className="d-flex justify-content-between">
                                <strong className='fs-6'>{pedido.producto.nombre}</strong>
                                <span className="badge bg-dark">x{pedido.cantidad}</span>
                            </div>
                            {/* <small className="text-muted d-block fs-6">{pedido.producto.descripcion}</small> */}
                            {pedido.opciones.length > 0 && (
                                <div className="mt-1">
                                    {pedido.opciones.map((opcion) => (
                                        <small key={opcion.id} className="d-block text-muted">
                                            • {opcion.descripcion}
                                            {parseFloat(opcion.precio) > 0 && ` (+${opcion.precio})`}
                                        </small>
                                    ))}
                                </div>
                            )}
                            {pedido.anotacion && (
                                <div className="alert alert-secondary p-2 mt-2 mb-0">
                                    <small><strong>Nota:</strong> {pedido.anotacion}</small>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div className='mt-3 d-flex justify-content-between column-gap-1'>
                    <div className='d-flex column-gap-2'>
                        {prev ?
                            <button className={prev.btnClass} onClick={() => handleModal(prev.nextState)}>{prev.btnText}</button>
                            : null}
                        {next ?
                            <button className={next.btnClass} onClick={() => handleModal(next.nextState)}>{next.btnText}</button>
                            : null}
                    </div>
                    {orden ? <button className='btn btn-danger align-self-end' onClick={() => handleModal(4)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.01em" height="1em" viewBox="0 0 1025 1024"><path fill="currentColor" d="M960.865 192h-896q-26 0-45-18.5t-19-45t18.5-45.5t45.5-19h320q0-26 18.5-45t45.5-19h128q27 0 45.5 19t18.5 45h320q26 0 45 19t19 45.5t-19 45t-45 18.5m0 704q0 53-37.5 90.5t-90.5 37.5h-640q-53 0-90.5-37.5t-37.5-90.5V256h896zm-640-448q0-26-19-45t-45.5-19t-45 19t-18.5 45v384q0 27 18.5 45.5t45 18.5t45.5-18.5t19-45.5zm256 0q0-26-19-45t-45.5-19t-45 19t-18.5 45v384q0 27 18.5 45.5t45 18.5t45.5-18.5t19-45.5zm256 0q0-26-19-45t-45.5-19t-45 19t-18.5 45v384q0 27 18.5 45.5t45 18.5t45.5-18.5t19-45.5z" /></svg>
                    </button>
                        : null}
                </div>
            </div>
        </div >
    );
}
