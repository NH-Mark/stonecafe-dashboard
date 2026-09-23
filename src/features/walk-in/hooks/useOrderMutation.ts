"use client";

import { useState } from "react";

import {
    addItemsToOrder,
    updateOrder,
    UpdateOrderPayload,
} from "../order.service";

import { useOrderStore } from "../store/useOrderStore";

import {
    getDiscountAmount,
    getGrossLineTotal,
    getItemPrice,
} from "../utils/cart-price";

type SyncMode =
    | "new-items"
    | "changes";

export function useOrderMutation(
    orderId?: string
) {
    const [updating, setUpdating] =
        useState(false);

    const updateLocalOrder =
        useOrderStore(
            state => state.updateLocalOrder
        );

    const setOrderItemId =
        useOrderStore(
            state => state.setOrderItemId
        );

    async function syncOrder(
        mode: SyncMode = "changes"
    ) {
        if (
            !orderId ||
            orderId.startsWith("new-")
        ) {
            return;
        }

        const order =
            useOrderStore.getState()
                .orders[orderId];

        if (!order) {
            throw new Error(
                "Order not found."
            );
        }

        setUpdating(true);

        try {
            /*
             * ============================================================
             * NEW ITEMS ONLY
             * ============================================================
             *
             * Used by "Send New Items".
             *
             * IMPORTANT:
             * Existing items are completely ignored here.
             */
            if (mode === "new-items") {
                const newItems =
                    order.cart.filter(
                        item =>
                            item.orderItemId == null
                    );

                if (newItems.length === 0) {
                    return null;
                }

                const payload = {
                    items: newItems.map(
                        item => ({
                            line_id:
                                item.lineId,

                            menu_item_id:
                                item.menuItem.id,

                            quantity:
                                item.quantity,

                            unit_price:
                                getItemPrice(item),

                            total_price:
                                getGrossLineTotal(item),

                            notes:
                                item.note || null,

                            modifiers:
                                item.modifiers.map(
                                    modifier => ({
                                        modifier_id:
                                            modifier.id,

                                        quantity: 1,

                                        price:
                                            Number(
                                                modifier.price
                                            ),
                                    })
                                ),

                            discounts:
                                item.discount
                                    ? [
                                        {
                                            discount_id:
                                                item.discount.id,

                                            amount:
                                                getDiscountAmount(
                                                    item
                                                ),
                                        },
                                    ]
                                    : [],
                        })
                    ),
                };

                const response =
                    await addItemsToOrder(
                        Number(orderId),
                        payload
                    );

                const responseData = response.data;

                const savedOrder =
                    responseData?.data ?? responseData;

                const createdItems =
                    responseData?.created_items ?? [];

                if (!createdItems.length) {
                    throw new Error(
                        "The server did not return the newly created order items."
                    );
                }

                createdItems.forEach(
                    (savedItem: {
                        id: number;
                        line_id: string;
                    }) => {
                        if (!savedItem.id || !savedItem.line_id) {
                            throw new Error(
                                "Invalid created order item returned by server."
                            );
                        }

                        setOrderItemId(
                            orderId,
                            savedItem.line_id,
                            Number(savedItem.id)
                        );
                    }
                );
                /*
                 * Only mark the new items as synced.
                 *
                 * If old items were modified locally,
                 * those changes remain pending.
                 */
                const latestOrder =
                    useOrderStore.getState()
                        .orders[orderId];

                if (latestOrder) {
                    const stillPending =
                        latestOrder.cart.some(
                            item =>
                                item.orderItemId == null
                        );

                    updateLocalOrder(
                        orderId,
                        {
                            syncStatus:
                                stillPending
                                    ? "pending"
                                    : "synced",
                        }
                    );
                }

                return savedOrder;
            }

            /*
             * ============================================================
             * FULL EXISTING ORDER UPDATE
             * ============================================================
             *
             * Used by "Save Changes".
             *
             * At this point every item must have a backend ID.
             */

            const missingItem =
                order.cart.find(
                    item =>
                        item.orderItemId == null
                );

            if (missingItem) {
                throw new Error(
                    `Item "${missingItem.menuItem.name}" has not been sent to the kitchen yet.`
                );
            }

            const items =
                order.cart.map(item => ({
                    line_id:
                        item.lineId,

                    id:
                        item.orderItemId!,

                    menu_item_id:
                        item.menuItem.id,

                    quantity:
                        item.quantity,

                    unit_price:
                        getItemPrice(item),

                    total_price:
                        getGrossLineTotal(item),

                    notes:
                        item.note || null,

                    modifiers:
                        item.modifiers.map(
                            modifier => ({
                                modifier_id:
                                    modifier.id,

                                quantity: 1,

                                price:
                                    Number(
                                        modifier.price
                                    ),
                            })
                        ),

                    discounts:
                        item.discount
                            ? [
                                {
                                    discount_id:
                                        item.discount.id,

                                    amount:
                                        getDiscountAmount(
                                            item
                                        ),
                                },
                            ]
                            : [],
                }));

            const subtotal =
                order.cart.reduce(
                    (sum, item) =>
                        sum +
                        getGrossLineTotal(item),
                    0
                );

            const itemDiscount =
                order.cart.reduce(
                    (sum, item) =>
                        sum +
                        getDiscountAmount(item),
                    0
                );

            const afterItemDiscount =
                Math.max(
                    subtotal -
                    itemDiscount,
                    0
                );

            const orderDiscountAmount =
                order.orderDiscount
                    ? order.orderDiscount.type ===
                        "percentage"
                        ? (
                            afterItemDiscount *
                            Number(
                                order.orderDiscount.value
                            )
                        ) / 100
                        : Math.min(
                            Number(
                                order.orderDiscount.value
                            ),
                            afterItemDiscount
                        )
                    : 0;

            const discountAmount =
                itemDiscount +
                orderDiscountAmount;

            const total =
                Math.max(
                    subtotal -
                    discountAmount,
                    0
                );

            const payload:
                UpdateOrderPayload = {
                items,

                discounts:
                    order.orderDiscount
                        ? [
                            {
                                discount_id:
                                    order.orderDiscount.id,

                                amount:
                                    orderDiscountAmount,
                            },
                        ]
                        : [],

                notes:
                    order.orderNote || null,

                subtotal,

                discount_amount:
                    discountAmount,

                tax_amount: 0,

                service_charge: 0,

                total_amount:
                    total,

                version:
                    order.version,
            };

            const response =
                await updateOrder(
                    Number(orderId),
                    payload
                );

            const updatedOrder =
                response.data?.data ??
                response.data;

            if (updatedOrder) {
                updateLocalOrder(
                    orderId,
                    {
                        ...updatedOrder,
                        syncStatus: "synced",
                    }
                );
            } else {
                updateLocalOrder(
                    orderId,
                    {
                        syncStatus: "synced",
                    }
                );
            }

            return updatedOrder;

        } catch (error) {
            updateLocalOrder(
                orderId,
                {
                    syncStatus: "error",
                }
            );

            throw error;

        } finally {
            setUpdating(false);
        }
    }

    return {
        syncOrder,
        updating,
    };
}