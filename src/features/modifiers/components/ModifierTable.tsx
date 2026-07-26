"use client";

import { DataTable } from "@/components/data-table/data-table";
import { Modifier } from "@/types/modifier";
import { modifierColumns } from "./ModifierColumns";



interface Props {

    modifiers: Modifier[];

    groups: {
        id:number;
        name:string;
    }[];

    onSuccess:()=>Promise<void>;

}


export default function ModifierTable({

    modifiers,
    groups,
    onSuccess,

}:Props){


    return (

        <DataTable

            columns={
                modifierColumns({
                    groups,
                    onSuccess
                })
            }

            data={modifiers}

            searchKey="name"

            placeholder="Search modifiers..."

        />

    );

}