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

function formatDateTime(value: string | null) {

    if (!value) {
        return ""
    }

    return new Date(
        value.replace(" ", "T")
    ).toLocaleString(
        [],
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
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

function formatStatusCaps(status: string | null | undefined) {
    if (!status) {
        return "-"
    }

    return status
        .replace(/_/g, " ")
        .toUpperCase()
}

function getOrderStatusClass(status: string | null | undefined) {
    switch (status?.toLowerCase()) {
        case "pending":
            return "border-yellow-300 bg-yellow-50 text-yellow-700"
        case "confirmed":
            return "border-blue-300 bg-blue-50 text-blue-700"
        case "completed":
            return "border-emerald-300 bg-emerald-50 text-emerald-700"
        case "cancelled":
            return "border-rose-300 bg-rose-50 text-rose-700"
        case "draft":
            return "border-slate-300 bg-slate-50 text-slate-700"
        default:
            return "border-slate-300 bg-slate-50 text-slate-700"
    }
}

function getKitchenStatusClass(status: string | null | undefined) {
    switch (status?.toLowerCase()) {
        case "pending":
            return "border-amber-300 bg-amber-50 text-amber-700"
        case "preparing":
            return "border-indigo-300 bg-indigo-50 text-indigo-700"
        case "ready":
            return "border-green-300 bg-green-50 text-green-700"
        case "unknown":
            return "border-slate-300 bg-slate-50 text-slate-700"
        default:
            return "border-slate-300 bg-slate-50 text-slate-700"
    }
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

                selected && "bg-muted",

                order.status?.toLowerCase() === "pending" &&
                    "bg-yellow-50 hover:bg-yellow-100"
            )}
        >

            <div className="flex items-start justify-between gap-3">

                {/* LEFT */}

                <div className="min-w-0">

                    <div className="flex items-center gap-2">

                            <span className="font-semibold">
                                #{order.order_no} 
                            </span>
                             <span className="text-sm">
                                {order.notes ?? ""} 
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

                        {formatDateTime(order.ordered_at)}

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
                        className={cn(
                            "text-[10px] font-semibold tracking-wide",
                            getOrderStatusClass(order.status)
                        )}
                    >
                        {formatStatusCaps(order.status)}
                    </Badge>

                </div>


                {/* KITCHEN STATUS */}

                <div className="flex items-center gap-1.5">

                    <span className="text-[10px] font-medium text-muted-foreground">
                        Kitchen:
                    </span>

                    <Badge
                        variant="outline"
                        className={cn(
                            "text-[10px] font-semibold tracking-wide",
                            getKitchenStatusClass(order.kitchen_status)
                        )}
                    >
                        {formatStatusCaps(order.kitchen_status)}
                    </Badge>

                </div>

            </div>

        </button>
    )
}