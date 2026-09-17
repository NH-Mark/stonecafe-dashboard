import { KitchenColumn } from "./KitchenColumn"
import { KitchenOrder as Order } from "../kitchen.types"

interface Props {
    orders: Order[]
    highlightedOrders: number[]
}

const columns = [
    {
        title: "Pending",
        status: "pending",
    },
    {
        title: "Preparing",
        status: "preparing",
    },
    {
        title: "Ready",
        status: "ready",
    },
]

export function KitchenBoard({
    orders,
    highlightedOrders,
}: Props) {
    return (
        <div
            className="
                grid
                h-full
                grid-cols-1
                gap-3
                md:grid-cols-3
            "
        >
            {columns.map((column) => (
                <KitchenColumn
                    key={column.status}
                    title={column.title}
                    status={column.status}
                    orders={orders}
                    highlightedOrders={highlightedOrders}
                />
            ))}
        </div>
    )
}