export default function Opciones({ group = null }) {
    return group != null ?
        <fieldset className='option-group px-2' data-group={group.id}>
            <div className='d-flex flex-column align-items-end'>
                <legend className='card-text fw-bold fs-5'> {group.descripcion} </legend>
                {group.opciones.map((option, index) => (
                    <div key={option.id} className='form-check-reverse'>
                        <label className='form-label' htmlFor={option.id}>{option.display_string}</label>
                        <input className='form-check-input border-2 border-dark' type="radio" defaultChecked={index == 0} name={group.id} id={option.id} value={option.id} data-precio={option.precio} />
                    </div>
                ))}
            </div>
        </fieldset> : null
}