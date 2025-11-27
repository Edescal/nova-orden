import TableroOrdenes from "./dashboard/TableroOrdenes";
import Template from "./dashboard/Template";

export default function Dashboard() {
    return (
        <>
            <Template activeBtns={['tablero']}>
                <TableroOrdenes></TableroOrdenes>
            </Template>
        </>
    );
}