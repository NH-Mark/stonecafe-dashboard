import { CartItem } from "../cart.types";

/**
 * Base menu-item price only.
 *
 * Does NOT include modifiers.
 */
export function getItemPrice(item: CartItem): number {
    return Number(item.menuItem.price);
}

/**
 * Total price of all modifiers for one item.
 *
 * Does NOT include the menu-item base price.
 */
export function getModifierTotal(item: CartItem): number {
    return item.modifiers.reduce(
        (sum, modifier) =>
            sum + Number(modifier.price),
        0
    );
}

/**
 * Gross price for one configured item,
 * including modifiers, before discount.
 */
export function getConfiguredItemPrice(
    item: CartItem
): number {
    return (
        getItemPrice(item) +
        getModifierTotal(item)
    );
}

/**
 * Gross line total before discounts.
 */
export function getGrossLineTotal(
    item: CartItem
): number {
    return (
        getConfiguredItemPrice(item) *
        item.quantity
    );
}

/**
 * Item-level discount.
 */
export function getDiscountAmount(
    item: CartItem
): number {
    if (!item.discount) {
        return 0;
    }

    const gross = getGrossLineTotal(item);
    const value = Number(item.discount.value);

    if (item.discount.type === "percentage") {
        return (gross * value) / 100;
    }

    return Math.min(value, gross);
}

/**
 * Final line total after item discount.
 */
export function getLineTotal(
    item: CartItem
): number {
    const gross = getGrossLineTotal(item);
    const discount = getDiscountAmount(item);

    return Math.max(gross - discount, 0);
}