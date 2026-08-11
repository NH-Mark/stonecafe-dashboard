
import { CartItem } from "../cart.types";

/*
|--------------------------------------------------------------------------
| Base item price
|--------------------------------------------------------------------------
|
| Menu item price + modifiers.
|
*/
export function getItemPrice(item: CartItem): number {
    const modifierTotal = item.modifiers.reduce(
        (sum, mod) => sum + Number(mod.price),
        0
    );

    return Number(item.menuItem.price) + modifierTotal;
}


/*
|--------------------------------------------------------------------------
| Gross line total
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| This is BEFORE discounts.
|
*/
export function getGrossLineTotal(item: CartItem): number {
    return getItemPrice(item) * item.quantity;
}


/*
|--------------------------------------------------------------------------
| Item discount
|--------------------------------------------------------------------------
|
*/
export function getDiscountAmount(item: CartItem): number {
    if (!item.discount) {
        return 0;
    }

    const gross = getGrossLineTotal(item);
    const value = Number(item.discount.value);

    if (item.discount.type === "percentage") {
        return gross * value / 100;
    }

    return Math.min(value, gross);
}


/*
|--------------------------------------------------------------------------
| Final line total
|--------------------------------------------------------------------------
|
| Gross - item discount.
|
*/
export function getLineTotal(item: CartItem): number {
    const gross = getGrossLineTotal(item);
    const discount = getDiscountAmount(item);

    return Math.max(gross - discount, 0);
}
