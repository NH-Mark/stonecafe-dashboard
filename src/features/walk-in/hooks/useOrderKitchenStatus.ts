"use client";

import { useKitchenOrderStore } from
    "../store/useKitchenOrderStore";

export function useOrderKitchenStatus(
    orderId: string | null
) {
    return useKitchenOrderStore(
        state =>
            orderId
                ? state.statuses[orderId] ?? "pending"
                : "pending"
    );
}