import { Children, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import React from "react"
import { CartContext, useCart } from "../context/CartContext"

export default function Dialog({ children = null, ref = null }) {
    const [open, setOpen] = useState(false)
    const dialog = useRef(null)
    useImperativeHandle(ref, () => ({
        open: () => {
            setOpen(true);
        },
        close: () => setOpen(false),
        ele: () => dialog
    }))

    const btnClose = React.useRef()
    useEffect(() => {
        if (open) {
            dialog.current?.showModal();
        } else {
            dialog.current?.classList?.toggle('closing', true)
            setTimeout(() => {
                dialog.current?.classList?.toggle('closing', false)
                dialog.current?.close()
            }, 200);
        }
    }, [open])

    useEffect(() => {
        const closeByEsc = evt => {
            if (evt.key === 'Escape') {
                evt.preventDefault()
                setOpen(false)
            }
        }
        dialog.current?.addEventListener('keydown', closeByEsc)
        return _ => {
            dialog.current?.removeEventListener('click', closeByEsc)
        }
    }, [])


    return (
        <>
            <dialog ref={dialog} id="dialog">
                <div className="card p-3">
                    <div className="d-flex justify-content-end p-2">
                        <button type="submit" onClick={() => setOpen(false)} ref={btnClose} className="btn btn-close align-self-end"></button>
                    </div>
                    <div className="card-body p-3">
                        {children ? children : <></>}
                    </div>
                </div>
            </dialog>
        </>
    )
}
