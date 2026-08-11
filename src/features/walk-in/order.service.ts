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

export interface CreateTablePaymentPayload {
    sessionId: number;
    orderIds: number[];
    amount: number;
    paymentMethodId: number;
}

export async function createTablePayment(
    payload: CreateTablePaymentPayload
) {
    return api.post(
        "/api/table-payments",
        payload
    );
}