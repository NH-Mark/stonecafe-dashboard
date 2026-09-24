"use client"

import { useEffect, useState } from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { Trash2 } from "lucide-react"

import {
    Order,
    OrderDiscount,
} from "../../orders.types"

import { listDiscounts } from "@/features/discount/discount.service"
import { Discount } from "@/types/discount"
import { getOrderDiscountAmount, getOrderNetBeforeDiscount } from "../../utils/order-pricing"

interface OrderDiscountCardProps {
    order: Order
    onChange: (order: Order) => void
}

export default function OrderDiscountCard({
    order,
    onChange,
}: OrderDiscountCardProps) {
    const discount = order.discounts?.[0]

    const [availableDiscounts, setAvailableDiscounts] =
        useState<Discount[]>([])

    const [loadingDiscounts, setLoadingDiscounts] =
        useState(true)

    useEffect(() => {
        async function loadDiscounts() {
            try {
                setLoadingDiscounts(true)

                const response = await listDiscounts()

                setAvailableDiscounts(
                    response.data?.data ??
                    response.data ??
                    []
                )
            } catch (error) {
                console.error(
                    "Failed to load discounts:",
                    error
                )
            } finally {
                setLoadingDiscounts(false)
            }
        }

        loadDiscounts()
    }, [])



    function addDiscount() {
        if (discount) {
            return
        }

        const newDiscount: OrderDiscount = {
            id: 0,
            name: "",
            type: "fixed",
            value: 0,
            amount: 0,
        }

        onChange({
            ...order,
            discounts: [newDiscount],
        })
    }

    function updateDiscount(
        discountId: string
    ) {
        const selectedDiscount =
            availableDiscounts.find(
                discount =>
                    Number(discount.id) ===
                    Number(discountId)
            )

        if (!selectedDiscount) {
            return
        }

        const type:
            | "percentage"
            | "fixed" =
            selectedDiscount.type ===
                "percentage"
                ? "percentage"
                : "fixed"

        const value =
            Number(
                selectedDiscount.value
            ) || 0

        const base =
            getOrderNetBeforeDiscount(order)

        const amount =
            type === "percentage"
                ? Math.min(
                    base,
                    (base * value) / 100
                )
                : Math.min(
                    base,
                    value
                )

        onChange({
            ...order,
            discounts: [
                {
                    id: selectedDiscount.id,
                    name: selectedDiscount.name,
                    type,
                    value,
                    amount,
                },
            ],
        })
    }

    function removeDiscount() {
        onChange({
            ...order,
            discounts: undefined,
        })
    }

    /*
     * Recalculate the discount amount whenever
     * the order subtotal changes.
     */
    useEffect(() => {
    if (!discount?.id) {
        return
    }

    const amount =
        getOrderDiscountAmount(order)

    if (
        Number(discount.amount) ===
        Number(amount)
    ) {
        return
    }

    onChange({
        ...order,
        discounts: [
            {
                ...discount,
                amount,
            },
        ],
    })
}, [
    order.items,
    order.discounts,
    order.tax_amount,
    order.service_charge,
])

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle>
                            Order Discount
                        </CardTitle>

                        <CardDescription>
                            Apply one discount to the
                            entire order.
                        </CardDescription>
                    </div>

                    {!discount && (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={addDiscount}
                            disabled={loadingDiscounts}
                        >
                            Add Discount
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {!discount ? (
                    <div className="rounded-lg border border-dashed p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            No order discount has been
                            applied.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-lg border p-4">
                        <div className="grid gap-4 sm:grid-cols-[1fr_180px_auto] sm:items-end">
                            <div className="space-y-2">
                                <Label>
                                    Discount
                                </Label>

                                <select
                                    value={
                                        discount.id
                                            ? String(
                                                discount.id
                                            )
                                            : ""
                                    }
                                    onChange={e =>
                                        updateDiscount(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        loadingDiscounts
                                    }
                                    className="w-full rounded-md border bg-background p-2"
                                >
                                    <option value="">
                                        {loadingDiscounts
                                            ? "Loading discounts..."
                                            : "Select discount"}
                                    </option>

                                    {availableDiscounts.map(
                                        discountOption => (
                                            <option
                                                key={
                                                    discountOption.id
                                                }
                                                value={String(
                                                    discountOption.id
                                                )}
                                            >
                                                {
                                                    discountOption.name
                                                }{" "}
                                                (
                                                {
                                                    discountOption.type ===
                                                        "percentage"
                                                        ? `${discountOption.value}%`
                                                        : `QAR ${discountOption.value}`
                                                }
                                                )
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    Discount Amount
                                </Label>

                                <div className="flex h-10 items-center rounded-md border bg-muted px-3">
                                    <span className="text-sm">
                                        -
                                        {Number(
                                            discount.amount
                                        ).toFixed(2)}{" "}
                                        QAR
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={removeDiscount}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        {discount.id > 0 && (
                            <div className="mt-2 text-xs text-muted-foreground">
                                {discount.type ===
                                    "percentage"
                                    ? `${discount.value}% discount`
                                    : `QAR ${Number(
                                        discount.value
                                    ).toFixed(
                                        2
                                    )} fixed discount`}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}