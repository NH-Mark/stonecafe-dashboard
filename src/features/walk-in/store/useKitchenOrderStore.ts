"use client";

import { create } from "zustand";

export type KitchenStatus =
    | "pending"
    | "preparing"
    | "ready"
    | "unknown";

interface KitchenOrderStore {
    statuses: Record<string, KitchenStatus>;

    setKitchenStatus: (
        orderId: string,
        status: KitchenStatus
    ) => void;

    getKitchenStatus: (
        orderId: string
    ) => KitchenStatus;

    clear: () => void;
}

export const useKitchenOrderStore =
    create<KitchenOrderStore>((set, get) => ({
        statuses: {},

        setKitchenStatus: (orderId, status) => {
            console.log("🔥 SETTING STATUS:", {
                orderId,
                status,
            });

            set(state => ({
                statuses: {
                    ...state.statuses,
                    [String(orderId)]: status,
                },
            }));
        },

        getKitchenStatus: orderId => {
            return (
                get().statuses[String(orderId)] ??
                "unknown"
            );
        },

        clear: () => {
            set({
                statuses: {},
            });
        },
    }));