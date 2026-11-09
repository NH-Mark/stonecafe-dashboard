import api from "@/lib/axios";
import { ColumnFiltersState } from "@tanstack/react-table";
import { SupplierFormValues } from "./supplier.schema";

export interface GetSupplierParams {
    page?: number;
    per_page?: number;
    search?: string;
    filters?: ColumnFiltersState;
}

export function getSuppliers(
    params: GetSupplierParams = {}
) {
    return api.get("/api/inventory-suppliers", {
        params: {
            page: params.page,
            per_page: params.per_page,
            search: params.search || undefined,
            filters:
                params.filters?.length
                    ? params.filters
                    : undefined,
        },
    });
}

export async function createSupplier(
    data: SupplierFormValues
) {
    return api.post(
        "/api/inventory-suppliers",
        data
    );
}

export async function updateSupplier(
    id: number,
    data: SupplierFormValues
) {
    return api.put(
        `/api/inventory-suppliers/${id}`,
        data
    );
}

export async function deleteSupplier(
    id: number
) {
    return api.delete(
        `/api/inventory-suppliers/${id}`
    );
}
