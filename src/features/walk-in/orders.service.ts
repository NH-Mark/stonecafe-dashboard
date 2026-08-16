import api from "@/lib/axios"
import { Order } from "../orders/orders.types"

export async function getOrders(): Promise<Order[]> {
    try {
        const response = await api.get("/api/orders")

        return response.data.data ?? response.data
    } catch (error: any) {
        console.error(
            "Failed to fetch orders:",
            error.response?.data || error.message
        )

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch orders"
        )
    }
}

export async function getOrder(
    orderId: number
): Promise<Order> {
    try {
        const response = await api.get(
            `/api/orders/${orderId}`
        )

        return response.data.data ?? response.data
    } catch (error: any) {
        console.error(
            "Failed to fetch order:",
            error.response?.data || error.message
        )

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch order"
        )
    }
}

export async function getTodayOrders(): Promise<Order[]> {
    try {
        const response = await api.get("/api/today-orders")

        return response.data.data ?? response.data
    } catch (error: any) {
        console.error(
            "Failed to fetch orders:",
            error.response?.data || error.message
        )

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch orders"
        )
    }
}