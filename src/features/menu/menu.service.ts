import api from "@/lib/axios";
import { MenuItemFormValues } from "./menu-item.schema";


//
// Menu Items
//

export interface GetMenuItemsParams {
page?: number;
per_page?: number;
search?: string;
category_id?: number | null;
}

export function getMenuItems(
params: GetMenuItemsParams = {}
) {
return api.get("/api/menu-items", {
params: {
page: params.page,
per_page: params.per_page,
search: params.search || undefined,
category_id:
params.category_id ?? undefined,
},
});
}


export function getMenuItem(id: number) {
    return api.get(`/api/menu-items/${id}`);
}

export function createMenuItem(
    data: MenuItemFormValues
) {

    return api.post("/api/menu-items", data);

}

export function updateMenuItem(
    id: number,
    data: MenuItemFormValues
) {

    return api.put(`/api/menu-items/${id}`, data);

}

export function deleteMenuItem(id: number) {

    return api.delete(`/api/menu-items/${id}`);

}

export async function updateMenuItemModifierGroup(
    menuItemId:number,
    modifierGroupId:number,
    data:any
){

    return api.put(

        `/api/menu-items/${menuItemId}/modifier-groups/${modifierGroupId}`,

        data

    );

}
