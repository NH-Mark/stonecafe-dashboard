import { ColumnDef } from "@tanstack/react-table";
import { TopModifier } from "../../sales.types";


interface Props {
    onSuccess: () => Promise<void>;
}

export function TopSellingModifiersColumns(): ColumnDef<TopModifier>[] {
    return [
        {
            accessorKey: "name",
            header: "Name"
        },
        {
            accessorKey: "menu_item",
            header: "Menu Item"
        },
        {
            accessorKey: "qty",
            header: "Total Sold"
        },
        // {
        //     id: "cogs",
        //     accessorFn: (row) =>
        //         Number(
        //             row.cogs ??
        //             row.total_cogs ??
        //             0
        //         ),
        //     header: "Total Cogs",
        //     cell: ({ row }) =>
        //         `QAR ${Number(row.getValue("cogs") ?? 0).toFixed(2)}`,
        // },
        {
            id: "sales",
            accessorFn: (row) =>
                Number(
                    row.sales ??
                    row.total_amount ??
                    0
                ),
            header: "Total Amount",
            cell: ({ row }) =>
                `QAR ${Number(row.getValue("sales") ?? 0).toFixed(2)}`,
        },
    ];
}