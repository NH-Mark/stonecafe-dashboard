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

// export interface UpdateOrderDiscountsPayload {
//     items: {
//         id: number;

//         discounts: {
//             discount_id: number;
//             amount: number;
//         }[];
//     }[];

//     discounts: {
//         discount_id: number;
//         amount: number;
//     }[];
// }

// export async function updateOrder(
//     orderId: number,
//     payload: UpdateOrderDiscountsPayload
// ) {
//     return api.put(
//         `/api/orders/${orderId}`,
//         payload
//     );
// }


export interface UpdateOrderItemPayload {
    id?: number;

    menu_item_id: number;

    quantity: number;

    unit_price: number;

    total_price: number;

    notes: string | null;

    modifiers: {
        modifier_id: number;
        quantity: number;
        price: number;
    }[];

    discounts: {
        discount_id: number;
        amount: number;
    }[];
}

export interface UpdateOrderPayload {
    items: UpdateOrderItemPayload[];

    discounts: {
        discount_id: number;
        amount: number;
    }[];

    notes: string | null;

    subtotal: number;

    discount_amount: number;

    tax_amount: number;

    service_charge: number;

    total_amount: number;

    /**
     * Optional optimistic locking.
     */
    version?: number;
}

export async function updateOrder(
    orderId: number,
    payload: UpdateOrderPayload
) {
    return api.put(
        `/api/orders/${orderId}`,
        payload
    );
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
    orderSourceId:number | null;
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