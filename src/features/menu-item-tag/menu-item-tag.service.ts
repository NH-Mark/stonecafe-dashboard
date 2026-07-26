import api from "@/lib/axios";
import { MenuItemTagFormValues } from "./menu-item-tag.schema";


//
// Menu Items
//

export function getMenuItemTags(
) {

    return api.get("/api/menu-item-tags");

}

export function createMenuItemTag(
    data: MenuItemTagFormValues
) {

    return api.post("/api/menu-item-tags", data);

}

export function updateMenuItemTag(
    id: number,
    data: MenuItemTagFormValues
) {

    return api.put(`/api/menu-item-tags/${id}`, data);

}

export function deleteMenuItemTag(id: number) {

    return api.delete(`/api/menu-item-tags/${id}`);

}

