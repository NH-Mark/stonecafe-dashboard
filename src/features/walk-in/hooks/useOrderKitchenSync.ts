"use client";

import { useEffect } from "react";

import { getEcho } from "@/lib/echo";
import { getKitchenOrder } from "@/features/kitchen/services/kitchen.service";

import { useKitchenOrderStore } from "../store/useKitchenOrderStore";

export function useOrderKitchenSync() {
    const setKitchenStatus =
        useKitchenOrderStore(
            state => state.setKitchenStatus
        );

    useEffect(() => {
        console.log(
            "🟢 POS useOrderKitchenSync mounted"
        );

        const echo = getEcho();

        if (!echo) {
            console.error(
                "❌ POS Echo is not available"
            );
            return;
        }

        console.log(
            "🟢 POS subscribing to kitchen channel"
        );

        const channel =
            echo.channel("kitchen");

        channel.listen(
            ".order.updated",
            async (
                event: { order_id: number }
            ) => {
                console.log(
                    "🚨🚨 POS RECEIVED PUSHER:",
                    event
                );

                try {
                    const order =
                        await getKitchenOrder(
                            event.order_id
                        );

                    console.log(
                        "🚨 POS FETCHED ORDER:",
                        order
                    );

                    setKitchenStatus(
                        String(order.id),
                        order.kitchen_status
                    );
                } catch (error) {
                    console.error(
                        "❌ POS kitchen sync error:",
                        error
                    );
                }
            }
        );

        return () => {
            console.log(
                "🔴 POS leaving kitchen channel"
            );

            echo.leave("kitchen");
        };
    }, [setKitchenStatus]);
}