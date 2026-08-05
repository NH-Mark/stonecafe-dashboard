import api from "@/lib/axios";


export async function getOrders() {
  return api.get("/api/orders");
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
    return api.patch(`/api/orders/${id}/order-status`, {
        status,
    });
}