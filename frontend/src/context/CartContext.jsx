import { act, createContext, useCallback, useContext, useMemo, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { get, post } from '../utils/apiUtils'


export const CartContext = createContext([])

export const useCart = () => useContext(CartContext)

const cartReducer = (state = [], action) => {
    switch (action.type) {
        case 'add_item':
            if (!action.data) {
                console.warn('Se intentó agregar un objeto vacío al carrito')
                return state
            }
            console.log('Item added')
            const items = [...state, { ...action.data }]
            return items
        case 'remove_item':
            if (!action.data) {
                console.warn('Se intentó eliminar un objeto vacío del carrito')
                return state
            }
            console.log('Item removed')
            const filtered = state.filter(p => p.id !== action.data.id)
            return filtered
        case 'update_item':
            if (!action.data) {
                console.warn('Se intentó actualizar un objeto vacío del carrito')
                return state
            }
            console.log('TODO: Item updated')
            return state
        case 'reset':
            console.log('TODO: Reset')
            return []
        default:
            console.log('Invalid state')
            return state
    }
}

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, [])
    const [isBusy, setIsBusy] = useState(false)

    const addToCart = useCallback((producto) =>
        dispatch({
            type: 'add_item',
            data: producto
        }), [])

    const removeFromCart = useCallback((producto) =>
        dispatch({
            type: 'remove_item',
            data: producto
        }), [])
    const updateCart = useCallback((producto) =>
        dispatch({
            type: 'update_item',
            data: producto
        }), [])
    const clearCart = useCallback((producto) =>
        dispatch({
            type: 'reset',
            data: producto
        }), [])
    const createOrder = useCallback(async (nombreCliente="SDS") => {
        console.log(`Creando orden para: ${nombreCliente}`)
        if (isBusy) {
            console.warn('El carrito está ocupado...')
            return false
        }
        setIsBusy(true)
        try {
            const body = {
                fecha: new Date().getTime(),
                negocio: "f32feeea-7313-4115-bdb9-fb65a60f0b64",
                nombre_cliente: nombreCliente,
                productos: cart,
            }
            const resultado = await post('/api/ordenes/', body)
            if (resultado) {
                dispatch({
                    type: 'reset',
                    data: undefined
                })
                return resultado
            }
            throw new Error('No devolvió nada la petición')
        } catch (error) {
            console.log(`Salida:`)
            console.error(error)
        } finally {
            setIsBusy(false)
        }
        return false

    }, [cart, dispatch])
    const getPrice = useCallback(() => {
        let total = 0
        cart.forEach(detalle => {
            try {
                total += Number(detalle.producto.precio)
                detalle.opciones.forEach(opcion => {
                    total += Number(opcion.precio)
                })
            } catch (error) {
                console.log(`Error al obtener precios del carrito: ${error}`)
                return 0
            }
        })
        return total
    })

    const value = useMemo(() => ({
        cart,
        addItem: addToCart,
        removeItem: removeFromCart,
        update: updateCart,
        clear: clearCart,
        getPrice: getPrice,
        submit: createOrder,

    }), [cart, addToCart, removeFromCart, updateCart, clearCart, createOrder])

    return (
        <CartContext value={value} >
            {children}
        </CartContext>
    )
}
