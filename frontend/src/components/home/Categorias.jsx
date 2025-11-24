import { useEffect, useState } from 'react'
import { HashLink } from 'react-router-hash-link'

export default function Categorias({ negocio = null, categorias = [] }) {

    const mapToSvg = (categoria) => {
        return [
            (<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M3 14c.83.642 2.077 1.017 3.5 1c1.423.017 2.67-.358 3.5-1s2.077-1.017 3.5-1c1.423-.017 2.67.358 3.5 1M8 3a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2m4-4a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2" /><path d="M3 10h14v5a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6z" /><path d="M16.746 16.726a3 3 0 1 0 .252-5.555" /></g></svg>),
            (<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M18 9.56H6l2.25 13.5h8.25zm-14.25 0h16.5m-2.25 0a6 6 0 1 0-12 0" /><path d="m11.276 15.56l2.629-13.445A1.5 1.5 0 0 1 15.781 1L19.5 2.06M7 15.56h10.333" /></g></svg>),
            (<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M1.91 7c.043.002.126.002.293.002h11.6c.167 0 .25 0 .293-.002c1.83-.08 2.6-2.38 1.18-3.54a11 11 0 0 0-6.812-2.455h-.91A10.97 10.97 0 0 0 .975 3.284c-.133.1-.2.15-.233.177c-1.42 1.16-.652 3.47 1.18 3.54zM8.2 2h-.651a10.03 10.03 0 0 0-5.99 2.073l-.15.113l-.039.03l-.01.008c-.71.582-.326 1.73.59 1.77h12.099q.002 0 0 0c.916-.04 1.3-1.19.591-1.77l-.01-.009l-.04-.03l-.15-.112A10 10 0 0 0 8.214 2z" clipRule="evenodd" /><path fill="currentColor" d="M1 9a1 1 0 0 1 1-1h3.67a1 1 0 0 1 .6.2L10 11l2.71-2.71a1 1 0 0 1 .707-.293h.586a1 1 0 0 1 0 2h-1.59l-1.71 1.71a1 1 0 0 1-1.31.093l-2.4-1.8h-5a1 1 0 0 1-1-1z" /><path fill="currentColor" d="m12.5 12l1-1h.754c.134 0 .297-.001.44.041a1 1 0 0 1 .708.837c.019.148-.009.308-.031.44l-.007.039l-.01.064c-.077.461-.13.777-.243 1.05a2.48 2.48 0 0 1-1.73 1.46c-.286.068-.606.068-1.07.068H3.69c-.468 0-.788 0-1.07-.068a2.51 2.51 0 0 1-1.73-1.46c-.114-.27-.166-.586-.243-1.05l-.011-.064l-.007-.039a1.6 1.6 0 0 1-.031-.44a1 1 0 0 1 .709-.837C1.45 11 1.613 11 1.748 11h4.31l1.56 1h-5.83c-.095 0-.148 0-.187.002h-.007v.008c.005.038.014.09.03.183c.091.55.126.74.188.888a1.5 1.5 0 0 0 1.04.878c.157.037.35.04.907.04h8.49c.557 0 .751-.003.908-.04c.466-.11.851-.437 1.04-.878c.063-.148.098-.34.19-.888c.015-.093.024-.145.028-.183v-.008h-.006L14.223 12h-1.71z" /></svg>),
            (<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m19 14l-.804 5.626c-.07.487-.104.731-.222.915a1 1 0 0 1-.426.369c-.197.09-.443.09-.933.09H14m5-7h-5m5 0c1.303-.604 2-2.236 2-3.666c0-1.536-1.03-2.85-2.49-3.397a.79.79 0 0 1-.51-.729c0-1.265-1.12-2.291-2.5-2.291q-.34 0-.654.079c-.432.107-.915.083-1.287-.145A5.83 5.83 0 0 0 10.5 3C7.462 3 5 5.257 5 8.042c0 .352-.23.674-.557.857C3.578 9.38 3 10.254 3 11.25c0 1.277.712 2.44 2 2.75m0 0l.804 5.626v.002c.07.486.104.73.222.913a1 1 0 0 0 .426.369c.197.09.443.09.933.09H10m-5-7h5m0 0h4m-4 0v7m4-7v7m0 0h-4" /></svg>),
        ][categoria - 1]
    }

    const toCategoria = (nombre) => {
        return negocio ? `/${negocio.slug}/menu#${nombre.split(' ').join('-').toLowerCase()}` : '#'
    }
    const scrollWithOffset = (el) => {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
    };

    return (
        <article className='py-3'>
            {
                categorias && <div className='container'>
                    <div className='row justify-content-center g-0'>
                        {categorias.map(cat => (
                            <div key={cat.id} id={cat.id} className='col-3 d-flex flex-column align-items-center justify-content-start  gap-2 col-sm-3 col-md-3 p-1'>
                                <HashLink to={toCategoria(cat.nombre)} scroll={scrollWithOffset} className='p-2 btn-categoria'>
                                    {mapToSvg(cat.id)}
                                </HashLink>
                                <span className='fs-6 text-center  lh-1'>{cat.nombre}</span>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </article >
    )
}
