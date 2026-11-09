import api from "@/lib/axios";
import { ColumnFiltersState } from "@tanstack/react-table";
import { MeasurementUnitFormValues } from "./measurement-unit.schema";

export interface GetMeasurementUnitParams {
    page?: number;
    per_page?: number;
    search?: string;
    filters?: ColumnFiltersState;
}

export function getMeasurementUnits(
    params: GetMeasurementUnitParams = {}
) {
    return api.get("/api/inventory-measurement-units", {
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

export async function createMeasurementUnit(
    data: MeasurementUnitFormValues
) {
    return api.post(
        "/api/inventory-measurement-units",
        data
    );
}

export async function updateMeasurementUnit(
    id: number,
    data: MeasurementUnitFormValues
) {
    return api.put(
        `/api/inventory-measurement-units/${id}`,
        data
    );
}

export async function deleteMeasurementUnit(
    id: number
) {
    return api.delete(
        `/api/inventory-measurement-units/${id}`
    );
}
