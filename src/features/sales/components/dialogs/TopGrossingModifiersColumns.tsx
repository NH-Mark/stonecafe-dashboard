
import { ColumnDef } from "@tanstack/react-table";
import { TopModifier } from "../../sales.types";

export function TopGrossingModifiersColumns(): ColumnDef<TopModifier>[] {
    return [
        {
            accessorKey: "name",
            header: "Modifier Name",
        },
        {
            accessorKey: "menu_item",
            header: "Menu Item",
        },
        {
            accessorKey: "qty",
            header: "Total Sold",
        },
        {
            accessorKey: "price",
            header: "Unit Price",
            cell: ({ row }) =>
                `QAR ${Number(row.original.price ?? 0).toFixed(2)}`,
        },
        {
            id: "sales",
            accessorFn: (row) =>
                Number(
                    row.sales ??
                    row.total_amount ??
                    0
                ),
            header: "Total Revenue",
            cell: ({ row }) =>
                `QAR ${Number(row.getValue("sales") ?? 0).toFixed(2)}`,
        },
    ];
}
