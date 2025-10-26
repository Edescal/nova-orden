import { Children, useEffect, useState } from "react"
import React from "react"
import ButtonDark from "./ButtonDark"

export default function Dialog({children = null}) {

    const dialogElement = React.useRef()
    const btnClose = React.useRef()

    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (open) {
            dialogElement.current?.showModal();
        } else {
            dialogElement.current.classList.toggle('closing', true)
            setTimeout(() => {
                dialogElement.current.classList.toggle('closing', false)
                dialogElement.current.close()
            }, 200);
        }
    }, [open])

    useEffect(() => {
        dialogElement.current?.addEventListener('keydown', closeByEsc)
        return _ => {
            dialogElement.current?.removeEventListener('click', closeByEsc)
        }
    }, [])

    const closeByEsc = evt => {
        if (evt.key === 'Escape') {
            evt.preventDefault()
            setOpen(false)
        }
    }

    return (
        <>
            <div className="my-3 p-3">
                <ButtonDark text="sdlahdkjahdkjsahkjdahkdjhsakjdhaskjs" onClick={() => setOpen(true)} />
            </div>

            <dialog ref={dialogElement} >
                <div className="card p-3" style={{ width: "clamp(300px, 50rem, 700px)", minHeight: "500px" }} >
                    <button type="submit" onClick={() => setOpen(false)} ref={btnClose} className="btn btn-close align-self-end"></button>
                    <div className="card-body">
                        {children ? children : <></>}
                    </div>
                </div>
            </dialog>
        </>
    )
}
