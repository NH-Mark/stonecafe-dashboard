import api from "@/lib/axios";
import { SalesDashboardFilters } from "./sales.schema";


export async function getSalesDashboard(
    filters?: SalesDashboardFilters
) {
    const response = await api.get(
        "/api/sales/dashboard",
        {
            params: filters,
        }
    );

    return response.data;
}



export async function getOrders(params?: any) {

    const response =
        await api.get(
            "/api/sales/orders",
            {
                params
            }
        );


    return response.data;

}

export async function getOrderTypes(){

    return api.get(
        "/api/order-types"
    );

}