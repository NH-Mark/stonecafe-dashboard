"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Order, Payment } from "../../orders.types";
import { listPaymentMethods } from "@/features/payment-method/payment-method.service";

import {
    getOrderTotal,
} from "../../utils/order-pricing";

interface PaymentMethod {
    id: number;
    name: string;
}

interface Props {
    order: Order;
    onChange: (order: Order) => void;
}

export default function OrderPaymentsCard({
    order,
    onChange,
}: Props) {
    const [paymentMethods, setPaymentMethods] =
        useState<PaymentMethod[]>([]);

    const [loadingMethods, setLoadingMethods] =
        useState(true);

    const payments = order.payments ?? [];

    /*
    |--------------------------------------------------------------------------
    | Live order total
    |--------------------------------------------------------------------------
    |
    | This recalculates whenever:
    |
    | - item quantity changes
    | - item price changes
    | - modifier changes
    | - item discount changes
    | - order discount changes
    |
    */

    const orderTotal = useMemo(() => {
        return getOrderTotal(order);
    }, [
        order.items,
        order.discounts,
        order.tax_amount,
        order.service_charge,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Total payments
    |--------------------------------------------------------------------------
    */

    const paidAmount = useMemo(() => {
        return payments.reduce(
            (sum, payment) =>
                sum + Number(payment.amount || 0),
            0
        );
    }, [payments]);

    /*
    |--------------------------------------------------------------------------
    | Remaining amount
    |--------------------------------------------------------------------------
    */

    const remainingAmount = useMemo(() => {
        return Math.max(
            orderTotal - paidAmount,
            0
        );
    }, [
        orderTotal,
        paidAmount,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Load payment methods
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        async function loadPaymentMethods() {
            try {
                setLoadingMethods(true);

                const response =
                    await listPaymentMethods();

                const data =
                    response.data?.data ??
                    response.data ??
                    [];

                setPaymentMethods(data);
            } catch (error) {
                console.error(
                    "Failed to load payment methods:",
                    error
                );

                toast.error(
                    "Unable to load payment methods."
                );
            } finally {
                setLoadingMethods(false);
            }
        }

        loadPaymentMethods();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Available amount for individual payment
    |--------------------------------------------------------------------------
    */

    function getAvailableAmount(
        index: number
    ): number {
        const currentPaymentAmount =
            Number(
                payments[index]?.amount || 0
            );

        return Math.max(
            orderTotal -
            (paidAmount -
                currentPaymentAmount),
            0
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Add payment
    |--------------------------------------------------------------------------
    */

    function addPayment() {
        if (remainingAmount <= 0) {
            toast.error(
                "The order has already been fully paid."
            );

            return;
        }

        const payment: Payment = {
            id: 0,
            payment_method_id: 0,
            method: null,
            amount: Number(
                remainingAmount.toFixed(2)
            ),
            reference: "",
            received_by: null,
            paid_at:
                new Date().toISOString(),
        };

        onChange({
            ...order,
            payments: [
                ...payments,
                payment,
            ],
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Update payment
    |--------------------------------------------------------------------------
    */

    function updatePayment(
        index: number,
        updates: Partial<Payment>
    ) {
        const updatedPayments = [
            ...payments,
        ];

        updatedPayments[index] = {
            ...updatedPayments[index],
            ...updates,
        };

        onChange({
            ...order,
            payments: updatedPayments,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Payment method
    |--------------------------------------------------------------------------
    */

    function handlePaymentMethodChange(
        index: number,
        value: string | null
    ) {
        if (!value) {
            updatePayment(index, {
                payment_method_id: 0,
                method: null,
            });

            return;
        }

        const paymentMethodId =
            Number(value);

        const paymentMethod =
            paymentMethods.find(
                method =>
                    method.id === paymentMethodId
            );

        updatePayment(index, {
            payment_method_id:
                paymentMethodId,

            method:
                paymentMethod?.name ?? null,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Payment amount
    |--------------------------------------------------------------------------
    */

    function handleAmountChange(
        index: number,
        value: string
    ) {
        if (value === "") {
            updatePayment(index, {
                amount: 0,
            });

            return;
        }

        let amount = Number(value);

        if (!Number.isFinite(amount)) {
            amount = 0;
        }

        amount = Math.max(
            amount,
            0
        );

        const availableAmount =
            getAvailableAmount(index);

        amount = Math.min(
            amount,
            availableAmount
        );

        updatePayment(index, {
            amount: Number(
                amount.toFixed(2)
            ),
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Remove payment
    |--------------------------------------------------------------------------
    */

    function removePayment(index: number) {
        const updatedPayments =
            payments.filter(
                (_, paymentIndex) =>
                    paymentIndex !== index
            );

        onChange({
            ...order,
            payments: updatedPayments,
        });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>
                        Payments
                    </CardTitle>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage payments received for this order.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPayment}
                    disabled={
                        loadingMethods ||
                        remainingAmount <= 0
                    }
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment
                </Button>
            </CardHeader>

            <CardContent className="space-y-4">
                {payments.length === 0 ? (
                    <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No payments recorded.
                    </div>
                ) : (
                    payments.map(
                        (payment, index) => {
                            const availableAmount =
                                getAvailableAmount(
                                    index
                                );

                            return (
                                <div
                                    key={
                                        payment.id > 0
                                            ? payment.id
                                            : `new-payment-${index}`
                                    }
                                    className="
                                        grid
                                        gap-4
                                        rounded-lg
                                        border
                                        p-4
                                        md:grid-cols-[1fr_180px_1fr_auto]
                                    "
                                >
                                    {/* Payment Method */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Payment Method
                                        </label>

                                        <Select
                                            value={
                                                payment.payment_method_id != null &&
                                                    payment.payment_method_id > 0
                                                    ? String(payment.payment_method_id)
                                                    : ""
                                            }
                                            onValueChange={value =>
                                                handlePaymentMethodChange(
                                                    index,
                                                    value
                                                )
                                            }
                                            disabled={loadingMethods}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select payment method">
                                                    {payment.method ||
                                                        paymentMethods.find(
                                                            method =>
                                                                method.id ===
                                                                payment.payment_method_id
                                                        )?.name ||
                                                        "Select payment method"}
                                                </SelectValue>
                                            </SelectTrigger>

                                            <SelectContent>
                                                {paymentMethods.map(method => (
                                                    <SelectItem
                                                        key={method.id}
                                                        value={String(method.id)}
                                                    >
                                                        {method.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Amount */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Amount
                                        </label>

                                        <Input
                                            type="number"
                                            min="0"
                                            max={
                                                availableAmount
                                            }
                                            step="0.01"
                                            value={Number(
                                                payment.amount ||
                                                0
                                            )}
                                            onChange={event =>
                                                handleAmountChange(
                                                    index,
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <p className="text-xs text-muted-foreground">
                                            Max:{" "}
                                            {availableAmount.toFixed(
                                                2
                                            )}
                                        </p>
                                    </div>

                                    {/* Reference */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Reference
                                        </label>

                                        <Input
                                            value={
                                                payment.reference ??
                                                ""
                                            }
                                            onChange={event =>
                                                updatePayment(
                                                    index,
                                                    {
                                                        reference:
                                                            event
                                                                .target
                                                                .value,
                                                    }
                                                )
                                            }
                                            placeholder="Reference"
                                        />
                                    </div>

                                    {/* Remove */}
                                    <div className="flex items-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removePayment(
                                                    index
                                                )
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        }
                    )
                )}

                {/* Payment Summary */}
                <div className="grid gap-4 rounded-lg bg-muted/50 p-4 sm:grid-cols-3">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Order Total
                        </p>

                        <p className="text-lg font-semibold">
                            {orderTotal.toFixed(
                                2
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Paid
                        </p>

                        <p className="text-lg font-semibold">
                            {paidAmount.toFixed(
                                2
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Remaining
                        </p>

                        <p className="text-lg font-semibold">
                            {remainingAmount.toFixed(
                                2
                            )}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}