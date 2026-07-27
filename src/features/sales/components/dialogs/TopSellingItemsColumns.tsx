import { ColumnDef } from "@tanstack/react-table";
import { TopItem } from "../../sales.types";


interface Props {
    onSuccess: () => Promise<void>;
}

export function TopSellingItemsColumns(): ColumnDef<TopItem>[] {

    return [
        {
            accessorKey: "name",
            header: "Name"
        },
        {
            accessorKey: "qty",
            header: "Total Sold"
        },
        {
            accessorKey: "sales",
            header: "Total Amount"
        },
        {
            accessorKey: "cogs",
            header: "Total Cogs"
        },
        {
            accessorKey: "profitability.percentage",
            header: "Profitability"
        },
    ];


}