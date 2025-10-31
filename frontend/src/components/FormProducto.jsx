export default function FormProducto(producto = null) {
    return (
        <form method="post">
            <h3 className="text-center">Detalles de esta mierda</h3>
            <hr />
            
            <div className="input-group w-100">
                <label htmlFor="nombre-producto" className="d-flex flex-column w-100">Nombre del producto:
                    <input type="text" id="nombre-producto" className="input-decorator" placeholder="Nombre" value={producto ? producto.nombre : ''}/>
                </label>
            </div>
            <div className="input-group w-100">
                <label htmlFor="nombre-producto" className="d-flex flex-column w-100">Descripción:
                    <textarea name="descripcion-producto" id="descripcion-producto" className="input-decorator" cols="30" rows="3" maxLength="255"></textarea>
                </label>
            </div>
        </form>
    )
}
