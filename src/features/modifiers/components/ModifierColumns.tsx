import { ColumnDef } from "@tanstack/react-table";

import { Modifier } from "@/types/modifier";
import ModifierActions from "./ModifierActions";
import { Badge } from "@/components/ui/badge";



interface Props {

    groups:{
        id:number;
        name:string;
    }[];

    onSuccess:()=>Promise<void>;

}



export function modifierColumns({

    groups,
    onSuccess

}:Props):ColumnDef<Modifier>[] {


return [

    {
        accessorKey:"name",

        header:"Modifier",
        enableColumnFilter:true
    },
     {
        accessorKey:"name_ar",

        header:"Arabic Name",

        cell:({row})=>(

            <span>

                {
                    row.original?.name_ar
                    ??
                    "-"
                }

            </span>

        ),
        enableColumnFilter:false

    },


    {
        accessorKey:"modifier_group.name",

        header:"Group",

        cell:({row})=>(

            <span>

                {
                    row.original.modifier_group?.name
                    ??
                    "-"
                }

            </span>

        ),
        enableColumnFilter:false

    },
     


    {
        accessorKey:"price",

        header:"Price",

        cell:({row})=>(

            <span>

                QAR {Number(
                    row.original.price
                ).toFixed(2)}

            </span>

        )

    },


    {
        accessorKey: "status",

        header: "Active",

        cell: ({ row }) => (

            <Badge
                variant={
                    row.original.active
                        ? "default"
                        : "destructive"
                }
            >

                {
                    row.original.active
                        ? "Active"
                        : "Inactive"
                }

            </Badge>

        )
    },


    {
        id:"actions",

        cell:({row})=>(

            <ModifierActions

                modifier={
                    row.original
                }

                groups={
                    groups
                }

                onSuccess={
                    onSuccess
                }

            />

        )

    }

];


}