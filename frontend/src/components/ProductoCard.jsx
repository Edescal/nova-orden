import { numberToMoney } from '../utils/numberToMoney';
import noimgfound from '../assets/noimgfound.jpg'

export default function ProductoCard({ producto = null, onDetail = null }) {
    return (producto ? (
        <section id={`producto-id-${producto.id}`} className='bg-light border-bottom border-end border-start p-3' onClick={onDetail ?? null}>
            <div className='d-flex'>
                <div className={`ratio ${false ? 'ratio-4x3' : 'ratio-1x1'}`} style={{ flexBasis: 'clamp(70px, 16vw, 140px)' }} >
                    <img
                        src={producto.imagen ?? noimgfound}
                        alt="Preview del archivo"
                        className="w-100 h-100 object-fit-contain"
                    />
                </div>
                <div className='container d-flex flex-column flex-nowrap flex-grow-1' >
                    <div className='d-flex justify-content-between align-items-center'>
                        <h4 id={`producto-nombre-${producto.id}`} className='card-title mb-0'>{producto.nombre}</h4>
                        <h4 id={`producto-precio-${producto.id}`} className='card-text d-flex'>{numberToMoney(producto.precio)}</h4>
                    </div>
                    <small className='text-secondary mb-2'>{producto.categoria.nombre}</small>
                    <span id={`producto-desc-${producto.id}`} className='text-muted lh-sm mb-3 pe-5'>{producto.descripcion}</span>
                </div>
            </div>
        </section>
    ) : null)
}
