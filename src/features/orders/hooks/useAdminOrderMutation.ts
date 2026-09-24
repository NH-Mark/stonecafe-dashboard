
"use client"

import { useState } from "react"

import { Order } from "../orders.types"

import {
    addItemsToOrder,
    updateOrder,
    UpdateOrderPayload,
} from "@/features/walk-in/order.service"

type OrderItemType = Order["items"][number]

type CreatedItem = {
    id: number
    line_id?: string | number | null
}

type AddItemPayload = {
    line_id: string
    menu_item_id: number
    quantity: number
    unit_price: number
    total_price: number
    notes: string | null
    modifiers: {
        modifier_id: number
        quantity: number
        price: number
    }[]
    discounts: {
        discount_id: number
        amount: number
    }[]
}

function getModifierTotal(
    item: OrderItemType
): number {
    return item.modifiers.reduce(
        (
            sum: number,
            modifier: OrderItemType["modifiers"][number]
        ) =>
            sum +
            Number(modifier.price || 0) *
                Number(modifier.quantity || 1),
        0
    )
}

function getItemGrossTotal(
    item: OrderItemType
): number {
    const unitPrice =
        Number(item.unit_price) || 0

    const modifierTotal =
        getModifierTotal(item)

    const quantity =
        Number(item.quantity) || 0

    return (
        (unitPrice + modifierTotal) *
        quantity
    )
}

function calculateDiscountAmount(
    grossTotal: number,
    type: "percentage" | "fixed",
    value: number
): number {
    if (
        grossTotal <= 0 ||
        value <= 0
    ) {
        return 0
    }

    if (type === "percentage") {
        return Math.min(
            grossTotal,
            (grossTotal * value) / 100
        )
    }

    return Math.min(
        grossTotal,
        value
    )
}

function getItemDiscountTotal(
    item: OrderItemType
): number {
    const grossTotal =
        getItemGrossTotal(item)

    return (
        item.discounts ?? []
    ).reduce(
        (
            sum: number,
            discount: OrderItemType["discounts"][number]
        ) => {
            return (
                sum +
                calculateDiscountAmount(
                    grossTotal,
                    discount.type,
                    Number(
                        discount.value || 0
                    )
                )
            )
        },
        0
    )
}

