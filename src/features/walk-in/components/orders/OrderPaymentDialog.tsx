"use client"

import { useEffect, useMemo, useState } from "react"
import {
    Banknote,
    CreditCard,
    Loader2,
    Plus,
    Wallet,
} from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { PaymentMethod } from "@/types/payment-method"
import { getPaymentMethods, listPaymentMethods } from "@/features/payment-method/payment-method.service"
import { createPayment } from "@/features/orders/orders.service"

import { toast } from "sonner"
import { Order } from "@/features/orders/orders.types"

interface OrderPaymentDialogProps {
    open: boolean
    order: Order
    onClose: () => void
    onSuccess?: () => void
}

function getPaymentIcon(code?: string | null) {
    const value = code?.toLowerCase() ?? ""

    if (value.includes("cash")) {
        return <Banknote className="h-5 w-5" />
    }

    if (
        value.includes("card") ||
        value.includes("credit") ||
        value.includes("debit")
    ) {
        return <CreditCard className="h-5 w-5" />
    }

    return <Wallet className="h-5 w-5" />
}

export default function OrderPaymentDialog({
    open,
    order,
    onClose,
    onSuccess,
}: OrderPaymentDialogProps) {

    const [paymentMethods, setPaymentMethods] =
        useState<PaymentMethod[]>([])

    const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
        useState<number | null>(null)

    const [amount, setAmount] = useState("")

    const [reference, setReference] = useState("")

    const [loading, setLoading] = useState(false)

    const [methodsLoading, setMethodsLoading] = useState(false)

    /*
    |--------------------------------------------------------------------------
    | Remaining amount
    |--------------------------------------------------------------------------
    */

    const orderTotal = Number(order.total ?? 0)

    const paidAmount = useMemo(() => {
        return (
            order.payments?.reduce(
                (sum, payment) =>
                    sum + Number(payment.amount ?? 0),
                0
            ) ?? 0
        )
    }, [order.payments])

    const remainingAmount = Math.max(
        orderTotal - paidAmount,
        0
    )

    /*
    |--------------------------------------------------------------------------
    | Load payment methods
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!open) {
            return
        }

        async function loadMethods() {
            try {
                setMethodsLoading(true)

                const response =
                    await listPaymentMethods()

                const methods =
                    response.data?.data ??
                    response.data ??
                    []

                setPaymentMethods(methods)

                if (methods.length > 0) {
                    setSelectedPaymentMethodId(
                        methods[0].id
                    )
                }

            } catch (error) {
                console.error(error)

                toast.error(
                    "Unable to load payment methods."
                )
            } finally {
                setMethodsLoading(false)
            }
        }

        void loadMethods()
    }, [open])

    /*
    |--------------------------------------------------------------------------
    | Reset
    |--------------------------------------------------------------------------
    */

   useEffect(() => {
        if (!open) {
            setAmount("")
            setReference("")
            setSelectedPaymentMethodId(null)
            setLoading(false)
            return
        }

        if (remainingAmount > 0) {
            setAmount(remainingAmount.toFixed(2))
        } else {
            setAmount("")
        }
    }, [open, remainingAmount])

    /*
    |--------------------------------------------------------------------------
    | Fill remaining
    |--------------------------------------------------------------------------
    */

    function fillRemaining() {
        setAmount(
            remainingAmount.toFixed(2)
        )
    }

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    async function handlePayment() {

        if (loading) {
            return
        }

        if (!selectedPaymentMethodId) {
            toast.error(
                "Please select a payment method."
            )
            return
        }

        const paymentAmount =
            Number(amount)

        if (
            !Number.isFinite(paymentAmount) ||
            paymentAmount <= 0
        ) {
            toast.error(
                "Enter a valid payment amount."
            )
            return
        }

        if (
            paymentAmount >
            remainingAmount + 0.01
        ) {
            toast.error(
                `Maximum payment is ${remainingAmount.toFixed(2)} QAR.`
            )
            return
        }

        try {
            setLoading(true)

            await createPayment(
                order.id,
                {
                    order_source_id:
                        order.order_source_id ?? null,

                    payments: [
                        {
                            payment_method_id:
                                selectedPaymentMethodId,

                            amount:
                                Number(
                                    paymentAmount.toFixed(2)
                                ),

                            ...(reference.trim()
                                ? {
                                    reference:
                                        reference.trim(),
                                }
                                : {}),
                        },
                    ],
                }
            )

            toast.success(
                "Payment added successfully."
            )

            onSuccess?.()

            onClose()

        } catch (error) {

            console.error(
                "Payment error:",
                error
            )

            toast.error(
                "Payment failed. Please try again."
            )

        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value && !loading) {
                    onClose()
                }
            }}
        >
            <DialogContent className="max-w-lg rounded-3xl">

                <DialogHeader>
                    <DialogTitle>
                        Add Payment
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5">

                    {/* Balance */}

                    <div className="rounded-2xl bg-[#40332a] p-5 text-white">

                        <p className="text-sm opacity-70">
                            Remaining Balance
                        </p>

                        <p className="mt-1 text-3xl font-bold">
                            QAR{" "}
                            {remainingAmount.toFixed(2)}
                        </p>

                    </div>

                    {/* Payment methods */}

                    <div className="space-y-2">

                        <p className="text-sm font-semibold">
                            Payment Method
                        </p>

                        {methodsLoading ? (

                            <div className="flex justify-center p-5">
                                <Loader2 className="animate-spin" />
                            </div>

                        ) : (

                            <div className="grid grid-cols-2 gap-3">

                                {paymentMethods.map(
                                    method => (

                                        <button
                                            key={method.id}
                                            type="button"
                                            disabled={loading}
                                            onClick={() =>
                                                setSelectedPaymentMethodId(
                                                    method.id
                                                )
                                            }
                                            className={`
                                                flex
                                                items-center
                                                gap-3
                                                rounded-2xl
                                                border
                                                p-4
                                                text-left
                                                transition
                                                ${
                                                    selectedPaymentMethodId ===
                                                    method.id
                                                        ? "border-primary bg-primary/10"
                                                        : "hover:bg-muted"
                                                }
                                            `}
                                        >

                                            <span>
                                                {getPaymentIcon(
                                                    method.code
                                                )}
                                            </span>

                                            <span className="font-medium">
                                                {method.name}
                                            </span>

                                        </button>

                                    )
                                )}

                            </div>
                        )}

                    </div>

                    {/* Amount */}

                    <div className="space-y-2">

                        <p className="text-sm font-semibold">
                            Amount
                        </p>

                        <Input
                            type="number"
                            min="0"
                            max={remainingAmount.toFixed(2)}
                            step="0.01"
                            value={amount}
                            onChange={(event) =>
                                setAmount(event.target.value)
                            }
                            disabled={
                                loading ||
                                remainingAmount <= 0
                            }
                            placeholder="Payment amount"
                        />

                        {/* <p className="text-xs text-muted-foreground">
                            Remaining balance: QAR{" "}
                            {remainingAmount.toFixed(2)}
                        </p> */}

                    </div>

                    {/* Reference */}

                    <Input
                        value={reference}
                        onChange={(event) =>
                            setReference(
                                event.target.value
                            )
                        }
                        disabled={loading}
                        placeholder="Reference (optional)"
                    />

                    {/* Submit */}

                    <Button
                        className="
                            h-12
                            w-full
                            rounded-2xl
                            font-semibold
                        "
                        disabled={
                            loading ||
                            remainingAmount <= 0 ||
                            !selectedPaymentMethodId ||
                            !amount
                        }
                        onClick={handlePayment}
                    >

                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Payment
                            </>
                        )}

                    </Button>

                </div>

            </DialogContent>
        </Dialog>
    )
}