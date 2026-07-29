import { CartItem } from "../cart.types";



export function getItemPrice(
    item: CartItem
) {

    const modifierTotal =
        item.modifiers.reduce(
            (sum, mod) =>
                sum + Number(mod.price),
            0
        );


    return (
        Number(item.menuItem.price)
        +
        modifierTotal
    );

}





export function getGrossLineTotal(
    item: CartItem
) {

    return (
        getItemPrice(item)
        *
        item.quantity
    );

}





export function getDiscountAmount(
    item: CartItem
) {

    if (!item.discount) {

        return 0;

    }



    const lineTotal =
        getGrossLineTotal(item);



    const value =
        Number(
            item.discount.value
        );



    if (
        item.discount.type === "percentage"
    ) {

        return (
            lineTotal *
            value /
            100
        );

    }



    return Math.min(
        value,
        lineTotal
    );

}





export function getLineTotal(
    item: CartItem
) {

    const gross =
        getGrossLineTotal(item);


    const discount =
        getDiscountAmount(item);



    return Math.max(
        gross - discount,
        0
    );

}