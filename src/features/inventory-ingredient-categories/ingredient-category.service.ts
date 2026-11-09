import api from "@/lib/axios";
import { ColumnFiltersState } from "@tanstack/react-table";
import { IngredientCategoryFormValues } from "./ingredient-category.schema";

export interface GetIngredientCategoryParams {
    page?: number;
    per_page?: number;
    search?: string;
    filters?: ColumnFiltersState;
}

const INGREDIENT_CATEGORY_ENDPOINTS = [
    "/api/inventory-ingredient-categories",
    "/api/inventory-integredient-categories",
] as const;

async function requestWithEndpointFallback<T>(
    request: (endpoint: string) => Promise<T>
): Promise<T> {
    let lastError: unknown;

    for (const endpoint of INGREDIENT_CATEGORY_ENDPOINTS) {
        try {
            return await request(endpoint);
        } catch (error: any) {
            // Try the next endpoint only when route is not found.
            if (error?.response?.status !== 404) {
                throw error;
            }

            lastError = error;
        }
    }

    throw lastError;
}

export function getIngredientCategories(
    params: GetIngredientCategoryParams = {}
) {
    return requestWithEndpointFallback((endpoint) =>
        api.get(endpoint, {
            params: {
                page: params.page,
                per_page: params.per_page,
                search: params.search || undefined,
                filters:
                    params.filters?.length
                        ? params.filters
                        : undefined,
            },
        })
    );
}

export async function createIngredientCategory(
    data: IngredientCategoryFormValues
) {
    return requestWithEndpointFallback((endpoint) =>
        api.post(endpoint, data)
    );
}

export async function updateIngredientCategory(
    id: number,
    data: IngredientCategoryFormValues
) {
    return requestWithEndpointFallback((endpoint) =>
        api.put(`${endpoint}/${id}`, data)
    );
}

export async function deleteIngredientCategory(
    id: number
) {
    return requestWithEndpointFallback((endpoint) =>
        api.delete(`${endpoint}/${id}`)
    );
}
