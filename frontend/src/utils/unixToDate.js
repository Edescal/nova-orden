export function unixToDate(timestamp) {
    const formatter = new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    return formatter.format(new Date(timestamp))
}