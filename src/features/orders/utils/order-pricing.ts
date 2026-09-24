import { Order, OrderItem } from "../orders.types"

export function getModifierTotal(
    item: OrderItem
): number {
    return item.modifiers.reduce(
        (sum, modifier) =>
            sum +
            Number(modifier.price || 0) *
                Number(modifier.quantity || 1),
        0
    )
}

export function getItemGrossTotal(
    item: OrderItem
): number {
    return (
        (
            Number(item.unit_price || 0) +
            getModifierTotal(item)
        ) *
        Number(item.quantity || 0)
    )
}

export function calculateDiscountAmount(
    grossTotal: number,
    type: "percentage" | "fixed",
    value: number
): number {
    if (grossTotal <= 0 || value <= 0) {
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

export function getItemDiscountTotal(
    item: OrderItem
): number {
    const grossTotal =
        getItemGrossTotal(item)

    return (item.discounts ?? []).reduce(
        (sum, discount) =>
            sum +
            calculateDiscountAmount(
                grossTotal,
                discount.type,
                Number(discount.value || 0)
            ),
        0
    )
}

export function getItemNetTotal(
    item: OrderItem
): number {
    return Math.max(
        getItemGrossTotal(item) -
            getItemDiscountTotal(item),
        0
    )
}

export function getOrderSubtotal(
    order: Order
): number {
    return order.items.reduce(
        (sum, item) =>
            sum + getItemGrossTotal(item),
        0
    )
}

export function getItemDiscountsTotal(
    order: Order
): number {
    return order.items.reduce(
        (sum, item) =>
            sum + getItemDiscountTotal(item),
        0
    )
}

export function getOrderNetBeforeDiscount(
    order: Order
): number {
    return Math.max(
        getOrderSubtotal(order) -
            getItemDiscountsTotal(order),
        0
    )
}

export function getOrderDiscountAmount(
    order: Order
): number {
    const discount =
        order.discounts?.[0]

    if (!discount?.id) {
        return 0
    }

    return calculateDiscountAmount(
        getOrderNetBeforeDiscount(order),
        discount.type,
        Number(discount.value || 0)
    )
}

export function getTotalDiscount(
    order: Order
): number {
    return (
        getItemDiscountsTotal(order) +
        getOrderDiscountAmount(order)
    )
}

export function getOrderTotal(
    order: Order
): number {
    const subtotal =
        getOrderSubtotal(order)

    const totalDiscount =
        getTotalDiscount(order)

    const tax =
        Number(order.tax_amount || 0)

    const serviceCharge =
        Number(order.service_charge || 0)

    return Math.max(
        subtotal -
            totalDiscount +
            tax +
            serviceCharge,
        0
    )
}