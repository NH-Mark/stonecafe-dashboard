import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { OrderSource } from "@/types/order-sources";
import OrderSourceActions from "./OrderSourceActions";


interface OrderSourceColumnsProps {
  onSuccess: () => Promise<void>;
}

export function OrderSourceColumns({
    onSuccess
}:OrderSourceColumnsProps):ColumnDef<OrderSource>[] {

return [

{
    accessorKey:"name",
    header:"Name"
},
{
    accessorKey:"code",
    header:"Code"
},
{
    accessorKey: "status",

    header: "Status",

    cell: ({ row }) => (

        <Badge
            variant={
                row.original.status
                    ? "default"
                    : "destructive"
            }
        >

            {
                row.original.status
                    ? "Active"
                    : "Inactive"
            }

        </Badge>

    )
},


{
  id: "actions",
cell: ({ row }) => (
    <OrderSourceActions
        orderSource={row.original}
        onSuccess={onSuccess}
    />
)

}

];


}