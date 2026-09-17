"use client";

import { useEffect } from "react";

import { getEcho } from "@/lib/echo";

import { useKitchenOrderStore } from "../store/useKitchenOrderStore";
import { getKitchenOrder } from "@/features/kitchen-display/services/kitchen.service";

export function useOrderKitchenSync() {
    const setKitchenStatus =
        useKitchenOrderStore(
            state => state.setKitchenStatus
        );

   useEffect(() => {
    const echo = getEcho();

    if (!echo) {
        console.log("❌ Echo not available");
        return;
    }

    console.log("✅ WalkInPOS subscribing to kitchen");

    const channel = echo.channel("kitchen");

    const handleOrderUpdated = async (
        event: { order_id: number }
    ) => {
        console.log(
            "🔥 POS RECEIVED:",
            event
        );

        try {
            const order =
                await getKitchenOrder(
                    event.order_id
                );

            console.log(
                "🔥 KITCHEN ORDER:",
                order
            );

            setKitchenStatus(
                String(order.id),
                order.kitchen_status
            );
        } catch (error) {
            console.error(
                "❌ Kitchen sync failed:",
                error
            );
        }
    };

    channel.listen(
        ".order.updated",
        handleOrderUpdated
    );

    return () => {
        echo.leave("kitchen");
    };
}, [setKitchenStatus]);
}