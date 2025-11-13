import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import ModalProvider from './context/ModalContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <CartProvider>
        <ModalProvider>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </ModalProvider>
    </CartProvider>
    // </StrictMode>
)
