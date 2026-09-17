"use client"

import { useEffect, useState } from "react"

import { getEcho } from "@/lib/echo"

import {
    getKitchenOrder,
    getKitchenOrders,
} from "../services/kitchen.service"

import { KitchenOrder } from "../kitchen.types"

export function useKitchenOrders() {
    const [orders, setOrders] = useState<KitchenOrder[]>([])

    // Orders that recently received new/updated items
    const [highlightedOrders, setHighlightedOrders] =
        useState<number[]>([])

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

        // --------------------------------
        // NEW ORDER
        // --------------------------------

        channel.listen(
            ".order.created",
            async (event: { order_id: number }) => {
                try {
                    const orderId = event.order_id

                    if (!orderId) {
                        return
                    }

                    const newOrder =
                        await getKitchenOrder(orderId)

                    if (!mounted) {
                        return
                    }

                    setOrders((prev) => {
                        const exists = prev.some(
                            (item) => item.id === newOrder.id
                        )

                        if (exists) {
                            return prev
                        }

                        return [...prev, newOrder]
                    })

                    // Highlight new order
                    setHighlightedOrders((prev) =>
                        prev.includes(orderId)
                            ? prev
                            : [...prev, orderId]
                    )

                    // Remove highlight after 5 seconds
                    setTimeout(() => {
                        if (!mounted) {
                            return
                        }

                        setHighlightedOrders((prev) =>
                            prev.filter(
                                (id) => id !== orderId
                            )
                        )
                    }, 5000)
                } catch (error) {
                    console.error(
                        "Failed to fetch new kitchen order:",
                        error
                    )
                }
            }
        )

        // --------------------------------
        // ORDER UPDATED
        // --------------------------------

        channel.listen(
            ".order.updated",
            async (event: { order_id: number }) => {
                try {
                    const orderId = event.order_id

                    if (!orderId) {
                        return
                    }

                    const updatedOrder =
                        await getKitchenOrder(orderId)

                    if (!mounted) {
                        return
                    }

                    setOrders((prev) =>
                        prev.map((item) =>
                            item.id === updatedOrder.id
                                ? updatedOrder
                                : item
                        )
                    )

                    // Highlight updated order
                    setHighlightedOrders((prev) =>
                        prev.includes(orderId)
                            ? prev
                            : [...prev, orderId]
                    )

                    // Remove highlight after 5 seconds
                    setTimeout(() => {
                        if (!mounted) {
                            return
                        }

                        setHighlightedOrders((prev) =>
                            prev.filter(
                                (id) => id !== orderId
                            )
                        )
                    }, 5000)
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

    return {
        orders,
        highlightedOrders,
    }
}