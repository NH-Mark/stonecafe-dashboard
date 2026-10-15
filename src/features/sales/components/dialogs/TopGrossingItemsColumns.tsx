
import { ColumnDef } from "@tanstack/react-table";
import { TopItem } from "../../sales.types";

export function TopGrossingItemsColumns(): ColumnDef<TopItem>[] {
    return [
        {
            accessorKey: "name",
            header: "Item Name",
        },
        {
            accessorKey: "sales",
            header: "Total Revenue",
            cell: ({ row }) =>
                `QAR ${Number(row.original.sales ?? 0).toFixed(2)}`,
        },
        {
            accessorKey: "qty",
            header: "Total Sold",
        },
        {
            accessorKey: "cogs",
            header: "Total COGS",
            cell: ({ row }) =>
                `QAR ${Number(row.original.cogs ?? 0).toFixed(2)}`,
        },
        {
            id: "profitability",
            accessorFn: (row) => row.profitability?.percentage ?? 0,
            header: "Profitability",
            cell: ({ row }) =>
                `${Number(
                    row.original.profitability?.percentage ?? 0
                ).toFixed(2)}%`,
        },
    ];
}
