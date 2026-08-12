import api from "@/lib/axios";
import { ColumnFiltersState } from "@tanstack/react-table";
import { OrdersFiltersState } from "./components/ordersFilters";


export interface GetOrdersParams {
    page?: number;
    per_page?: number;
    search?: string;
    filters?: ColumnFiltersState;
    range?: OrdersFiltersState["range"];

    start_date?: string;

    end_date?: string;

    location_id?: number;

    order_type?: string;
}

export async function getOrders(params: GetOrdersParams = {}) {
    return api.get("/api/orders", {
        params,
    });
}

interface TablePaymentResponse {
    message: string;
    sessionId: number;
    sessionStatus: "open" | "billing" | "closed" | "cancelled";
    sessionClosed: boolean;
    orderIds: number[];
    paymentMethodId: number;
    amount: number;
    payments: unknown[];
}

export interface CreatePaymentItem {

payment_method_id: number;

amount: number;

reference?: string;

}

export interface CreatePaymentPayload {

payments: CreatePaymentItem[];

}

export interface CreatePaymentResponse {

message: string;

order_paid: boolean;

session_closed: boolean;

order_id: number;

order_total: number;

paid_amount: number;

remaining_amount: number;

payments: unknown[];

}

export async function createPayment(

orderId: number,

payload: CreatePaymentPayload

) {
return api.post<CreatePaymentResponse>(

    `/api/orders/${orderId}/payments`,

    payload

);

}


export async function updateOrderStatus(
    id: number,
    status: string
) {
    return api.post(`/api/orders/${id}/order-status`, {
        status,
    });
}