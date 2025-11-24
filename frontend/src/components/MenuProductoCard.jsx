import { numberToMoney } from '../utils/numberToMoney';
import noimgfound from '../assets/noimgfound.jpg'

export default function MenuProductoCard({ producto = null, onDetail = null }) {
    return (producto ? (
        <section 
            id={`producto-id-${producto.id}`} 
            className='bg-white border-bottom d-flex flex-row h-100 p-3 producto-card' 
            onClick={onDetail ?? null}
            style={{ cursor: onDetail ? 'pointer' : 'default' }}
        >
            <div className='col-3 col-sm-3 col-md-1 d-flex align-items-center'>
                <div className='ratio ratio-1x1' >
                    <img
                        src={producto.imagen ?? noimgfound}
                        alt={producto.nombre}
                        className="w-100 h-100 object-fit-cover rounded"
                    />
                </div>
            </div>
            <div className='col-9 col-sm-9 col-md-11  px-3 d-flex flex-column text-start'>
                <div className='d-flex justify-content-between align-items-start mb-1'>
                    <h5 id={`producto-nombre-${producto.id}`} className='fw-bold mb-0 flex-grow-1'>{producto.nombre}</h5>
                    <h5 id={`producto-precio-${producto.id}`} className='fw-semibold mb-0 ms-2 text-nowrap'>{numberToMoney(producto.precio)}</h5>
                </div>
                <small className='text-muted mb-2'>{producto.categoria.nombre}</small>
                <p id={`producto-desc-${producto.id}`} className='text-secondary lh-sm mb-0 producto-descripcion'>{producto.descripcion}</p>
            </div>
        </section>
    ) : null)
}