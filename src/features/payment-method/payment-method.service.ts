import api from "@/lib/axios";
import { ColumnFiltersState } from "@tanstack/react-table";
import { PaymentMethodFormValues } from "./payment-method.schema";

export interface GetPaymentmethodParams {
    page?: number;
    per_page?: number;
    search?: string;
    filters?: ColumnFiltersState;
}

function sortPaymentMethodsByOrder<T extends { sort_order?: number | string | null }>(
    items: T[] = []
) {
    return [...items].sort((a, b) => {
        const first = Number(a.sort_order ?? 0);
        const second = Number(b.sort_order ?? 0);

        return first - second;
    });
}

export async function getPaymentMethods(
    params: GetPaymentmethodParams = {}
) {
    const response = await api.get("/api/payment-methods", {
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

    if (Array.isArray(response.data?.data)) {
        response.data.data = sortPaymentMethodsByOrder(response.data.data);
    }

    return response;
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
  const response = await api.get("/api/list-payment-methods");

  const items = response.data?.data ?? response.data ?? [];

  if (Array.isArray(items)) {
    const sorted = sortPaymentMethodsByOrder(items);

    if (response.data?.data) {
      response.data.data = sorted;
    } else {
      response.data = sorted;
    }
  }

  return response;
}