import React, { Children, createContext, useCallback, useContext, useRef, useState } from 'react'
import Dialog from '../components/Dialog'
import ButtonDark from '../components/ButtonDark'

const ModalContext = createContext([])

export const useModal = () => useContext(ModalContext)

export default function ModalProvider({ children }) {
    const [content, setContent] = useState([])
    const [onConfirmCallback, setOnConfirCallback] = useState([])
    const [onCancelCallback, setOnCancelCallback] = useState([])

    const dialog = useRef()
    const confirm = useCallback((content = null, onConfirm = null, onCancel = null) => {
        setContent(content)
        setOnCancelCallback(() => onCancel)
        setOnConfirCallback(() => onConfirm)
        dialog.current?.showModal()
    }, [])

    const handleCancel = () => {
        dialog.current?.close()
        if (onCancelCallback) {
            onCancelCallback()
            console.log('mierdaaa')
        }
    }
    const handleConfirm = () => {
        dialog.current?.close()
        if (onConfirmCallback) {
            onConfirmCallback()
        }
    }

    const value = {
        confirm: confirm,
    }
    return (
        <ModalContext value={value}>
            {children}
            <dialog ref={dialog} id="modal">
                <div className="card d-flex flex-column p-3" style={{ width: "clamp(300px, 20rem, 500px)" }} >
                    <div>
                        <button className='btn btn-close' onClick={handleCancel}></button>
                    </div>
                    <div className="card-body">
                        {content ?? <span>¿Confirmar acción?</span>}
                    </div>
                    <div className='d-flex flex-column align-items-center'>
                        <ButtonDark text='Confirmar acción' onClick={handleConfirm} />
                        <a href="#" className='text-center mb-3 mt-4' onClick={handleCancel}>Regresar</a>
                    </div>
                </div>
            </dialog>
        </ModalContext>
    )
}
