import api from "@/lib/axios";


export async function getOrders() {
  return api.get("/api/orders");
}

export async function updatePaymentStatus(
    id: number,
    payment_status: string
) {
    return api.patch(`/api/orders/${id}/payment-status`, {
        payment_status,
    });
}

export async function updateOrderStatus(
    id: number,
    status: string
) {
    return api.patch(`/api/orders/${id}/order-status`, {
        status,
    });
}