"use client";

import { DataTable } from "@/components/data-table/data-table";
import { Location } from "@/types/location";
import { LocationColumns } from "./LocationColumns";

interface LocationTableProps {
    locations : Location[];
    onSuccess:()=>Promise<void>;
}


export default function LocationTable({
    locations,
    onSuccess
}:LocationTableProps){


    return (

        <DataTable

           columns={LocationColumns({
                onSuccess
            })}

            data={locations}

            searchKey="name"

            placeholder="Search Location..."

        />

    );

}