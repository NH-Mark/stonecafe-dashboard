import api from "@/lib/axios";
import { ColumnFiltersState } from "@tanstack/react-table";
import { OrderSourceFormValues } from "./order-sources.schema";

export interface GetOrderSourceParams {
    page?: number;
    per_page?: number;
    search?: string;
    filters?: ColumnFiltersState;
}

export function getOrderSources(
    params: GetOrderSourceParams = {}
) {
    return api.get("/api/order-sources", {
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





export async function createOrderSource(
    data: OrderSourceFormValues
){

    return api.post(
        "/api/order-sources",
        data
    );

}



export async function updateOrderSource(
    id:number,
    data:OrderSourceFormValues
){

    return api.put(
        `/api/order-sources/${id}`,
        data
    );

}



export async function deleteOrderSource(
    id:number
){
    return api.delete(
        `/api/order-sources/${id}`
    );
  }

export async function listOrderSources() {
  return api.get("/api/list-order-sources");
}