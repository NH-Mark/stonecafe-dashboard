import { Order } from "@/features/orders/orders.types"
import { Separator } from "@base-ui/react"

interface OrderSummaryProps {
    order: Order
}

/*
|--------------------------------------------------------------------------
| Money
|--------------------------------------------------------------------------
*/

function money(value: number | string | null | undefined) {
    return `QAR ${Number(value || 0).toFixed(2)}`
}

/*
|--------------------------------------------------------------------------
| Discount Calculations
|--------------------------------------------------------------------------
*/

function getItemDiscountTotal(
    order: Order
) {
    return (
        order.items?.reduce(
            (total, item) => {
                const itemDiscount =
                    item.discounts?.reduce(
                        (sum, discount) =>
                            sum +
                            Number(
                                discount.amount || 0
                            ),
                        0
                    ) || 0

                return total + itemDiscount
            },
            0
        ) || 0
    )
}

function getOrderDiscountTotal(
    order: Order
) {
    return (
        order.discounts?.reduce(
            (sum, discount) =>
                sum +
                Number(discount.amount || 0),
            0
        ) || 0
    )
}

function getTotalDiscount(
    order: Order
) {
    /*
     * Prefer the actual discounts attached
     * to items/order.
     *
     * This keeps the summary consistent
     * with ViewOrderDialog.
     */
    const itemDiscount =
        getItemDiscountTotal(order)

    const orderDiscount =
        getOrderDiscountTotal(order)

    const calculatedDiscount =
        itemDiscount + orderDiscount

    /*
     * Fallback to discount_amount if the
     * API doesn't include discount relations.
     */
    if (calculatedDiscount > 0) {
        return calculatedDiscount
    }

    return Number(
        order.discount_amount || 0
    )
}

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function OrderSummary({
    order,
}: OrderSummaryProps) {

    const subtotal =
        Number(order.subtotal || 0)

    const discount =
        getTotalDiscount(order)

    const serviceCharge =
        Number(
            order.service_charge || 0
        )

    const tax =
        Number(
            order.tax_amount || 0
        )

    const total =
        Number(order.total || 0)

    /*
     * Original amount before discount.
     *
     * Service charge and tax are included
     * because they are part of the final
     * order calculation.
     */
    const originalTotal =
        total + discount

    const hasDiscount =
        discount > 0

    return (
        <div className="space-y-3">

            {/* ===================================================== */}
            {/* SUBTOTAL */}
            {/* ===================================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    text-sm
                "
            >
                <span className="text-muted-foreground">
                    Subtotal
                </span>

                <span className="font-medium">
                    {money(subtotal)}
                </span>
            </div>

            {/* ===================================================== */}
            {/* DISCOUNT */}
            {/* ===================================================== */}

            {hasDiscount && (
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        text-sm
                    "
                >
                    <span className="text-muted-foreground">
                        Discount
                    </span>

                    <span className="font-medium text-green-600">
                        − {money(discount)}
                    </span>
                </div>
            )}

            {/* ===================================================== */}
            {/* SERVICE CHARGE */}
            {/* ===================================================== */}

            {serviceCharge > 0 && (
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        text-sm
                    "
                >
                    <span className="text-muted-foreground">
                        Service Charge
                    </span>

                    <span className="font-medium">
                        {money(serviceCharge)}
                    </span>
                </div>
            )}

            {/* ===================================================== */}
            {/* TAX */}
            {/* ===================================================== */}

            {tax > 0 && (
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        text-sm
                    "
                >
                    <span className="text-muted-foreground">
                        Tax
                    </span>

                    <span className="font-medium">
                        {money(tax)}
                    </span>
                </div>
            )}

            <Separator />

            {/* ===================================================== */}
            {/* TOTAL */}
            {/* ===================================================== */}

            <div
                className="
                    flex
                    items-end
                    justify-between
                    gap-4
                "
            >
                <span
                    className="
                        text-sm
                        font-semibold
                        text-[#40332a]
                    "
                >
                    Total
                </span>

                <div className="text-right">

                    {hasDiscount && (
                        <p
                            className="
                                text-sm
                                text-muted-foreground
                                line-through
                            "
                        >
                            {money(originalTotal)}
                        </p>
                    )}

                    <p
                        className="
                            text-xl
                            font-bold
                            tracking-tight
                            text-[#40332a]
                        "
                    >
                        {money(total)}
                    </p>

                </div>
            </div>

        </div>
    )
}