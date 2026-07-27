import { ColumnDef } from "@tanstack/react-table";
import { TopItem, TopModifier } from "../../sales.types";


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
        //     accessorKey: "total_cogs",
        //     header: "Total Cogs"
        // },
        {
            accessorKey: "sales",
            header: "Total Amount"
        },

    ];


}