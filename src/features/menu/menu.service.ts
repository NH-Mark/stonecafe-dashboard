import Cookies from "js-cookie";
import api from "@/lib/axios";
import { MenuItemFormValues } from "./menu-item.schema";
import { ColumnFiltersState } from "@tanstack/react-table";

function getSelectedLocationId() {
    const value = Number(Cookies.get("active_location_id"));
    return Number.isFinite(value) && value > 0 ? value : undefined;
}

//
// Menu Items
//

export interface GetMenuItemsParams {
    page?: number;
    per_page?: number;
    search?: string;
    filters?: ColumnFiltersState;
    category_id?: number | null;
    active?: boolean;
    location_id?: number;
}

export function getMenuItems(
    params: GetMenuItemsParams = {}
) {
    const selectedLocationId = params.location_id ?? getSelectedLocationId();

    return api.get("/api/menu-items", {
        params: {
            page: params.page,
            per_page: params.per_page,
            search: params.search || undefined,
            filters: params.filters || undefined,
            category_id: params.category_id ?? undefined,
            active: params.active ?? undefined,
            location_id: selectedLocationId ?? undefined,
        },
    });
}

export function listMenuItems(
    categoryId?: number,
    locationId?: number,
    activeOnly: boolean = true
) {
    const selectedLocationId = locationId ?? getSelectedLocationId();

    return api.get("/api/menu-items-list", {
        params: {
            category_id: categoryId ?? undefined,
            location_id: selectedLocationId ?? undefined,
            active: activeOnly ? 1 : undefined,
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

export function getPrinters() {
    return api.get("/api/printers");
}

