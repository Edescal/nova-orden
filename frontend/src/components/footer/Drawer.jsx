import React from 'react'
import '../../css/botom-drawer.css'

export default function Drawer({ open, onClose = null, header = null, children = null, footer = null }) {
    return (
        <div className={`drawer ${open ? "open" : ""}`}>
            <div className="drawer-backdrop" onClick={onClose}></div>
            <div className="drawer-panel bottom">
                <div className="drawer-handle" onClick={onClose}></div>
                <div className='drawer-header'>
                    {header}
                </div>
                <div className="drawer-body">
                    {children}
                </div>
                <div className="drawer-footer">
                    {footer}
                </div>
            </div>
        </div>
    )
}
