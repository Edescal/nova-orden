import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadIcon } from '../../assets/UploadIcon'
import '../../css/dropzone.css'
import { Typography } from '@mui/material'

export default function DropZone({ currentFile = null, onFileUploaded = (file) => { } }) {
    const [uploadedFile, setUploadedFile] = useState(null)
    useEffect(() => {
        if (uploadedFile) {
            onFileUploaded?.(uploadedFile)
        }
    }, [uploadedFile])

    useEffect(() => {
        if (!currentFile && uploadedFile) {
            setUploadedFile(null)
        }
    }, [currentFile])

    const onDropAcceptedCallback = useCallback(acceptedFiles => {
        setUploadedFile(acceptedFiles[0])
    }, [])

    const onDropRejectedCallback = useCallback(rejectedFiles => {
        console.warn('Acción rechazada...')
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDropAccepted: onDropAcceptedCallback,
        onDropRejected: onDropRejectedCallback,
        maxFiles: 1,
        multiple: false,
        maxSize: 5242880,
        accept: {
            'image/png': ['.png'],
            "image/jpeg": ['.jpeg'],
            "image/webp": ['.webp'],
        },
    })

    const onDragStart = ({ target }) => {
        if (target === null) return
        target.classList.add('drag')
    }
    const onDragEnd = ({ target }) => {
        if (target === null) return
        target.classList.remove('drag')
    }

    return (
        <div {...getRootProps({
            className: 'dropzone',
            role: 'button',
            onDragEnter: onDragStart,
            onDragLeave: onDragEnd,
            onDrop: onDragEnd,
        })} >
            <input {...getInputProps()} />
            <UploadIcon width="3em" height="3em" className="pe-none" />
            {
                isDragActive ?
                    <span className='fw-semibold pe-none'>Suelta tu archivo aquí</span> :
                    <span className='fw-semibold pe-none'>Arrastra un archivo o haz click para elegir un archivo.</span>
            }
            {
                uploadedFile ?
                    <div className='file-info text-center pe-none'>
                        Imagen: <span className='pe-none'>{uploadedFile.name}</span>
                    </div> :
                    <div className='file-info text-center pe-none'>
                        Archivos permitidos: <span className='pe-none'> .jpg .png .wepg</span>
                    </div>
            }
        </div >
    )
}
