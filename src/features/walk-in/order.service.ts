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
    /*
     * Order information
     */
    order_no?: string
    type?: string
    order_type_id?: number
    source?: string
    order_source_id?: number | null

    customer_id?: number | null
    restaurant_table_id?: number | null
    location_id?: number | null

    number_plate?: string | null
    dining_session_id?: number | null

    status?: string
    payment_status?: string
    kitchen_status?: string

    notes?: string | null

    /*
     * Order items
     */
    items: UpdateOrderItemPayload[]

    /*
     * Order discount
     */
    discounts: UpdateOrderDiscountPayload[]

    /*
     * Totals
     */
    subtotal: number
    discount_amount: number
    tax_amount: number
    service_charge: number
    total_amount: number

    /*
     * Optimistic locking
     */
    version?: number
}

export interface UpdateOrderDiscountPayload {
    discount_id: number
    amount: number
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