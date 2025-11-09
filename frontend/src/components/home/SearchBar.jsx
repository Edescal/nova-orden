import { useEffect, useState } from 'react'

function SearchBar({ func }) {
    const [searchFunc, setSearchFun] = useState(() => () => { })
    useEffect(() => {
        if (func) {
            setSearchFun(() => func)
        }
    }, [])

    return (
        <div className='input-group px-4'>
            <button className='input-group-text bg-white rounded-start-5 pe-2'>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 48 48">
                    <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4">
                        <path d="M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z" />
                        <path strokeLinecap="round" d="M26.657 14.343A7.98 7.98 0 0 0 21 12a7.98 7.98 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485" />
                    </g>
                </svg>
            </button>
            <input type="text" onInput={searchFunc} className='form-control-lg form-control rounded-end-5' placeholder='Buscar...' maxLength="64"/>
        </div>
    )
}

export default SearchBar
