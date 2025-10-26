import React from 'react'

export default function ButtonDark({ text = 'Ver detalle', onClick, children = null }) {

    const classes = 'px-2 py-3 btn btn-dark rounded-5 border-3 d-flex column-gap-2 justify-content-center align-items-center'

    return (
        <button className={classes} onClick={onClick ?? null}>
            {children ? children : <></>}
            {
                text ? <span className='fw-bold'>{text}</span> : <></>
            }
        </button>
    )
}
