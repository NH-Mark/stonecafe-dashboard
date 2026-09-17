
"use client"

import { useEffect, useState } from "react"

import { getEcho } from "@/lib/echo"


import { getKitchenOrder, getKitchenOrders } from "../services/kitchen.service"

import { KitchenOrder } from "../kitchen.types"
import { getOrder } from "@/features/walk-in/orders.service"

export function useKitchenOrders() {
    const [orders, setOrders] = useState<KitchenOrder[]>([])

    useEffect(() => {
        let mounted = true

        async function load() {
            try {
                const data = await getKitchenOrders()

                if (mounted) {
                    setOrders(data)
                }
            } catch (error) {
                console.error(
                    "Failed to load kitchen orders:",
                    error
                )
            }
        }

        void load()

        const echo = getEcho()

        if (!echo) {
            return
        }

        const channel = echo.channel("kitchen")

        // New Order
        channel.listen(
            ".order.created",
            async (event: { order_id: number }) => {
                try {
                    const orderId = event.order_id

                    if (!orderId) {
                        return
                    }

                    // Fetch the complete order from the API
                   const newOrder =
                            await getKitchenOrder(orderId)

                        setOrders((prev) => {
                            const exists = prev.some(
                                (item) => item.id === newOrder.id
                            )

                            if (exists) {
                                return prev
                            }

                            return [...prev, newOrder]
                        })
                } catch (error) {
                    console.error(
                        "Failed to fetch new kitchen order:",
                        error
                    )
                }
            }
        )

        // Status Update
        channel.listen(
            ".order.updated",
            async (event: { order_id: number }) => {
                try {
                    const orderId = event.order_id

                    if (!orderId) {
                        return
                    }

                    // Fetch the latest order from the API
                    const updatedOrder =
                        await getKitchenOrder(orderId)

                    setOrders((prev) =>
                        prev.map((item) =>
                            item.id === updatedOrder.id
                                ? updatedOrder
                                : item
                        )
                    )
                } catch (error) {
                    console.error(
                        "Failed to fetch updated kitchen order:",
                        error
                    )
                }
            }
        )

        return () => {
            mounted = false

            echo.leave("kitchen")
        }
    }, [])

    return orders
}
