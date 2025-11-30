import TableroOrdenes from "./dashboard/TableroOrdenes";
import Template from "./dashboard/Template";
import TestTemplate from "./TestTemplate";

export default function Dashboard() {
    return (
        <>
        <TestTemplate>
            {/* <Template activeBtns={['tablero']}> */}
                <TableroOrdenes></TableroOrdenes>
            {/* </Template> */}
        </TestTemplate>
        </>
    );
}