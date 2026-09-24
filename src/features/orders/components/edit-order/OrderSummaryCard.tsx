"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Order } from "../../orders.types"
import { Separator } from "@base-ui/react"
import { getItemDiscountsTotal, getOrderDiscountAmount, getOrderSubtotal, getOrderTotal, getTotalDiscount } from "../../utils/order-pricing"


interface OrderSummaryCardProps {
    order: Order
}

export default function OrderSummaryCard({
    order,
}: OrderSummaryCardProps) {
    const subtotal =
        getOrderSubtotal(order)

    const itemDiscounts =
        getItemDiscountsTotal(order)

    const orderDiscount =
        getOrderDiscountAmount(order)

    const totalDiscount =
        getTotalDiscount(order)

    const taxAmount =
        Number(order.tax_amount ?? 0)

    const serviceCharge =
        Number(order.service_charge ?? 0)

    const total =
        getOrderTotal(order)

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Order Summary
                </CardTitle>

                <CardDescription>
                    Review the calculated order totals.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Items
                        </span>

                        <span>
                            {order.items.length}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Subtotal
                        </span>

                        <span>
                            {subtotal.toFixed(2)}
                        </span>
                    </div>

                    {/* <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Item Discounts
                        </span>

                        <span className="text-destructive">
                            -{itemDiscounts.toFixed(2)}
                        </span>
                    </div>

                    {orderDiscount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Order Discount
                            </span>

                            <span className="text-destructive">
                                -{orderDiscount.toFixed(2)}
                            </span>
                        </div>
                    )} */}

                    {taxAmount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Tax
                            </span>

                            <span>
                                {taxAmount.toFixed(2)}
                            </span>
                        </div>
                    )}

                    {serviceCharge > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Service Charge
                            </span>

                            <span>
                                {serviceCharge.toFixed(2)}
                            </span>
                        </div>
                    )}

                    <Separator />

                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Total Discount
                        </span>

                        <span className="text-destructive">
                            -{totalDiscount.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-base font-semibold">
                            Total
                        </span>

                        <span className="text-xl font-bold">
                            {total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}