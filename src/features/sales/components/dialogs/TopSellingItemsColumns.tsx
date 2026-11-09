import { ColumnDef } from "@tanstack/react-table";
import { TopItem } from "../../sales.types";


interface Props {
    onSuccess: () => Promise<void>;
}

function formatWithoutRounding(
    value: number,
    decimals = 2
) {
    const factor = 10 ** decimals;
    const scaled =
        value >= 0
            ? Math.floor(value * factor)
            : Math.ceil(value * factor);

    return (scaled / factor).toFixed(decimals);
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
            header: "Total Amount",
            cell: ({ row }) =>
                `QAR ${formatWithoutRounding(Number(row.original.sales ?? 0), 2)}`,
        },
        {
            accessorKey: "cogs",
            header: "Total Cogs",
            cell: ({ row }) =>
                `QAR ${formatWithoutRounding(Number(row.original.cogs ?? 0), 2)}`,
        },
        {
            accessorKey: "profitability.percentage",
            header: "Profitability",
            cell: ({ row }) =>
                `${formatWithoutRounding(
                    Number(
                        row.original.profitability?.percentage ?? 0
                    ),
                    2
                )}%`,
        },
    ];


}