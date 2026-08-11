// order.service.ts

import api from "@/lib/axios";
import { PaymentMethod } from "@/types/payment-method";


export async function createOrder(payload: any) {

    const response =
        await api.post(
            "/api/orders",
            payload
        );


    return response.data;

}


export async function addItemsToOrder(
    orderId: number,
    payload: {
        items: any[];
    }
) {
    return api.post(
        `/api/orders/${orderId}/items`,
        payload
    );
}


export interface CreateTablePaymentItem {
    payment_method_id: number;
    amount: number;
    reference?: string;
}

export interface CreateTablePaymentPayload {
    sessionId: number;
    orderIds: number[];
    amount: number;
    payments: CreateTablePaymentItem[];
}

export async function createTablePayment(
    payload: CreateTablePaymentPayload
) {
    return api.post(
        "/api/table-payments",
        payload
    );
}