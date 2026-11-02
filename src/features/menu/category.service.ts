import Cookies from "js-cookie";
import api from "@/lib/axios";
import { CategoryFormValues } from "./category.schema";

function getSelectedLocationId() {
    const value = Number(Cookies.get("active_location_id"));
    return Number.isFinite(value) && value > 0 ? value : undefined;
}

//
// Categories
//

export function getCategories(locationId?: number) {
    const activeLocationId = locationId ?? getSelectedLocationId();

    return api.get("/api/categories");
}

export function getActiveMenuCategories(locationId?: number) {
    const activeLocationId = locationId ?? getSelectedLocationId();

    return api.get("/api/menu-categories", {
        params: {
            active: 1,
            location_id: activeLocationId ?? undefined,
        },
    });
}

export function createCategory(data: CategoryFormValues) {
    return api.post("/api/categories", data);
}

export function updateCategory(
    id: number,
    data: CategoryFormValues
) {
    return api.put(`/api/categories/${id}`, data);
}

export function deleteCategory(id: number) {
    return api.delete(`/api/categories/${id}`);
}
