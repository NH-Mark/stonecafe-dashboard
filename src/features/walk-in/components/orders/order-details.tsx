"use client"

import {
    Clock,
    MapPin,
    User,
    ChefHat,
    FileText,
} from "lucide-react"

import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@base-ui/react"
import { toast } from "sonner"

import OrderSummary from "./order-summary"
import OrderPayments from "./order-payment"

import { Order } from "@/features/orders/orders.types"
import { getOrder } from "../../orders.service"

interface OrderDetailsProps {
    order: Order | null
}

/*
|--------------------------------------------------------------------------
| Date Formatter
|--------------------------------------------------------------------------
*/

function formatDate(value: string | null) {
    if (!value) {
        return "-"
    }

    const normalizedValue = value.includes(" ")
        ? value.replace(" ", "T")
        : value

    const date = new Date(normalizedValue)

    if (Number.isNaN(date.getTime())) {
        return "-"
    }

    return date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
    })
}

/*
|--------------------------------------------------------------------------
| Item Calculations
|--------------------------------------------------------------------------
*/

function getItemDiscountTotal(
    item: Order["items"][number]
) {
    return (
        item.discounts?.reduce(
            (sum, discount) =>
                sum + Number(discount.amount || 0),
            0
        ) || 0
    )
}

function getModifierTotal(
    item: Order["items"][number]
) {
    return (
        item.modifiers?.reduce(
            (sum, modifier) =>
                sum +
                Number(modifier.price || 0) *
                    Number(modifier.quantity || 1),
            0
        ) || 0
    )
}

function getOriginalItemTotal(
    item: Order["items"][number]
) {
    const unitPrice = Number(
        item.unit_price || 0
    )

    const modifierTotal =
        getModifierTotal(item)

    return (
        (unitPrice + modifierTotal) *
        Number(item.quantity || 0)
    )
}

