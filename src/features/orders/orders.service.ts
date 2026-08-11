import api from "@/lib/axios";


export interface GetOrdersParams {
    page?: number;
    per_page?: number;
    search?: string;
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

export async function createPayment(
    orderId: number,
    data: {
        payment_method_id: number;
        amount: number;
        reference?: string;
    }
) {
    return api.post(
        `/api/orders/${orderId}/payments`,
        data
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