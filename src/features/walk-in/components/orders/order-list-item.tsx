"use client"

import { Clock, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"
import { Order } from "@/features/orders/orders.types"

interface OrderListItemProps {
    order: Order
    selected: boolean
    onClick: () => void
}

function formatMoney(value: number) {
    return `QAR ${Number(value).toFixed(2)}`
}

function formatTime(value: string | null) {

    if (!value) {
        return ""
    }

    return new Date(
        value.replace(" ", "T")
    ).toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit",
        }
    )
}

function formatStatus(status: string | null | undefined) {

    if (!status) {
        return "-"
    }

    return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase())
}

function getPaymentVariant(status: string) {

    switch (status.toLowerCase()) {

        case "paid":
            return "default" as const

        case "partial":
            return "secondary" as const

        default:
            return "outline" as const
    }
}

export default function OrderListItem({
    order,
    selected,
    onClick,
}: OrderListItemProps) {

    return (

        <button
            type="button"
            onClick={onClick}
            className={cn(
                "w-full border-b p-4 text-left transition-colors",
                "hover:bg-muted/50",
                selected && "bg-muted"
            )}
        >

            <div className="flex items-start justify-between gap-3">

                {/* LEFT */}

                <div className="min-w-0">

                    <div className="flex items-center gap-2">

                        <span className="font-semibold">
                            #{order.order_no}
                        </span>

                        <Badge
                            variant="secondary"
                            className="text-[10px]"
                        >
                            {order.type ?? "Order"}
                        </Badge>

                    </div>


                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">

                        <Clock className="h-3.5 w-3.5" />

                        {formatTime(order.ordered_at)}

                    </div>

                </div>


                {/* RIGHT */}

                <div className="text-right">

                    <p className="font-semibold">
                        {formatMoney(order.total)}
                    </p>

                    <Badge
                        variant={getPaymentVariant(order.payment_status)}
                        className="mt-1 text-[10px] capitalize"
                    >
                        {formatStatus(order.payment_status)}
                    </Badge>

                </div>

            </div>


            {/* CUSTOMER / TABLE */}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">

                <div className="flex items-center gap-1 text-muted-foreground">

                    {order.table ? (
                        <>
                            <MapPin className="h-3.5 w-3.5" />
                            {order.table}
                        </>
                    ) : (
                        order.customer ?? "Walk-in Customer"
                    )}

                </div>


                <div className="flex items-center gap-3">

                    {order.number_plate && (
                        <span className="font-medium text-foreground">
                            Plate: {order.number_plate}
                        </span>
                    )}

                    {order.source && (
                        <span className="text-muted-foreground">
                            {order.source}
                        </span>
                    )}

                </div>

            </div>


            {/* ORDER + KITCHEN STATUS */}

            <div className="mt-3 flex flex-wrap items-center gap-2">

                {/* ORDER STATUS */}

                <div className="flex items-center gap-1.5">

                    <span className="text-[10px] font-medium text-muted-foreground">
                        Status:
                    </span>

                    <Badge
                        variant="outline"
                        className="text-[10px]"
                    >
                        {formatStatus(order.status)}
                    </Badge>

                </div>


                {/* KITCHEN STATUS */}

                <div className="flex items-center gap-1.5">

                    <span className="text-[10px] font-medium text-muted-foreground">
                        Kitchen:
                    </span>

                    <Badge
                        variant="outline"
                        className="text-[10px]"
                    >
                        {formatStatus(order.kitchen_status)}
                    </Badge>

                </div>

            </div>

        </button>
    )
}