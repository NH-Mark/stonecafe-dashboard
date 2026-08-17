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


export interface DailySalesEmailSettings {
    enabled: boolean
    recipients: string[]
    send_time: string
}

export async function getDailySalesEmailSettings(): Promise<DailySalesEmailSettings> {
    const response = await api.get(
        "/api/sales/email-settings"
    )

    return response.data.data
}

export async function updateDailySalesEmailSettings(
    data: DailySalesEmailSettings
): Promise<DailySalesEmailSettings> {

    const response = await api.put(
        "/api/sales/email-settings",
        data
    )

    return response.data.data
}

export async function sendDailySalesEmailNow() {

    const response = await api.post(
        "/api/sales/email-settings/send-now"
    )

    return response.data
}