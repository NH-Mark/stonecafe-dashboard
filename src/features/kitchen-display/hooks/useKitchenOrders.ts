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
    const [newItemIds, setNewItemIds] = useState<number[]>([])

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

                    // Highlight all items of a completely new order
                    const itemIds = newOrder.items.map(
                        (item) => item.id
                    )

                    setNewItemIds((prev) => [
                        ...prev,
                        ...itemIds.filter(
                            (id) => !prev.includes(id)
                        ),
                    ])

                    setTimeout(() => {
                        if (!mounted) {
                            return
                        }

                        setNewItemIds((prev) =>
                            prev.filter(
                                (id) => !itemIds.includes(id)
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

                    // Find the previous version of this order
                    const previousOrder =
                        orders.find(
                            (order) =>
                                order.id === orderId
                        )

                    // Find items that did not exist before
                    const previousItemIds =
                        previousOrder?.items.map(
                            (item) => item.id
                        ) ?? []

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

                    // Update order
                    setOrders((prev) =>
                        prev.map((item) =>
                            item.id === updatedOrder.id
                                ? updatedOrder
                                : item
                        )
                    )

                    // Highlight newly added items
                    if (addedItemIds.length > 0) {
                        setNewItemIds((prev) => [
                            ...prev,
                            ...addedItemIds.filter(
                                (id) =>
                                    !prev.includes(id)
                            ),
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
                    console.log(newItemIds);
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