import api from "@/lib/axios";
import { ColumnFiltersState } from "@tanstack/react-table";
import { PaymentMethodFormValues } from "./payment-method.schema";

export interface GetPaymentmethodParams {
    page?: number;
    per_page?: number;
    search?: string;
    filters?: ColumnFiltersState;
}

export function getPaymentMethods(
    params: GetPaymentmethodParams = {}
) {
    return api.get("/api/payment-methods", {
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





export async function createPaymentMethod(
    data: PaymentMethodFormValues
){

    return api.post(
        "/api/payment-methods",
        data
    );

}



export async function updatePaymentMethod(
    id:number,
    data:PaymentMethodFormValues
){

    return api.put(
        `/api/payment-methods/${id}`,
        data
    );

}



export async function deletePaymentMethod(
    id:number
){
    return api.delete(
        `/api/payment-methods/${id}`
    );
  }

export async function listPaymentMethods() {
  return api.get("/api/list-payment-methods");
}