import { MenuItem } from "@/types/menu-item";
import { hasPermission } from "./permission";
import { AdminMenuItem } from "@/types/admin-menu";


export function filterMenuByPermission(
    items: AdminMenuItem[],
    permissions: string[]
): AdminMenuItem[] {


    return items
        .map((item) => {


            // Parent menu
            if (item.children) {


                const children =
                    filterMenuByPermission(
                        item.children,
                        permissions
                    );


                // hide parent when no children visible
                if (children.length === 0) {

                    return null;

                }


                return {
                    ...item,
                    children
                };


            }



            // Normal menu item

            if (
                hasPermission(
                    permissions,
                    item.permission
                )
            ) {

                return item;

            }


            return null;


        })
        .filter(
            (item): item is AdminMenuItem =>
                item !== null
        );

}