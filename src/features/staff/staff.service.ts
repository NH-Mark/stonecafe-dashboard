import api from "@/lib/axios";
import type { ColumnFiltersState } from "@tanstack/react-table";

export interface GetStaffParams {
page?: number;
per_page?: number;
search?: string;
filters?: ColumnFiltersState;
role_id?: number | null;
}

export interface StaffPayload {
name: string;
email: string;
role_id: number | null;
location_ids: number[];
}

export interface CreateStaffPayload extends StaffPayload {
password: string;
}

export interface UpdateStaffPayload extends Partial<StaffPayload> {
password?: string;
status?: boolean;
}

export function getStaff(params: GetStaffParams = {}) {
return api.get("/api/users", {
params: {
page: params.page,
per_page: params.per_page,
search: params.search || undefined,
filters: params.filters || undefined,
role_id: params.role_id ?? undefined,
},
});
}

export async function createStaff(
data: CreateStaffPayload
) {
const response = await api.post("/api/users", data);
return response.data;
}

export async function updateStaff(
id: number,
data: UpdateStaffPayload
) {


    const response = await api.put(
    `/api/users/${id}`,
    data
    );

    return response.data;
}

export async function deleteStaff(id: number) {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
}

export async function suspendStaff(id: number) {
    const response = await api.put(`/api/employee-logs/${id}/suspend`);
    return response.data;
}

export async function restoreStaff(id: number) {
    const response = await api.put(`/api/employee-logs/${id}/restore`);
    return response.data;
}

export function getPermissions() {
    return api.get("/api/permissions");
}
