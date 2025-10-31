import React, { act, createContext, useCallback, useContext, useMemo, useReducer } from 'react'

export const CartContext = createContext([])

export const useCart = () => useContext(CartContext)

const cartReducer = (state = [], action) => {
    switch (action.type) {
        case 'add_item':
            console.log('Item added')
            const items = [...state, { ...action.data }]
            return items
        case 'remove_item':
            console.log('Item removed')
            const filtered = state.filter(p => p.id !== action.data.id)
            return filtered
        case 'update_item':
            console.log('Item updated')
            return state
        case 'reset':
            console.log('Reset')
            return state
        default:
            console.log('Invalid state')
            return state
    }
}

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, [])

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
    const getPrice = useCallback(() => {
        let total = 0
        cart.forEach(detalle => {
            total += Number(detalle.producto.precio)
            detalle.opciones.forEach(opcion => {
                total += Number(opcion.precio)
            })
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
    }), [cart, addToCart, removeFromCart, updateCart, clearCart])

    return (
        <CartContext value={value} >
            {children}
        </CartContext>
    )
}