function getFinalItemTotal(
    item: Order["items"][number]
) {
    const originalTotal =
        getOriginalItemTotal(item)

    const discountTotal =
        getItemDiscountTotal(item)

    return Math.max(
        0,
        originalTotal - discountTotal
    )
}

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function OrderDetails({
    order,
}: OrderDetailsProps) {

    /*
    |--------------------------------------------------------------------------
    | Local Order State
    |--------------------------------------------------------------------------
    */

    const [currentOrder, setCurrentOrder] =
        useState<Order | null>(order)

    /*
    |--------------------------------------------------------------------------
    | Sync Parent Order
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setCurrentOrder(order)
    }, [order])

    /*
    |--------------------------------------------------------------------------
    | Refresh Order
    |--------------------------------------------------------------------------
    */

    async function refreshOrder() {
        if (!currentOrder?.id) {
            return
        }

        try {
            const refreshedOrder =
                await getOrder(currentOrder.id)

            setCurrentOrder(refreshedOrder)

            toast.success("Payment updated")
        } catch (error) {
            console.error(
                "Failed to refresh order:",
                error
            )

            toast.error(
                "Payment succeeded, but failed to refresh order."
            )
        }
    }

    /*
    |--------------------------------------------------------------------------
    | No Order Selected
    |--------------------------------------------------------------------------
    */

    if (!currentOrder) {
        return (
            <div
                className="
                    flex
                    h-full
                    items-center
                    justify-center
                "
            >
                <div
                    className="
                        max-w-sm
                        text-center
                        text-muted-foreground
                    "
                >
                    <div
                        className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-[#f5f1ed]
                        "
                    >
                        <FileText
                            className="
                                h-6
                                w-6
                                text-[#6b5849]
                            "
                        />
                    </div>

                    <p
                        className="
                            mt-4
                            font-semibold
                            text-[#40332a]
                        "
                    >
                        Select an order
                    </p>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-[#81786f]
                        "
                    >
                        Select an order from the list
                        to view its details.
                    </p>
                </div>
            </div>
        )
    }

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="w-full">

            <div className="space-y-6 pb-8">

                <div
                    className="
                        space-y-6
                        py-6
                        pr-2
                    "
                >

                    {/* ================================================= */}
                    {/* ORDER HEADER */}
                    {/* ================================================= */}

                    <div
                        className="
                            border-b
                            pb-5
                        "
                        style={{
                            borderColor: "#e1ddd8",
                        }}
                    >

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-6
                            "
                        >

                            <div className="min-w-0">

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                    "
                                >

                                    <h1
                                        className="
                                            text-xl
                                            font-semibold
                                            tracking-tight
                                            text-[#40332a]
                                        "
                                    >
                                        #{currentOrder.order_no}
                                    </h1>

                                    <Badge>
                                        {currentOrder.status}
                                    </Badge>

                                    <Badge variant="secondary">
                                        {currentOrder.payment_status}
                                    </Badge>

                                </div>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-muted-foreground
                                    "
                                >
                                    {currentOrder.type || "Order"}

                                    {currentOrder.source && (
                                        <>
                                            {" • "}
                                            {currentOrder.source}
                                        </>
                                    )}
                                </p>

                            </div>

                        </div>

                        {/* ================================================= */}
                        {/* META INFORMATION */}
                        {/* ================================================= */}

                        <div
                            className="
                                mt-6
                                grid
                                gap-5
                                sm:grid-cols-2
                                xl:grid-cols-4
                            "
                        >

                            <OrderMeta
                                icon={<User />}
                                label="Customer"
                                value={
                                    currentOrder.customer ||
                                    "Walk-in"
                                }
                            />

                            <OrderMeta
                                icon={<FileText />}
                                label="Type"
                                value={
                                    currentOrder.type || "-"
                                }
                            />

                            <OrderMeta
                                icon={<FileText />}
                                label="Source"
                                value={
                                    currentOrder.source || "-"
                                }
                            />

                            <OrderMeta
                                icon={<User />}
                                label="Cashier"
                                value={
                                    currentOrder.cashier || "-"
                                }
                            />

                            <OrderMeta
                                icon={<MapPin />}
                                label="Location"
                                value={
                                    currentOrder.location || "-"
                                }
                            />

                            <OrderMeta
                                icon={<MapPin />}
                                label="Table"
                                value={
                                    currentOrder.table || "-"
                                }
                            />

                            <OrderMeta
                                icon={<Clock />}
                                label="Ordered"
                                value={formatDate(
                                    currentOrder.ordered_at
                                )}
                            />

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* ITEMS */}
                    {/* ================================================= */}

                    <section>

                        <SectionTitle>
                            Order Items
                        </SectionTitle>

                        <div
                            className="
                                mt-3
                                overflow-hidden
                                rounded-xl
                                border
                                bg-white
                            "
                            style={{
                                borderColor:
                                    "#e1ddd8",
                            }}
                        >

                            {/* Items Header */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    border-b
                                    bg-[#faf9f7]
                                    px-4
                                    py-3
                                "
                                style={{
                                    borderColor:
                                        "#eeeae6",
                                }}
                            >

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-[#40332a]
                                        "
                                    >
                                        Order Items
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-muted-foreground
                                        "
                                    >
                                        {currentOrder.items.length}{" "}
                                        {currentOrder.items.length === 1
                                            ? "item"
                                            : "items"}
                                    </p>

                                </div>

                            </div>

                            {/* Items */}

                            {currentOrder.items.length > 0 ? (

                                currentOrder.items.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const originalTotal =
                                            getOriginalItemTotal(
                                                item
                                            )

                                        const discountTotal =
                                            getItemDiscountTotal(
                                                item
                                            )

                                        const finalTotal =
                                            getFinalItemTotal(
                                                item
                                            )

                                        const hasDiscount =
                                            discountTotal > 0

                                        return (
                                            <div
                                                key={item.id}
                                                className={`
                                                    p-4
                                                    ${
                                                        index !==
                                                        currentOrder.items.length - 1
                                                            ? "border-b"
                                                            : ""
                                                    }
                                                `}
                                                style={{
                                                    borderColor:
                                                        "#eeeae6",
                                                }}
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        justify-between
                                                        gap-4
                                                    "
                                                >

                                                    {/* Item Information */}

                                                    <div className="min-w-0">

                                                        <p
                                                            className="
                                                                font-medium
                                                                leading-5
                                                                text-[#40332a]
                                                            "
                                                        >
                                                            {item.menu_item}
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-xs
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            {item.quantity}
                                                            {" × "}
                                                            QAR{" "}
                                                            {Number(
                                                                item.unit_price ||
                                                                    0
                                                            ).toFixed(2)}
                                                        </p>

                                                        {/* Notes */}

                                                        {item.notes && (
                                                            <p
                                                                className="
                                                                    mt-2
                                                                    text-xs
                                                                    leading-4
                                                                    text-muted-foreground
                                                                "
                                                            >
                                                                Note:{" "}
                                                                {item.notes}
                                                            </p>
                                                        )}

                                                        {/* Modifiers */}

                                                        {item.modifiers &&
                                                            item.modifiers
                                                                .length > 0 && (

                                                                <div
                                                                    className="
                                                                        mt-3
                                                                        flex
                                                                        flex-wrap
                                                                        gap-2
                                                                    "
                                                                >

                                                                    {item.modifiers.map(
                                                                        (
                                                                            modifier,
                                                                            modifierIndex
                                                                        ) => (

                                                                            <Badge
                                                                                key={`${modifier.modifier}-${modifierIndex}`}
                                                                                variant="secondary"
                                                                                className="
                                                                                    h-6
                                                                                    px-2
                                                                                    text-xs
                                                                                    font-normal
                                                                                "
                                                                            >

                                                                                {
                                                                                    modifier.modifier
                                                                                }

                                                                                {modifier.quantity >
                                                                                    1 && (
                                                                                    <span className="ml-1">
                                                                                        ×{" "}
                                                                                        {
                                                                                            modifier.quantity
                                                                                        }
                                                                                    </span>
                                                                                )}

                                                                                {Number(
                                                                                    modifier.price ||
                                                                                        0
                                                                                ) > 0 && (
                                                                                    <span
                                                                                        className="
                                                                                            ml-1
                                                                                            text-muted-foreground
                                                                                        "
                                                                                    >
                                                                                        + QAR{" "}
                                                                                        {Number(
                                                                                            modifier.price
                                                                                        ).toFixed(
                                                                                            2
                                                                                        )}
                                                                                    </span>
                                                                                )}

                                                                            </Badge>

                                                                        )
                                                                    )}

                                                                </div>

                                                            )}

                                                        {/* Discounts */}

                                                        {hasDiscount &&
                                                            item.discounts &&
                                                            item.discounts
                                                                .length > 0 && (

                                                                <div
                                                                    className="
                                                                        mt-3
                                                                        space-y-1
                                                                        text-xs
                                                                        text-green-600
                                                                    "
                                                                >

                                                                    {item.discounts.map(
                                                                        (
                                                                            discount
                                                                        ) => (

                                                                            <div
                                                                                key={
                                                                                    discount.id
                                                                                }
                                                                                className="
                                                                                    flex
                                                                                    items-center
                                                                                    justify-between
                                                                                    gap-4
                                                                                "
                                                                            >

                                                                                <span>
                                                                                    {
                                                                                        discount.name
                                                                                    }
                                                                                </span>

                                                                                <span className="font-medium">
                                                                                    − QAR{" "}
                                                                                    {Number(
                                                                                        discount.amount ||
                                                                                            0
                                                                                    ).toFixed(
                                                                                        2
                                                                                    )}
                                                                                </span>

                                                                            </div>

                                                                        )
                                                                    )}

                                                                </div>

                                                            )}

                                                    </div>

                                                    {/* Item Total */}

                                                    <div
                                                        className="
                                                            shrink-0
                                                            text-right
                                                        "
                                                    >

                                                        {hasDiscount && (
                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-muted-foreground
                                                                    line-through
                                                                "
                                                            >
                                                                QAR{" "}
                                                                {originalTotal.toFixed(
                                                                    2
                                                                )}
                                                            </p>
                                                        )}

                                                        <p
                                                            className={`
                                                                font-semibold
                                                                ${
                                                                    hasDiscount
                                                                        ? "text-green-700"
                                                                        : "text-[#40332a]"
                                                                }
                                                            `}
                                                        >
                                                            QAR{" "}
                                                            {finalTotal.toFixed(
                                                                2
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>
                                        )
                                    }
                                )

                            ) : (

                                <div
                                    className="
                                        px-4
                                        py-8
                                        text-center
                                        text-sm
                                        text-muted-foreground
                                    "
                                >
                                    No items recorded.
                                </div>

                            )}

                        </div>

                    </section>

                    <Separator />

                    {/* ================================================= */}
                    {/* SUMMARY */}
                    {/* ================================================= */}

                    <section>

                        <SectionTitle>
                            Order Summary
                        </SectionTitle>

                        <div className="mt-3">

                            <OrderSummary
                                order={currentOrder}
                            />

                        </div>

                    </section>

                    <Separator />

                    {/* ================================================= */}
                    {/* PAYMENTS */}
                    {/* ================================================= */}

                    <section>

                        <div className="mt-3">

                            <OrderPayments
                                order={currentOrder}
                                onPaymentSuccess={refreshOrder}
                            />

                        </div>

                    </section>

                    {/* ================================================= */}
                    {/* NOTES */}
                    {/* ================================================= */}

                    {currentOrder.notes && (
                        <>
                            <Separator />

                            <section>

                                <SectionTitle
                                    icon={<FileText />}
                                >
                                    Order Notes
                                </SectionTitle>

                                <div
                                    className="
                                        mt-3
                                        rounded-xl
                                        border
                                        bg-amber-50
                                        p-4
                                        text-sm
                                        text-amber-800
                                    "
                                    style={{
                                        borderColor:
                                            "#f3d9a6",
                                    }}
                                >
                                    {currentOrder.notes}
                                </div>

                            </section>
                        </>
                    )}

                    <Separator />

                    {/* ================================================= */}
                    {/* KITCHEN / LOCATION */}
                    {/* ================================================= */}

                    <div
                        className="
                            grid
                            gap-4
                            sm:grid-cols-2
                        "
                    >

                        <InfoCard
                            icon={<ChefHat />}
                            title="Kitchen"
                            value={
                                currentOrder.kitchen_status ||
                                "-"
                            }
                        />

                        <InfoCard
                            icon={<MapPin />}
                            title="Location"
                            value={
                                currentOrder.location ||
                                "-"
                            }
                        />

                    </div>

                </div>

            </div>

        </div>
    )
}

/*
|--------------------------------------------------------------------------
| Order Meta
|--------------------------------------------------------------------------
*/

function OrderMeta({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode
    label: string
    value: string
}) {
    return (
        <div className="min-w-0">

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <span
                    className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#f5f1ed]
                        text-[#6b5849]
                        [&_svg]:h-4
                        [&_svg]:w-4
                    "
                >
                    {icon}
                </span>

                <div className="min-w-0">

                    <p
                        className="
                            text-[11px]
                            text-[#8a8179]
                        "
                    >
                        {label}
                    </p>

                    <p
                        className="
                            truncate
                            text-sm
                            font-medium
                            text-[#40332a]
                        "
                    >
                        {value}
                    </p>

                </div>

            </div>

        </div>
    )
}

/*
|--------------------------------------------------------------------------
| Section Title
|--------------------------------------------------------------------------
*/

function SectionTitle({
    children,
    icon,
}: {
    children: React.ReactNode
    icon?: React.ReactNode
}) {
    return (
        <h3
            className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-[#40332a]
            "
        >

            {icon && (
                <span
                    className="
                        text-[#6b5849]
                        [&_svg]:h-4
                        [&_svg]:w-4
                    "
                >
                    {icon}
                </span>
            )}

            {children}

        </h3>
    )
}

/*
|--------------------------------------------------------------------------
| Info Card
|--------------------------------------------------------------------------
*/

function InfoCard({
    icon,
    title,
    value,
}: {
    icon: React.ReactNode
    title: string
    value: string
}) {
    return (
        <div
            className="
                rounded-xl
                border
                bg-white
                p-4
            "
            style={{
                borderColor: "#e1ddd8",
            }}
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <span
                    className="
                        text-[#6b5849]
                        [&_svg]:h-4
                        [&_svg]:w-4
                    "
                >
                    {icon}
                </span>

                <span
                    className="
                        text-sm
                        font-medium
                        text-[#40332a]
                    "
                >
                    {title}
                </span>

            </div>
            <p
                className="
                    mt-2
                    text-sm
                    capitalize
                    text-[#81786f]
                "
            >
                {value}
            </p>

        </div>
    )
}