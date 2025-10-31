import React from 'react'

export default function Opciones({ group }) {
    return (
        <fieldset className='option-group px-3' data-group={ group.id }>
            <div className='d-flex flex-column align-items-end'>
                <legend className='card-text fw-bold fs-5'> {group.descripcion} </legend>
                {group.options.map(opt => (
                    <div key={opt.id} className='form-check-reverse'>
                        <label className='form-label' htmlFor={opt.id}>{opt.display_string}</label>
                        <input className='form-check-input border-2 border-dark' type="radio" name={group.id} id={opt.id} value={opt.id} data-precio={opt.precio} />
                    </div>
                ))}
            </div>
        </fieldset>
    )
}
