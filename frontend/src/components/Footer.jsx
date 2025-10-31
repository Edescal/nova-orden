import { useCart } from "../context/CartContext"

export default function Footer({ onCartClick = null }) {
    const {cart} = useCart()
    const btnClasses = 'btn btn-dark position-relative rounded-4 d-flex justify-content-center align-items-center p-0'
    return (
        <footer className='fixed-bottom bg-dark text-white footer-pop py-1 d-flex justify-content-center'>
            <button type="button" className={btnClasses} onClick={evt => onCartClick(evt)} style={{ width: "35px", height: "35px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M17 17h-11v-14h-2" />
                    <path d="M6 5l14 1l-1 7h-13" />
                </svg>
                <span className="position-absolute top-0 start-100 translate-middle px-2 rounded-pill bg-danger fw-bold rounded-circle">
                    <span className="visible">{ cart.length }</span>
                </span>
            </button>
        </footer>
    )
}
