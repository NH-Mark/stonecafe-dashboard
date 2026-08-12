
"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Order } from "../orders.types";
import { Separator } from "@base-ui/react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order;
}

export default function ViewOrderDialog({
    open,
    onOpenChange,
    order,
}: Props) {
    const orderDiscount = Number(order.discount_amount || 0);

    const finalTotal = Number(order.total || 0);

    const originalTotal =
        finalTotal + orderDiscount;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg lg:max-w-6xl max-h-[90vh] overflow-y-auto p-0">

                {/* Header */}
                <DialogHeader className="border-b px-6 py-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <DialogTitle className="text-xl font-semibold">
                                Order #{order.order_no}
                            </DialogTitle>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {new Date(order.ordered_at).toLocaleString()}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge>
                                {order.status}
                            </Badge>

                            <Badge variant="secondary">
                                {order.payment_status}
                            </Badge>

                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 px-6 py-6">

                    {/* Order Information */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold">
                            Order Information
                        </h3>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                            <InfoCard
                                title="Customer"
                                value={order.customer || "Walk-in"}
                            />

                            <InfoCard
                                title="Type"
                                value={order.type || "-"}
                            />

                            <InfoCard
                                title="Source"
                                value={order.source || "-"}
                            />

                            <InfoCard
                                title="Cashier"
                                value={order.cashier || "-"}
                            />

                            <InfoCard
                                title="Location"
                                value={order.location || "-"}
                            />

                            <InfoCard
                                title="Table"
                                value={order.table || "-"}
                            />
                        </div>
                    </div>

                    {/* Items */}
                    <div className="overflow-hidden rounded-xl border bg-background">

                        <div className="flex items-center justify-between border-b bg-muted/20 px-5 py-4">
                            <div>
                                <h3 className="font-semibold">
                                    Order Items
                                </h3>

                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {order.items.length}{" "}
                                    {order.items.length === 1
                                        ? "item"
                                        : "items"}
                                </p>
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/10">
                                    <TableHead className="min-w-[320px]">
                                        Item
                                    </TableHead>

                                    <TableHead className="w-20 text-center">
                                        Qty
                                    </TableHead>

                                    <TableHead className="w-36 text-right">
                                        Unit Price
                                    </TableHead>

                                    <TableHead className="w-40 text-right">
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {order.items.map((item) => {
                                    const itemDiscountTotal =
                                        item.discounts?.reduce(
                                            (sum, discount) =>
                                                sum + Number(discount.amount || 0),
                                            0
                                        ) || 0;

                                    // Unit price NEVER changes because of discounts.
                                    const unitPrice = Number(item.unit_price || 0);

                                    // total_price is the original line total before
                                    // applying the item discount.
                                    const originalItemTotal = Number(
                                        item.total_price || 0
                                    );

                                    // Discount is applied ONLY to the total.
                                    const finalItemTotal = Math.max(
                                        0,
                                        originalItemTotal - itemDiscountTotal
                                    );

                                    const hasItemDiscount =
                                        itemDiscountTotal > 0;

                                    return (
                                        <TableRow
                                            key={item.id}
                                            className="align-top"
                                        >
                                            {/* Item */}
                                            <TableCell className="py-3">
                                                <div className="space-y-1.5">

                                                    {/* Item name + notes */}
                                                    <div>
                                                        <p className="font-medium leading-5">
                                                            {item.menu_item}
                                                        </p>

                                                        {item.notes && (
                                                            <p className="mt-0.5 text-xs leading-4 text-muted-foreground">
                                                                {item.notes}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Modifiers */}
                                                    {item.modifiers?.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {item.modifiers.map((modifier, index) => (
                                                                <Badge
                                                                    key={`${modifier.modifier}-${index}`}
                                                                    variant="secondary"
                                                                    className="h-6 px-2 text-xs font-normal"
                                                                >
                                                                    {modifier.modifier}

                                                                    {modifier.quantity > 1 && (
                                                                        <span className="ml-1">
                                                                            ×{modifier.quantity}
                                                                        </span>
                                                                    )}

                                                                    {Number(modifier.price) > 0 && (
                                                                        <span className="ml-1 text-muted-foreground">
                                                                            + QAR{" "}
                                                                            {Number(modifier.price).toFixed(2)}
                                                                        </span>
                                                                    )}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {hasItemDiscount && (
                                                        <div className="space-y-0.5 text-xs text-green-600">
                                                            {item.discounts.map((discount) => (
                                                                <div
                                                                    key={discount.id}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <span>{discount.name}</span>
                                                                    <span className="font-medium">
                                                                        − QAR {Number(discount.amount).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}


                                                </div>
                                            </TableCell>


                                            {/* Quantity */}
                                            <TableCell className="py-4 text-center">
                                                <span className="font-medium">
                                                    {item.quantity}
                                                </span>
                                            </TableCell>

                                            {/* Unit Price */}
                                            <TableCell className="py-4 text-right">
                                                <span className="font-medium">
                                                    QAR {unitPrice.toFixed(2)}
                                                </span>
                                            </TableCell>

                                            {/* Total */}
                                            <TableCell className="py-4 text-right">
                                                {hasItemDiscount ? (
                                                    <div className="flex flex-col items-end gap-0.5">

                                                        {/* Original total */}
                                                        <span className="text-xs text-muted-foreground line-through">
                                                            QAR{" "}
                                                            {originalItemTotal.toFixed(2)}
                                                        </span>

                                                        {/* Discounted total */}
                                                        <span className="font-semibold text-green-700">
                                                            QAR{" "}
                                                            {finalItemTotal.toFixed(2)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="font-semibold">
                                                        QAR{" "}
                                                        {originalItemTotal.toFixed(2)}
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                            </TableBody>
                        </Table>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid gap-6 lg:grid-cols-2">

                        {/* Payments */}
                        <div className="rounded-xl border">
                            <div className="border-b px-5 py-4">
                                <h3 className="font-semibold">
                                    Payments
                                </h3>
                            </div>

                            <div className="divide-y px-5">
                                {order.payments.length > 0 ? (
                                    order.payments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between py-4"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {payment.method}
                                                </p>

                                                {payment.reference && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Ref:{" "}
                                                        {payment.reference}
                                                    </p>
                                                )}

                                                {payment.paid_at && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {new Date(
                                                            payment.paid_at
                                                        ).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>

                                            <p className="font-semibold">
                                                QAR{" "}
                                                {Number(
                                                    payment.amount
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-6 text-sm text-muted-foreground">
                                        No payments recorded.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="rounded-xl border bg-muted/10 p-5">
                            <div className="mb-4">
                                <h3 className="font-semibold">
                                    Order Summary
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <SummaryRow
                                    label="Subtotal"
                                    value={order.subtotal}
                                />

                                {/* Item Discounts */}
                                {order.items.flatMap(
                                    (item) =>
                                        item.discounts?.map((discount) => ({
                                            ...discount,
                                            source: "item",
                                        })) || []
                                ).map((discount) => (
                                    <DiscountSummaryRow
                                        key={`item-${discount.id}`}
                                        label={discount.name}
                                        value={discount.amount}
                                    />
                                ))}

                                {/* Order Discounts */}
                                {order.discounts?.map((discount, index) => (
                                    <DiscountSummaryRow
                                        key={`order-${discount.name}-${index}`}
                                        label={discount.name}
                                        value={discount.amount}
                                    />
                                ))}

                                <Separator />

                                {/* Total */}
                                <div className="flex items-end justify-between pt-1">
                                    <div>
                                        <p className="text-sm font-medium">
                                            Total
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        {orderDiscount > 0 && (
                                            <p className="text-sm text-muted-foreground line-through">
                                                QAR {originalTotal.toFixed(2)}
                                            </p>
                                        )}

                                        <p className="text-2xl font-bold tracking-tight">
                                            QAR {finalTotal.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <p className="mb-1 text-sm font-semibold text-amber-900">
                                Order Notes
                            </p>

                            <p className="text-sm text-amber-800">
                                {order.notes}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function InfoCard({
    title,
    value,
}: {
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-lg border bg-muted/10 px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {title}
            </p>

            <p className="mt-1 truncate text-sm font-semibold">
                {value}
            </p>
        </div>
    );
}

function SummaryRow({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
                {label}
            </span>

            <span className="font-medium">
                QAR {Number(value || 0).toFixed(2)}
            </span>
        </div>
    );
}

function DiscountSummaryRow({
    label,
    value,
}: {
    label: string;
    value: number | string;
}) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
                {label}
            </span>

            <span className="font-medium text-green-600">
                − QAR {Number(value || 0).toFixed(2)}
            </span>
        </div>
    );
}
