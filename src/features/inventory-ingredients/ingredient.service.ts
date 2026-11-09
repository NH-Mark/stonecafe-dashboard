import api from "@/lib/axios";
import { ColumnFiltersState } from "@tanstack/react-table";
import { IngredientFormValues } from "./ingredient.schema";

export interface GetIngredientParams {
    page?: number;
    per_page?: number;
    search?: string;
    filters?: ColumnFiltersState;
}

export function getIngredients(
    params: GetIngredientParams = {}
) {
    return api.get(
        "/api/inventory-ingredients",
        {
            params: {
                page: params.page,
                per_page: params.per_page,
                search:
                    params.search || undefined,
                filters:
                    params.filters?.length
                        ? params.filters
                        : undefined,
            },
        }
    );
}

export async function createIngredient(
    data: IngredientFormValues
) {
    return api.post(
        "/api/inventory-ingredients",
        data
    );
}

export function getIngredient(id: number) {
    return api.get(
        `/api/inventory-ingredients/${id}`
    );
}

export async function updateIngredient(
    id: number,
    data: IngredientFormValues
) {
    return api.put(
        `/api/inventory-ingredients/${id}`,
        data
    );
}

export async function deleteIngredient(
    id: number
) {
    return api.delete(
        `/api/inventory-ingredients/${id}`
    );
}

export function getIngredientUsage(
    id: number
) {
    return api.get(
        `/api/inventory-ingredients/${id}/usage`
    );
}
