import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";


import { Role } from "@/types/role";
import { Location } from "@/types/location";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import DiscountActions from "./DiscountActions";
import { Discount } from "@/types/discount";


interface DiscountColumnsProps {
  onSuccess: () => Promise<void>;
}

export function DiscountColumns({
    onSuccess
}:DiscountColumnsProps):ColumnDef<Discount>[] {

return [

{
    accessorKey:"name",
    header:"Name"
},
{
    accessorKey:"type",
    header:"Type"
},

{
    accessorKey:"value",
    header:"Value"
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
    <DiscountActions
        discount={row.original}
        onSuccess={onSuccess}
    />
)

}

];


}