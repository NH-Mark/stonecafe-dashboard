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
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-lg lg:max-w-6xl"
            >
                {/* Header */}
                <DialogHeader>
                    <div className="flex items-center justify-between">

                        <div>
                            <DialogTitle className="text-xl">
                                Order #{order.order_no}
                            </DialogTitle>

                            <p className="text-sm text-muted-foreground mt-1">
                                {new Date(order.ordered_at).toLocaleString()}
                            </p>
                        </div>


                        <div className="flex gap-2">
                            <Badge>
                                {order.status}
                            </Badge>

                            <Badge variant="secondary">
                                {order.payment_status}
                            </Badge>
                        </div>

                    </div>
                </DialogHeader>


                <div className="space-y-6">


                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">


                        <InfoCard
                            title="Customer"
                            value={order.customer || "Walk-in"}
                        />


                        <InfoCard
                            title="Table"
                            value={order.table || "-"}
                        />


                        <InfoCard
                            title="Type"
                            value={order.type}
                        />


                        <InfoCard
                            title="Source"
                            value={order.source}
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
                            title="Total"
                            value={`QAR ${Number(order.total).toFixed(2)}`}
                            highlight
                        />


                    </div>



                    {/* Items */}
                    <div className="rounded-xl border bg-white">

                        <div className="px-5 py-4 border-b">
                            <h3 className="font-semibold">
                                Order Items
                            </h3>
                        </div>


                        <Table>

                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-center">
                                        Qty
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>


                            <TableBody>

                                {order.items.map((item) => (

                                    <TableRow key={item.id}>

                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {item.menu_item}
                                                </p>

                                                {item.notes && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.notes}
                                                    </p>
                                                )}

                                            </div>
                                        </TableCell>


                                        <TableCell className="text-center">
                                            {item.quantity}
                                        </TableCell>


                                        <TableCell className="text-right">
                                            QAR {Number(item.unit_price).toFixed(2)}
                                        </TableCell>


                                        <TableCell className="text-right font-semibold">
                                            QAR {Number(item.total_price).toFixed(2)}
                                        </TableCell>
                                    </TableRow>

                                ))}


                            </TableBody>

                        </Table>

                    </div>



                    {/* Payment Summary */}
                    <div className="flex justify-end">

                        <div className="w-full md:w-96 rounded-xl border bg-muted/20 p-5 space-y-3">


                            <SummaryRow
                                label="Subtotal"
                                value={order.subtotal}
                            />

                            <SummaryRow
                                label="Discount"
                                value={order.discount_amount}
                            />


                            <SummaryRow
                                label="Tax"
                                value={order.tax_amount}
                            />


                            <SummaryRow
                                label="Service Charge"
                                value={order.service_charge}
                            />


                            <Separator />


                            <div className="flex justify-between text-lg font-bold">

                                <span>
                                    Total
                                </span>

                                <span>
                                    QAR {Number(order.total).toFixed(2)}
                                </span>

                            </div>


                        </div>

                    </div>

                    <div className="rounded-xl border p-5">

                        <h3 className="font-semibold mb-3">
                            Payments
                        </h3>


                        {order.payments.map((payment) => (

                            <div
                                key={payment.id}
                                className="flex justify-between py-2"
                            >

                                <div>
                                    <p className="font-medium">
                                        {payment.method}
                                    </p>

                                    {payment.reference && (
                                        <p className="text-xs text-muted-foreground">
                                            Ref: {payment.reference}
                                        </p>
                                    )}
                                </div>


                                <p className="font-semibold">
                                    QAR {Number(payment.amount).toFixed(2)}
                                </p>

                            </div>

                        ))}

                    </div>

                    {/* Notes */}
                    {order.notes && (

                        <div className="rounded-xl border bg-yellow-50 p-4">

                            <p className="font-semibold mb-1">
                                Notes
                            </p>

                            <p className="text-sm">
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
    highlight = false,
}: {
    title: string;
    value: string;
    highlight?: boolean;
}) {

    return (
        <div
            className={`
        rounded-xl border p-4
        ${highlight ? "bg-[#40332a] text-white" : "bg-muted/20"}
      `}
        >

            <p className="text-xs opacity-70">
                {title}
            </p>

            <p className="font-semibold mt-1 truncate">
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
        <div className="flex justify-between text-sm">

            <span className="text-muted-foreground">
                {label}
            </span>

            <span>
                QAR {Number(value).toFixed(2)}
            </span>

        </div>
    );
}