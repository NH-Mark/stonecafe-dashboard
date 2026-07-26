"use client";

import { DataTable } from "@/components/data-table/data-table";
import { staffColumns } from "./StaffColumns";
import { User } from "@/types/user";
import { Role } from "@/types/role";
import { Location } from "@/types/location";

interface StaffTableProps {
    users: User[];
    onSuccess:()=>Promise<void>;
     roles: Role[];
      locations: Location[];
}


export default function StaffTable({
    users,
    onSuccess,
    roles,
    locations
}:StaffTableProps){


    return (

        <DataTable

           columns={staffColumns({
                onSuccess,
                roles,
                locations,
            })}

            data={users}

            searchKey="name"

            placeholder="Search staff..."

        />

    );

}