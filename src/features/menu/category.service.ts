import api from "@/lib/axios";
import { CategoryFormValues } from "./category.schema";

//
// Categories
//

export function getCategories() {
    return api.get("/api/categories");
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
