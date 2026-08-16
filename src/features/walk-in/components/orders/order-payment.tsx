"use client"

import { useState } from "react"

import {
    Banknote,
    CreditCard,
    Wallet,
    Plus,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Order } from "@/features/orders/orders.types"
import OrderPaymentDialog from "./OrderPaymentDialog"

interface OrderPaymentsProps {
    order: Order

    onPaymentSuccess?: () => void
}

function money(value: number) {
    return `QAR ${Number(value).toFixed(2)}`
}

function PaymentIcon({
    method,
}: {
    method: string | null
}) {
    const value = method?.toLowerCase()

    if (value?.includes("cash")) {
        return <Banknote className="h-4 w-4" />
    }

    if (
        value?.includes("card") ||
        value?.includes("credit")
    ) {
        return <CreditCard className="h-4 w-4" />
    }

    return <Wallet className="h-4 w-4" />
}

export default function OrderPayments({
    order,
    onPaymentSuccess,
}: OrderPaymentsProps) {

    const [paymentDialogOpen, setPaymentDialogOpen] =
        useState(false)

    const paidAmount =
        order.payments?.reduce(
            (sum, payment) =>
                sum + Number(payment.amount || 0),
            0
        ) ?? 0

    const remainingAmount = Math.max(
        Number(order.total || 0) -
        paidAmount,
        0
    )

    const canAddPayment =
        remainingAmount > 0 &&
        order.payment_status !== "paid"

    return (
        <>
            <div className="space-y-3">

                {/* Header */}

                <div className="flex items-center justify-between">

                    <div>

                        <h3 className="font-semibold">
                            Payments
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            {money(paidAmount)} paid
                        </p>

                    </div>

                    <div className="flex items-center gap-2">

                        <Badge
                            variant={
                                order.payment_status === "paid"
                                    ? "default"
                                    : "outline"
                            }
                            className="capitalize"
                        >
                            {order.payment_status}
                        </Badge>

                        {canAddPayment && (
                            <Button
                                size="sm"
                                onClick={() =>
                                    setPaymentDialogOpen(true)
                                }
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                Add Payment
                            </Button>
                        )}

                    </div>

                </div>

                {/* Payments */}

                {order.payments.length === 0 ? (

                    <div className="rounded-lg border p-4 text-sm text-muted-foreground">

                        No payment recorded.

                    </div>

                ) : (

                    <div className="space-y-2">

                        {order.payments.map(
                            payment => (

                                <div
                                    key={payment.id}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-lg
                                        border
                                        p-3
                                    "
                                >

                                    <div className="flex items-center gap-3">

                                        <div
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-md
                                                bg-muted
                                            "
                                        >
                                            <PaymentIcon
                                                method={
                                                    payment.method
                                                }
                                            />
                                        </div>

                                        <div>

                                            <p className="font-medium">
                                                {
                                                    payment.method ??
                                                    "Payment"
                                                }
                                            </p>

                                            {payment.reference && (
                                                <p className="text-xs text-muted-foreground">
                                                    Ref:{" "}
                                                    {
                                                        payment.reference
                                                    }
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                    <span className="font-medium">
                                        {money(
                                            payment.amount
                                        )}
                                    </span>

                                </div>
                            )
                        )}

                    </div>

                )}

                {/* Remaining */}

                {remainingAmount > 0 && (
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            rounded-lg
                            border
                            border-amber-200
                            bg-amber-50
                            px-4
                            py-3
                            text-sm
                        "
                    >
                        <span className="text-amber-800">
                            Remaining
                        </span>

                        <span className="font-semibold text-amber-900">
                            {money(remainingAmount)}
                        </span>
                    </div>
                )}

            </div>

            {/* Payment Dialog */}

            <OrderPaymentDialog
                open={paymentDialogOpen}
                order={order}
                onClose={() =>
                    setPaymentDialogOpen(false)
                }
                onSuccess={() => {
                    onPaymentSuccess?.()
                }}
            />
        </>
    )
}