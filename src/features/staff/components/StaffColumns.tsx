import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";


import { Role } from "@/types/role";
import { Location } from "@/types/location";
import { useState } from "react";
import StaffActions from "./StaffActions";


interface StaffColumnsProps {
  onSuccess: () => Promise<void>;
  roles: Role[];
  locations: Location[];
}

export function staffColumns({
    onSuccess,
    roles,
    locations,
}:StaffColumnsProps):ColumnDef<User>[] {

return [

{
    accessorKey:"name",
    header:"Name"
},


{
    accessorKey:"email",
    header:"Email"
},


{
    accessorKey:"roles",
    header:"Role",

    cell:({row})=>(
        <div>
        {
            row.original.roles
            .map(role=>role.name)
            .join(", ")
        }
        </div>
    )
},


{
    accessorKey:"location.name",
    header:"Location"
},


{
  id: "actions",
cell: ({ row }) => (
    <StaffActions
        user={row.original}
        roles={roles}
        locations={locations}
        onSuccess={onSuccess}
    />
)

}

];


}