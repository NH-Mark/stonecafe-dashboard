"use client"

import { useEffect, useRef, useState } from "react"
import { getEcho } from "@/lib/echo"

import {
    getKitchenOrder,
    getKitchenOrders,
} from "../services/kitchen.service"

import { KitchenOrder } from "../kitchen.types"

export function useKitchenOrders() {
    const [orders, setOrders] = useState<KitchenOrder[]>([])
    const [newItemIds, setNewItemIds] = useState<number[]>([])

    // Always contains the latest orders
    const ordersRef = useRef<KitchenOrder[]>([])

    useEffect(() => {
        let mounted = true

        async function load() {
            try {
                const data = await getKitchenOrders()

                if (!mounted) {
                    return
                }

                setOrders(data)

                // Keep ref synchronized
                ordersRef.current = data
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

                        const updatedOrders = [
                            ...prev,
                            newOrder,
                        ]

                        ordersRef.current = updatedOrders

                        return updatedOrders
                    })

                    // All items are new for a completely new order
                    const itemIds = newOrder.items.map(
                        (item) => item.id
                    )

                    console.log(
                        "New order item IDs:",
                        itemIds
                    )

                    setNewItemIds((prev) => [
                        ...new Set([
                            ...prev,
                            ...itemIds,
                        ]),
                    ])

                    setTimeout(() => {
                        if (!mounted) {
                            return
                        }

                        setNewItemIds((prev) =>
                            prev.filter(
                                (id) =>
                                    !itemIds.includes(id)
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

                    // IMPORTANT:
                    // Get the latest order from the ref,
                    // not from the stale `orders` variable.
                    const previousOrder =
                        ordersRef.current.find(
                            (order) =>
                                order.id === orderId
                        )

                    console.log(
                        "Previous order:",
                        previousOrder
                    )

                    const previousItemIds =
                        previousOrder?.items.map(
                            (item) => item.id
                        ) ?? []

                    console.log(
                        "Previous item IDs:",
                        previousItemIds
                    )

                    const addedItemIds =
                        updatedOrder.items
                            .filter(
                                (item) =>
                                    !previousItemIds.includes(
                                        item.id
                                    )
                            )
                            .map(
                                (item) => item.id
                            )

                    console.log(
                        "Newly added item IDs:",
                        addedItemIds
                    )

                    // Update orders
                    setOrders((prev) => {
                        const updatedOrders =
                            prev.map((item) =>
                                item.id === updatedOrder.id
                                    ? updatedOrder
                                    : item
                            )

                        // Keep ref synchronized
                        ordersRef.current =
                            updatedOrders

                        return updatedOrders
                    })

                    // Highlight newly added items
                    if (addedItemIds.length > 0) {
                        setNewItemIds((prev) => [
                            ...new Set([
                                ...prev,
                                ...addedItemIds,
                            ]),
                        ])

                        setTimeout(() => {
                            if (!mounted) {
                                return
                            }

                            setNewItemIds((prev) =>
                                prev.filter(
                                    (id) =>
                                        !addedItemIds.includes(
                                            id
                                        )
                                )
                            )
                        }, 5000)
                    }
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
        newItemIds,
    }
}