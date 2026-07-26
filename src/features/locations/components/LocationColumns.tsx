import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";


import { Role } from "@/types/role";
import { Location } from "@/types/location";
import { useState } from "react";
import LocationActions from "./LocationActions";
import { Badge } from "@/components/ui/badge";


interface LocationColumnsProps {
  onSuccess: () => Promise<void>;
}

export function LocationColumns({
    onSuccess
}:LocationColumnsProps):ColumnDef<Location>[] {

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
    accessorKey:"phone",
    header:"Phone"
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
    <LocationActions
        location={row.original}
        onSuccess={onSuccess}
    />
)

}

];


}