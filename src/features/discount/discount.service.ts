import api from "@/lib/axios";

import { ColumnFiltersState } from "@tanstack/react-table";
import { DiscountFormValues } from "./discount.schema";

export interface GetDiscountsParams {
    page?: number;
    per_page?: number;
    search?: string;
    filters?: ColumnFiltersState;
}

export function getDiscounts(
    params: GetDiscountsParams = {}
) {
    return api.get("/api/discounts", {
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


export function listDiscounts(){

    return api.get(
        "/api/list-discounts"
    );

}



export async function createDiscount(
    data: DiscountFormValues
){

    return api.post(
        "/api/discounts",
        data
    );

}



export async function updateDiscount(
    id:number,
    data:DiscountFormValues
){

    return api.put(
        `/api/discounts/${id}`,
        data
    );

}



export async function deleteDiscount(
    id:number
){
    return api.delete(
        `/api/discounts/${id}`
    );
}