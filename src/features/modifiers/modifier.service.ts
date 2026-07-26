import api from "@/lib/axios";

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

export function getModifiers() {

    return api.get("/api/modifiers");

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