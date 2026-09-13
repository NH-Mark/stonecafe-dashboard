"use client"

import {
    MapPin,
    ChefHat,
    FileText,
    XCircle,
    CheckCircle2,
    Printer,
    Table2,
} from "lucide-react"

import {
    useEffect,
    useState,
} from "react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@base-ui/react"
import { toast } from "sonner"

import OrderSummary from "./order-summary"
import OrderPayments from "./order-payment"

import { Order } from "@/features/orders/orders.types"

import {
    getOrder,
    printOrder,
    updateOrderStatus,
} from "../../orders.service"
import { AssignTableDialog } from "./AssignTableDialog"


interface OrderDetailsProps {
    order: Order | null
    onOrderUpdated?: (order: Order) => void
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
    onOrderUpdated,
}: OrderDetailsProps) {

    /*
    |--------------------------------------------------------------------------
    | Local State
    |--------------------------------------------------------------------------
    */

    const [updatingStatus, setUpdatingStatus] =
        useState(false)

    const [printing, setPrinting] =
        useState(false)

    const [currentOrder, setCurrentOrder] =
        useState<Order | null>(order)

    const [assignTableDialogOpen, setAssignTableDialogOpen] =
        useState(false)

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
    | Table Assignment Condition
    |--------------------------------------------------------------------------
    |
    | Show Assign Table only when:
    |
    | order_type_code = dine_in
    | source          = QR Order
    | status          = confirmed
    | table           = null
    |
    */

    const canAssignTable =
        currentOrder?.order_type_code?.toLowerCase() ===
            "dine_in" &&
        currentOrder?.source?.toLowerCase() ===
            "qr order" &&
        currentOrder?.status?.toLowerCase() ===
            "confirmed" &&
        !currentOrder?.restaurant_table

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
                await getOrder(
                    currentOrder.id
                )

            setCurrentOrder(
                refreshedOrder
            )

            onOrderUpdated?.(
                refreshedOrder
            )

        } catch (error) {

            console.error(
                "Failed to refresh order:",
                error
            )

            toast.error(
                "Failed to refresh order."
            )
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Print Order
    |--------------------------------------------------------------------------
    */

    async function handlePrint() {

        if (
            !currentOrder?.id ||
            printing
        ) {
            return
        }

        try {

            setPrinting(true)

            await printOrder(
                currentOrder.id
            )

            toast.success(
                "Order sent to printer."
            )

        } catch (error) {

            console.error(
                "Failed to print order:",
                error
            )

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to print order."
            )

        } finally {

            setPrinting(false)

        }
    }

    /*
    |--------------------------------------------------------------------------
    | Status Change
    |--------------------------------------------------------------------------
    */

    async function handleStatusChange(
        status:
            | "confirmed"
            | "cancelled"
    ) {

        if (
            !currentOrder?.id ||
            updatingStatus
        ) {
            return
        }

        try {

            setUpdatingStatus(true)

            await updateOrderStatus(
                currentOrder.id,
                status
            )

            const refreshedOrder =
                await getOrder(
                    currentOrder.id
                )

            setCurrentOrder(
                refreshedOrder
            )

            onOrderUpdated?.(
                refreshedOrder
            )

            toast.success(
                status === "confirmed"
                    ? "Order confirmed"
                    : "Order cancelled"
            )

        } catch (error) {

            console.error(
                "Failed to update order status:",
                error
            )

            toast.error(
                "Failed to update order status."
            )

        } finally {

            setUpdatingStatus(false)

        }
    }

    /*
    |--------------------------------------------------------------------------
    | Table Assigned
    |--------------------------------------------------------------------------
    |
    | Called after AssignTableDialog successfully assigns
    | a table to the order.
    |
    */

    async function handleTableAssigned() {

        setAssignTableDialogOpen(false)

        if (!currentOrder?.id) {
            return
        }

        try {

            const refreshedOrder =
                await getOrder(
                    currentOrder.id
                )

            setCurrentOrder(
                refreshedOrder
            )

            onOrderUpdated?.(
                refreshedOrder
            )

        } catch (error) {

            console.error(
                "Failed to refresh order after table assignment:",
                error
            )

            toast.error(
                "Table assigned, but failed to refresh the order."
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

            <div
                className="
                    space-y-6
                    pb-8
                "
            >

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
                            flex
                            items-start
                            justify-between
                            gap-6
                        "
                    >

                        {/* LEFT — ORDER INFO */}

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

                                <Badge
                                    variant="secondary"
                                >
                                    {
                                        currentOrder.payment_status
                                    }
                                </Badge>

                            </div>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-muted-foreground
                                "
                            >

                                {
                                    currentOrder.type ||
                                    "Order"
                                }

                                {currentOrder.source && (
                                    <>
                                        {" • "}
                                        {
                                            currentOrder.source
                                        }
                                    </>
                                )}

                            </p>

                        </div>

                        {/* RIGHT — ORDER ACTIONS */}

                        <div
                            className="
                                flex
                                shrink-0
                                flex-wrap
                                items-center
                                justify-end
                                gap-2
                            "
                        >

                            {/* ================================================= */}
                            {/* ASSIGN TABLE */}
                            {/* ================================================= */}

                            {canAssignTable && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setAssignTableDialogOpen(
                                            true
                                        )
                                    }
                                    className="
                                        inline-flex
                                        h-9
                                        items-center
                                        gap-1.5
                                        rounded-lg
                                        border
                                        border-[#d8c9bc]
                                        bg-white
                                        px-3
                                        text-sm
                                        font-medium
                                        text-[#6b5849]
                                        shadow-sm
                                        transition-colors
                                        hover:bg-[#faf7f4]
                                    "
                                >

                                    <Table2
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />

                                    Assign Table

                                </button>

                            )}

                            {/* ================================================= */}
                            {/* PRINT */}
                            {/* ================================================= */}

                            {currentOrder.status
                                ?.toLowerCase() ===
                                "completed" &&
                                currentOrder.payment_status
                                    ?.toLowerCase() ===
                                "paid" && (

                                    <button
                                        type="button"
                                        disabled={
                                            printing
                                        }
                                        onClick={
                                            handlePrint
                                        }
                                        className="
                                            inline-flex
                                            h-9
                                            items-center
                                            gap-1.5
                                            rounded-lg
                                            border
                                            border-[#e1ddd8]
                                            bg-white
                                            px-3
                                            text-sm
                                            font-medium
                                            text-[#40332a]
                                            shadow-sm
                                            transition-colors
                                            hover:bg-[#faf9f7]
                                            disabled:pointer-events-none
                                            disabled:opacity-50
                                        "
                                    >

                                        <Printer
                                            className="
                                                h-4
                                                w-4
                                            "
                                        />

                                        {printing
                                            ? "Printing..."
                                            : "Print Order"}

                                    </button>

                                )}

                            {/* ================================================= */}
                            {/* PENDING ACTIONS */}
                            {/* ================================================= */}

                            {currentOrder.status
                                ?.toLowerCase() ===
                                "pending" && (

                                <>

                                    <button
                                        type="button"
                                        disabled={
                                            updatingStatus
                                        }
                                        onClick={() =>
                                            handleStatusChange(
                                                "cancelled"
                                            )
                                        }
                                        className="
                                            inline-flex
                                            h-9
                                            items-center
                                            gap-1.5
                                            rounded-lg
                                            border
                                            border-[#e5c9c9]
                                            bg-white
                                            px-3
                                            text-sm
                                            font-medium
                                            text-[#a94442]
                                            transition-colors
                                            hover:bg-[#fff5f5]
                                            disabled:pointer-events-none
                                            disabled:opacity-50
                                        "
                                    >

                                        <XCircle
                                            className="
                                                h-4
                                                w-4
                                            "
                                        />

                                        Cancel

                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            updatingStatus
                                        }
                                        onClick={() =>
                                            handleStatusChange(
                                                "confirmed"
                                            )
                                        }
                                        className="
                                            inline-flex
                                            h-9
                                            items-center
                                            gap-1.5
                                            rounded-lg
                                            bg-[#3f6b4f]
                                            px-3.5
                                            text-sm
                                            font-medium
                                            text-white
                                            shadow-sm
                                            transition-colors
                                            hover:bg-[#345a42]
                                            disabled:pointer-events-none
                                            disabled:opacity-50
                                        "
                                    >

                                        <CheckCircle2
                                            className="
                                                h-4
                                                w-4
                                            "
                                        />

                                        {updatingStatus
                                            ? "Updating..."
                                            : "Confirm"}

                                    </button>

                                </>

                            )}

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* ASSIGN TABLE DIALOG */}
                    {/* ================================================= */}

                    <AssignTableDialog
                        open={
                            assignTableDialogOpen
                        }
                        onClose={() =>
                            setAssignTableDialogOpen(
                                false
                            )
                        }
                        orderId={
                            currentOrder.id
                        }
                        onAssigned={() =>
                            void handleTableAssigned()
                        }
                    />

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
                                        {
                                            currentOrder
                                                .items
                                                .length
                                        }{" "}
                                        {
                                            currentOrder
                                                .items
                                                .length ===
                                            1
                                                ? "item"
                                                : "items"
                                        }
                                    </p>

                                </div>

                            </div>

                            {/* Items */}

                            {currentOrder.items
                                .length > 0 ? (

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
                                            discountTotal >
                                            0

                                        return (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className={`
                                                    p-4
                                                    ${
                                                        index !==
                                                        currentOrder
                                                            .items
                                                            .length -
                                                            1
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

                                                    <div
                                                        className="
                                                            min-w-0
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                font-medium
                                                                leading-5
                                                                text-[#40332a]
                                                            "
                                                        >
                                                            {
                                                                item.menu_item
                                                            }
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-xs
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            {
                                                                item.quantity
                                                            }
                                                            {" × "}
                                                            QAR{" "}
                                                            {Number(
                                                                item.unit_price ||
                                                                0
                                                            ).toFixed(
                                                                2
                                                            )}
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
                                                                {
                                                                    item.notes
                                                                }
                                                            </p>
                                                        )}

                                                        {/* Modifiers */}

                                                        {item.modifiers &&
                                                            item.modifiers
                                                                .length >
                                                                0 && (

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
                                                                                ) >
                                                                                    0 && (
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
                                                                .length >
                                                                0 && (

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

                                                                                <span
                                                                                    className="
                                                                                        font-medium
                                                                                    "
                                                                                >
                                                                                    −
                                                                                    {" "}
                                                                                    QAR{" "}
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
                                                                {
                                                                    originalTotal
                                                                        .toFixed(
                                                                            2
                                                                        )
                                                                }
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
                                                            {
                                                                finalTotal
                                                                    .toFixed(
                                                                        2
                                                                    )
                                                            }
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
                                order={
                                    currentOrder
                                }
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
                                order={
                                    currentOrder
                                }
                                onPaymentSuccess={
                                    refreshOrder
                                }
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
                                    icon={
                                        <FileText />
                                    }
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
                                    {
                                        currentOrder.notes
                                    }
                                </div>

                            </section>

                        </>
                    )}

                    <Separator />

                    {/* ================================================= */}
                    {/* KITCHEN / LOCATION / TABLE */}
                    {/* ================================================= */}

                    <div
                        className="
                            grid
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-3
                        "
                    >

                        <InfoCard
                            icon={
                                <ChefHat />
                            }
                            title="Kitchen"
                            value={
                                currentOrder
                                    .kitchen_status ||
                                "-"
                            }
                        />

                        <InfoCard
                            icon={
                                <MapPin />
                            }
                            title="Location"
                            value={
                                currentOrder
                                    .location ||
                                "-"
                            }
                        />

                        <InfoCard
                            icon={
                                <Table2 />
                            }
                            title="Table"
                            value={
                                currentOrder
                                    .restaurant_table?.name ||
                                "Not assigned"
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