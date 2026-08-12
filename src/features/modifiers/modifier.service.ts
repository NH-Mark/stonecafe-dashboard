import api from "@/lib/axios";
import { ColumnFiltersState } from "@tanstack/react-table";

//
// Groups
//

export function getModifierGroups() {

    return api.get("/api/modifier-groups");

}

export function createModifierGroup(data:any) {

    return api.post("/api/modifier-groups", data);

}

export function updateModifierGroup(
    id:number,
    data:any
) {

    return api.put(`/api/modifier-groups/${id}`, data);

}

export function deleteModifierGroup(id:number) {

    return api.delete(`/api/modifier-groups/${id}`);

}

//
// Modifiers
//

export interface GetModifiersParams {
page?: number;
per_page?: number;
search?: string;
filters?: ColumnFiltersState;
modifier_group_id?: number;
}

export function getModifiers(
params: GetModifiersParams = {}
) {
return api.get("/api/modifiers", {
params: {
page: params.page,
per_page: params.per_page,
search: params.search || undefined,
filters: params.filters || undefined,
modifier_group_id:
params.modifier_group_id ??
undefined,
},
});
}


export function createModifier(data:any) {

    return api.post("/api/modifiers", data);

}

export function updateModifier(
    id:number,
    data:any
) {

    return api.put(`/api/modifiers/${id}`, data);

}

export function deleteModifier(id:number) {

    return api.delete(`/api/modifiers/${id}`);

}