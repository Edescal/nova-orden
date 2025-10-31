
export function numberToMoney(value) {
    const toNumber = Number(value)
    if (!Number.isFinite(toNumber))
        return '$0.00'

    const display = toNumber.toFixed(2)
    return `$${display}`
}
