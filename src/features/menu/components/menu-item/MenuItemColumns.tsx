import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/category";
import { MenuItem } from "@/types/menu-item";
import { ColumnDef } from "@tanstack/react-table";
import MenuItemActions from "./MenuItemActions";


interface Props {

    categories: Category[];

    onSuccess: () => Promise<void>;

}

export function menuItemColumns({

    categories,

    onSuccess,

}: Props): ColumnDef<MenuItem>[] {

    return [

        {

            accessorKey: "name",

            header: "Item",

        },
        {

            accessorKey: "name_ar",
            header: "Arabic Name",

        },

        {

            accessorKey: "barcode",

            header: "Barcode",

        },

        {

            accessorKey: "category.name",

            header: "Category",

        },
        

        {

            accessorKey: "price",

            header: "Price",

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

            id: "actions",

            cell: ({ row }) => (

                <MenuItemActions

                    menuItem={row.original}

                    onSuccess={onSuccess}

                />

            ),

        },

    ];

}