export function useAdminOrderMutation() {
    const [updating, setUpdating] =
        useState(false)

    async function updateAdminOrder(
        order: Order
    ) {
        if (!order?.id) {
            throw new Error(
                "Order not found."
            )
        }

        setUpdating(true)

        try {
            /*
             * ==================================================
             * 1. Find new items
             * ==================================================
             *
             * New frontend items have id = 0.
             */

            const newItems =
                order.items.filter(
                    item =>
                        !item.id ||
                        Number(item.id) <= 0
                )

            /*
             * ==================================================
             * 2. Create new items first
             * ==================================================
             *
             * Map frontend item index -> database item ID.
             */

            const createdItemIds =
                new Map<
                    number,
                    number
                >()

            if (newItems.length > 0) {
                const addItemsPayload: AddItemPayload[] =
                    newItems.map(
                        (
                            item,
                            index
                        ) => {
                            if (
                                !item.menu_item_id
                            ) {
                                throw new Error(
                                    "Menu item is missing for a new order item."
                                )
                            }

                            const grossTotal =
                                getItemGrossTotal(
                                    item
                                )

                            return {
                                /*
                                 * We use the new item
                                 * array index as the
                                 * temporary reference.
                                 */
                                line_id:
                                    `new-item-${index}-${Date.now()}`,

                                menu_item_id:
                                    Number(
                                        item.menu_item_id
                                    ),

                                quantity:
                                    Number(
                                        item.quantity
                                    ),

                                unit_price:
                                    Number(
                                        item.unit_price
                                    ),

                                total_price:
                                    grossTotal,

                                notes:
                                    item.notes ||
                                    null,

                                modifiers:
                                    item.modifiers.map(
                                        (
                                            modifier: OrderItemType["modifiers"][number]
                                        ) => {
                                            if (
                                                !modifier.id
                                            ) {
                                                throw new Error(
                                                    "Modifier is missing for a new item."
                                                )
                                            }

                                            return {
                                                modifier_id:
                                                    Number(
                                                        modifier.id
                                                    ),

                                                quantity:
                                                    Number(
                                                        modifier.quantity ||
                                                            1
                                                    ),

                                                price:
                                                    Number(
                                                        modifier.price ||
                                                            0
                                                    ),
                                            }
                                        }
                                    ),

                                discounts:
                                    (
                                        item.discounts ??
                                        []
                                    )
                                        .filter(
                                            (
                                                discount: OrderItemType["discounts"][number]
                                            ) =>
                                                Number(
                                                    discount.id
                                                ) > 0
                                        )
                                        .map(
                                            (
                                                discount: OrderItemType["discounts"][number]
                                            ) => ({
                                                discount_id:
                                                    Number(
                                                        discount.id
                                                    ),

                                                amount:
                                                    calculateDiscountAmount(
                                                        grossTotal,
                                                        discount.type,
                                                        Number(
                                                            discount.value ||
                                                                0
                                                        )
                                                    ),
                                            })
                                        ),
                            }
                        }
                    )

                /*
                 * ==================================================
                 * POST new items
                 * ==================================================
                 */

                const addResponse =
                    await addItemsToOrder(
                        Number(order.id),
                        {
                            items:
                                addItemsPayload,
                        }
                    )

                const createdItems: CreatedItem[] =
                    addResponse.data
                        ?.created_items ?? []

                /*
                 * Make sure Laravel returned
                 * every newly created item.
                 */

                if (
                    createdItems.length !==
                    newItems.length
                ) {
                    throw new Error(
                        "The server did not return all newly created order items."
                    )
                }

                /*
                 * Match each new frontend item
                 * with its new database ID.
                 *
                 * addItems() returns created_items
                 * in the same order as request.items.
                 */

                createdItems.forEach(
                    (
                        created: CreatedItem,
                        index: number
                    ) => {
                        if (!created.id) {
                            throw new Error(
                                "Server returned an invalid created item ID."
                            )
                        }

                        createdItemIds.set(
                            index,
                            Number(
                                created.id
                            )
                        )
                    }
                )
            }

            /*
             * ==================================================
             * 3. Calculate subtotal
             * ==================================================
             */

            const subtotal =
                order.items.reduce(
                    (
                        sum: number,
                        item: OrderItemType
                    ) =>
                        sum +
                        getItemGrossTotal(
                            item
                        ),
                    0
                )

            /*
             * ==================================================
             * 4. Calculate item discounts
             * ==================================================
             */

            const itemDiscountAmount =
                order.items.reduce(
                    (
                        sum: number,
                        item: OrderItemType
                    ) =>
                        sum +
                        getItemDiscountTotal(
                            item
                        ),
                    0
                )

            /*
             * ==================================================
             * 5. Amount after item discounts
             * ==================================================
             */

            const afterItemDiscount =
                Math.max(
                    subtotal -
                        itemDiscountAmount,
                    0
                )

            /*
             * ==================================================
             * 6. Order-level discount
             * ==================================================
             */

            const orderDiscount =
                order.discounts?.[0]

            let orderDiscountAmount = 0

            if (
                orderDiscount?.id
            ) {
                orderDiscountAmount =
                    calculateDiscountAmount(
                        afterItemDiscount,
                        orderDiscount.type,
                        Number(
                            orderDiscount.value ||
                                0
                        )
                    )
            }

            /*
             * ==================================================
             * 7. Total discount
             * ==================================================
             */

            const discountAmount =
                itemDiscountAmount +
                orderDiscountAmount

            /*
             * ==================================================
             * 8. Tax / service charge
             * ==================================================
             */

            const taxAmount =
                Number(
                    order.tax_amount || 0
                )

            const serviceCharge =
                Number(
                    order.service_charge || 0
                )

            /*
             * ==================================================
             * 9. Final total
             * ==================================================
             */

            const total =
                Math.max(
                    subtotal -
                        discountAmount +
                        taxAmount +
                        serviceCharge,
                    0
                )

            /*
             * ==================================================
             * 10. Build final item payload
             * ==================================================
             *
             * IMPORTANT:
             *
             * We loop through order.items so the
             * original item order is preserved.
             *
             * Existing:
             *     id = existing database ID
             *
             * New:
             *     id = ID returned from addItems()
             */

            let newItemIndex = 0

            const items =
                order.items.map(
                    (
                        item: OrderItemType
                    ) => {
                        let itemId =
                            Number(
                                item.id
                            ) || 0

                        /*
                         * New item
                         */
                        if (
                            itemId <= 0
                        ) {
                            const createdId =
                                createdItemIds.get(
                                    newItemIndex
                                )

                            if (
                                !createdId
                            ) {
                                throw new Error(
                                    "Could not find database ID for newly created order item."
                                )
                            }

                            itemId =
                                createdId

                            newItemIndex++
                        }

                        if (
                            !item.menu_item_id
                        ) {
                            throw new Error(
                                `Menu item is missing for order item #${itemId}.`
                            )
                        }

                        const grossTotal =
                            getItemGrossTotal(
                                item
                            )

                        return {
                            id: itemId,

                            menu_item_id:
                                Number(
                                    item.menu_item_id
                                ),

                            quantity:
                                Number(
                                    item.quantity
                                ),

                            unit_price:
                                Number(
                                    item.unit_price
                                ),

                            total_price:
                                grossTotal,

                            notes:
                                item.notes ||
                                null,

                            modifiers:
                                item.modifiers.map(
                                    (
                                        modifier: OrderItemType["modifiers"][number]
                                    ) => {
                                        if (
                                            !modifier.id
                                        ) {
                                            throw new Error(
                                                `Modifier is missing for order item #${itemId}.`
                                            )
                                        }

                                        return {
                                            modifier_id:
                                                Number(
                                                    modifier.id
                                                ),

                                            quantity:
                                                Number(
                                                    modifier.quantity ||
                                                        1
                                                ),

                                            price:
                                                Number(
                                                    modifier.price ||
                                                        0
                                                ),
                                        }
                                    }
                                ),

                            discounts:
                                (
                                    item.discounts ??
                                    []
                                )
                                    .filter(
                                        (
                                            discount: OrderItemType["discounts"][number]
                                        ) =>
                                            Number(
                                                discount.id
                                            ) > 0
                                    )
                                    .map(
                                        (
                                            discount: OrderItemType["discounts"][number]
                                        ) => ({
                                            discount_id:
                                                Number(
                                                    discount.id
                                                ),

                                            amount:
                                                calculateDiscountAmount(
                                                    grossTotal,
                                                    discount.type,
                                                    Number(
                                                        discount.value ||
                                                            0
                                                    )
                                                ),
                                        })
                                    ),
                        }
                    }
                )

            /*
             * ==================================================
             * 11. Complete order payload
             * ==================================================
             */

            const payload:
                UpdateOrderPayload = {
                order_no:
                    order.order_no,

                order_type_id:
                    order.order_type_id,

                order_source_id:
                    order.order_source_id ??
                    null,

                customer_id:
                    order.customer_id ??
                    null,

                restaurant_table_id:
                    order.restaurant_table_id ??
                    null,

                location_id:
                    order.location_id ??
                    null,

                number_plate:
                    order.number_plate ||
                    null,

                dining_session_id:
                    order.dining_session_id ??
                    null,

                status:
                    order.status,

                payment_status:
                    order.payment_status,

                kitchen_status:
                    order.kitchen_status,

                notes:
                    order.notes ||
                    null,

                items,

                discounts:
                    orderDiscount?.id
                        ? [
                              {
                                  discount_id:
                                      Number(
                                          orderDiscount.id
                                      ),

                                  amount:
                                      orderDiscountAmount,
                              },
                          ]
                        : [],

                subtotal,

                discount_amount:
                    discountAmount,

                tax_amount:
                    taxAmount,

                service_charge:
                    serviceCharge,

                total_amount:
                    total,
            }

            /*
             * ==================================================
             * 12. Update complete order
             * ==================================================
             */

            const response =
                await updateOrder(
                    Number(order.id),
                    payload
                )

            return (
                response.data?.data ??
                response.data
            )
        } finally {
            setUpdating(false)
        }
    }

    return {
        updateAdminOrder,
        updating,
    }
}
