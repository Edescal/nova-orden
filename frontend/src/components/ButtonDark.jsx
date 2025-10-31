import React from 'react'

export default function ButtonDark({ text = '', onClick, children = null, disabled = false }) {

    const classes = 'btn btn-dark rounded-5 border-3 d-flex column-gap-1 px-3 justify-content-center align-items-center'

    return (
        <button disabled={disabled ? true : null} className={classes} onClick={onClick ?? null}>
            {
                text ? <span className='px-2 fs-4 fw-semibold pointer-none'>{text}</span> : <></>
            }
            {children ? children : <></>}
        </button>
    )
}
