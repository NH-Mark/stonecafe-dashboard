"use client";

import { DataTable } from "@/components/data-table/data-table";
import { OrderColumns } from "./OrderColumns";
import { Order } from "../orders.types";

interface TableProps {
    orders : Order[];
    onSuccess: () => Promise<void>;
}


export default function OrdersTable({
    orders,
    onSuccess
}: TableProps) {
    return (
        <DataTable
            columns={OrderColumns({
                onSuccess,
            })}
            data={orders}
            searchKey="order_no"
            placeholder="Search Order..."
        />
    );

}