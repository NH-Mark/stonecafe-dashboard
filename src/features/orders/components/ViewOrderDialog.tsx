"use client";

import { useEffect, useState } from "react";

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

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import {
    ChevronDown,
    ChevronRight,
    Clock,
    History,
    User,
} from "lucide-react";

import { Separator } from "@base-ui/react";

import { Order } from "../orders.types";
import { getOrderHistory } from "../orders.service";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order;
}

interface OrderHistoryItem {
    id: number;
    action: string;
    description?: string | null;
    old_values?: Record<string, unknown> | null;
    new_values?: Record<string, unknown> | null;
    reason?: string | null;
    created_at: string;
    user?: {
        id: number;
        name: string;
    } | null;
}

export default function ViewOrderDialog({
    open,
    onOpenChange,
    order,
}: Props) {
    const finalTotal = Number(order.total || 0);

    // Total of all item-level discounts
    const itemDiscountTotal = order.items.reduce((total, item) => {
        return (
            total +
            (item.discounts?.reduce(
                (sum, discount) =>
                    sum + Number(discount.amount || 0),
                0
            ) || 0)
        );
    }, 0);

    // Total of all order-level discounts
    const orderDiscountTotal =
        order.discounts?.reduce(
            (sum, discount) =>
                sum + Number(discount.amount || 0),
            0
        ) || 0;

    // Total discount
    const totalDiscount =
        itemDiscountTotal + orderDiscountTotal;

    // Original total before discounts
    const originalTotal = finalTotal + totalDiscount;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="
                    w-[calc(100%-2rem)]
                    sm:max-w-2xl
                    lg:max-w-6xl
                    h-[90vh]
                    overflow-hidden
                    p-0
                "
            >
                <Tabs
                    defaultValue="overview"
                    className="flex h-full min-h-0 flex-col"
                >
                    {/* ================================================== */}
                    {/* HEADER */}
                    {/* ================================================== */}

                    <DialogHeader className="shrink-0 border-b px-6 py-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <DialogTitle className="text-xl font-semibold">
                                    Order #{order.order_no}
                                </DialogTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {new Date(
                                        order.ordered_at
                                    ).toLocaleString()}
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

                    {/* ================================================== */}
                    {/* TAB NAVIGATION */}
                    {/* ================================================== */}

                    <div className="flex shrink-0 items-center border-b px-6 py-2">
                        <TabsList className="inline-flex h-9 rounded-lg bg-muted p-1">
                            <TabsTrigger
                                value="overview"
                                className="
                                    h-7
                                    rounded-md
                                    px-4
                                    text-sm
                                    font-medium
                                    transition-all
                                    data-[state=active]:bg-background
                                    data-[state=active]:text-foreground
                                    data-[state=active]:shadow-sm
                                "
                            >
                                Overview
                            </TabsTrigger>

                            <TabsTrigger
                                value="history"
                                className="
                                    h-7
                                    gap-1.5
                                    rounded-md
                                    px-4
                                    text-sm
                                    font-medium
                                    transition-all
                                    data-[state=active]:bg-background
                                    data-[state=active]:text-foreground
                                    data-[state=active]:shadow-sm
                                "
                            >
                                <History className="h-3.5 w-3.5" />
                                History
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* ================================================== */}
                    {/* OVERVIEW */}
                    {/* ================================================== */}

                    <TabsContent
                        value="overview"
                        className="
                            m-0
                            min-h-0
                            flex-1
                            overflow-y-auto
                            overflow-x-hidden
                            p-0
                        "
                    >
                        <div className="space-y-6 px-6 py-6">
                            {/* ================================================== */}
                            {/* ORDER INFORMATION */}
                            {/* ================================================== */}

                            <div>
                                <h3 className="mb-3 text-sm font-semibold">
                                    Order Information
                                </h3>

                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                                    <InfoCard
                                        title="Customer"
                                        value={
                                            order.customer ||
                                            "Walk-in"
                                        }
                                    />

                                    <InfoCard
                                        title="Type"
                                        value={
                                            order.type || "-"
                                        }
                                    />

                                    <InfoCard
                                        title="Source"
                                        value={
                                            order.source || "-"
                                        }
                                    />

                                    <InfoCard
                                        title="Cashier"
                                        value={
                                            order.cashier || "-"
                                        }
                                    />

                                    <InfoCard
                                        title="Location"
                                        value={
                                            order.location || "-"
                                        }
                                    />

                                    <InfoCard
                                        title="Table"
                                        value={
                                            order.table || "-"
                                        }
                                    />
                                </div>
                            </div>

                            {/* ================================================== */}
                            {/* ITEMS */}
                            {/* ================================================== */}

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
                                                    (
                                                        sum,
                                                        discount
                                                    ) =>
                                                        sum +
                                                        Number(
                                                            discount.amount ||
                                                                0
                                                        ),
                                                    0
                                                ) || 0;

                                            const unitPrice = Number(
                                                item.unit_price || 0
                                            );

                                            const modifierTotal =
                                                item.modifiers?.reduce(
                                                    (
                                                        sum,
                                                        modifier
                                                    ) =>
                                                        sum +
                                                        Number(
                                                            modifier.price ||
                                                                0
                                                        ) *
                                                            Number(
                                                                modifier.quantity ||
                                                                    1
                                                            ),
                                                    0
                                                ) || 0;

                                            const originalItemTotal =
                                                (unitPrice +
                                                    modifierTotal) *
                                                Number(
                                                    item.quantity || 0
                                                );

                                            const finalItemTotal =
                                                Math.max(
                                                    0,
                                                    originalItemTotal -
                                                        itemDiscountTotal
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
                                                            <div>
                                                                <p className="font-medium leading-5">
                                                                    {
                                                                        item.menu_item
                                                                    }
                                                                </p>

                                                                {item.notes && (
                                                                    <p className="mt-0.5 text-xs leading-4 text-muted-foreground">
                                                                        {
                                                                            item.notes
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Modifiers */}
                                                            {item.modifiers
                                                                ?.length >
                                                                0 && (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {item.modifiers.map(
                                                                        (
                                                                            modifier,
                                                                            index
                                                                        ) => (
                                                                            <Badge
                                                                                key={`${modifier.modifier}-${index}`}
                                                                                variant="secondary"
                                                                                className="h-6 px-2 text-xs font-normal"
                                                                            >
                                                                                {
                                                                                    modifier.modifier
                                                                                }

                                                                                {modifier.quantity >
                                                                                    1 && (
                                                                                    <span className="ml-1">
                                                                                        ×
                                                                                        {
                                                                                            modifier.quantity
                                                                                        }
                                                                                    </span>
                                                                                )}

                                                                                {Number(
                                                                                    modifier.price
                                                                                ) >
                                                                                    0 && (
                                                                                    <span className="ml-1 text-muted-foreground">
                                                                                        +
                                                                                        {" "}
                                                                                        QAR{" "}
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

                                                            {/* Item Discounts */}
                                                            {hasItemDiscount && (
                                                                <div className="space-y-0.5 text-xs text-green-600">
                                                                    {item.discounts.map(
                                                                        (
                                                                            discount
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    discount.id
                                                                                }
                                                                                className="flex items-center gap-2"
                                                                            >
                                                                                <span>
                                                                                    {
                                                                                        discount.name
                                                                                    }
                                                                                </span>

                                                                                <span className="font-medium">
                                                                                    −
                                                                                    {" "}
                                                                                    QAR{" "}
                                                                                    {Number(
                                                                                        discount.amount
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
                                                    </TableCell>

                                                    {/* Quantity */}
                                                    <TableCell className="py-4 text-center">
                                                        <span className="font-medium">
                                                            {
                                                                item.quantity
                                                            }
                                                        </span>
                                                    </TableCell>

                                                    {/* Unit Price */}
                                                    <TableCell className="py-4 text-right">
                                                        <span className="font-medium">
                                                            QAR{" "}
                                                            {unitPrice.toFixed(
                                                                2
                                                            )}
                                                        </span>
                                                    </TableCell>

                                                    {/* Total */}
                                                    <TableCell className="py-4 text-right">
                                                        {hasItemDiscount ? (
                                                            <div className="flex flex-col items-end gap-0.5">
                                                                <span className="text-xs text-muted-foreground line-through">
                                                                    QAR{" "}
                                                                    {originalItemTotal.toFixed(
                                                                        2
                                                                    )}
                                                                </span>

                                                                <span className="font-semibold text-green-700">
                                                                    QAR{" "}
                                                                    {finalItemTotal.toFixed(
                                                                        2
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="font-semibold">
                                                                QAR{" "}
                                                                {originalItemTotal.toFixed(
                                                                    2
                                                                )}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* ================================================== */}
                            {/* BOTTOM SECTION */}
                            {/* ================================================== */}

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
                                            order.payments.map(
                                                (payment) => (
                                                    <div
                                                        key={
                                                            payment.id
                                                        }
                                                        className="flex items-center justify-between py-4"
                                                    >
                                                        <div>
                                                            <p className="font-medium">
                                                                {
                                                                    payment.method
                                                                }
                                                            </p>

                                                            {payment.reference && (
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    Ref:{" "}
                                                                    {
                                                                        payment.reference
                                                                    }
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
                                                            ).toFixed(
                                                                2
                                                            )}
                                                        </p>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <p className="py-6 text-sm text-muted-foreground">
                                                No payments
                                                recorded.
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

                                        {totalDiscount > 0 && (
                                            <DiscountSummaryRow
                                                label="Discount"
                                                value={
                                                    totalDiscount
                                                }
                                            />
                                        )}

                                        <Separator />

                                        <div className="flex items-end justify-between pt-1">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Total
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                {totalDiscount >
                                                    0 && (
                                                    <p className="text-sm text-muted-foreground line-through">
                                                        QAR{" "}
                                                        {originalTotal.toFixed(
                                                            2
                                                        )}
                                                    </p>
                                                )}

                                                <p className="text-2xl font-bold tracking-tight">
                                                    QAR{" "}
                                                    {finalTotal.toFixed(
                                                        2
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ================================================== */}
                            {/* NOTES */}
                            {/* ================================================== */}

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
                    </TabsContent>

                    {/* ================================================== */}
                    {/* HISTORY */}
                    {/* ================================================== */}

                    <TabsContent
                        value="history"
                        className="
                            m-0
                            min-h-0
                            flex-1
                            overflow-y-auto
                            overflow-x-hidden
                            p-0
                        "
                    >
                        <OrderHistory
                            orderId={order.id}
                            enabled={open}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

/* ============================================================
   ORDER HISTORY
============================================================ */

function OrderHistory({
    orderId,
    enabled,
}: {
    orderId: number;
    enabled: boolean;
}) {
    const [history, setHistory] = useState<OrderHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled || loaded) {
            return;
        }

        let cancelled = false;

        const loadHistory = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getOrderHistory(orderId);

                if (cancelled) {
                    return;
                }

                setHistory(response.data?.data || []);
                setLoaded(true);
            } catch (err) {
                if (cancelled) {
                    return;
                }

                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load order history."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadHistory();

        return () => {
            cancelled = true;
        };
    }, [enabled, loaded, orderId]);

    /* ============================================================
       LOADING
    ============================================================ */

    if (loading) {
        return (
            <div className="flex min-h-full items-center justify-center px-6">
                <div className="text-center">
                    <History className="mx-auto mb-3 h-8 w-8 animate-pulse text-muted-foreground" />

                    <p className="text-sm font-medium">
                        Loading history...
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Fetching order activity
                    </p>
                </div>
            </div>
        );
    }

    /* ============================================================
       ERROR
    ============================================================ */

    if (error) {
        return (
            <div className="flex min-h-full items-center justify-center px-6">
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
                    <p className="text-sm font-medium text-destructive">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setLoaded(false);
                        }}
                        className="mt-3 text-sm font-medium underline underline-offset-4"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    /* ============================================================
       EMPTY
    ============================================================ */

    if (history.length === 0) {
        return (
            <div className="flex min-h-full items-center justify-center px-6">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <History className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <p className="font-medium">
                        No history yet
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Changes made to this order will appear
                        here.
                    </p>
                </div>
            </div>
        );
    }

    /* ============================================================
       HISTORY LIST
    ============================================================ */

    return (
        <div className="px-6 py-5">
            <div className="mb-5">
                <h3 className="font-semibold">
                    Order Activity
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    A complete record of changes made to this
                    order.
                </p>
            </div>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute bottom-0 left-[15px] top-0 w-px bg-border" />

                <div className="space-y-5">
                    {history.map((entry) => (
                        <HistoryEntry
                            key={entry.id}
                            entry={entry}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   HISTORY ENTRY
============================================================ */

function HistoryEntry({
    entry,
}: {
    entry: OrderHistoryItem;
}) {
    const [expanded, setExpanded] = useState(false);

    const hasDetails =
        Object.keys(entry.old_values || {}).length > 0 ||
        Object.keys(entry.new_values || {}).length > 0;

    return (
        <div className="relative flex gap-4">
            {/* Timeline icon */}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
                <History className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pb-1">
                <div className="rounded-xl border bg-background p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <p className="font-medium">
                                {formatEventName(entry.action)}
                            </p>

                            {entry.description && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {entry.description}
                                </p>
                            )}
                        </div>

                        <span className="shrink-0 text-xs text-muted-foreground">
                            {formatDate(entry.created_at)}
                        </span>
                    </div>

                    {/* User / Time */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {entry.user?.name && (
                            <div className="flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" />

                                <span>
                                    {entry.user.name}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />

                            <span>
                                {new Date(
                                    entry.created_at
                                ).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Reason */}
                    {entry.reason && (
                        <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                Reason
                            </p>

                            <p className="mt-1 text-sm">
                                {entry.reason}
                            </p>
                        </div>
                    )}

                    {/* Details */}
                    {hasDetails && (
                        <div className="mt-3 border-t pt-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setExpanded(
                                        (value) => !value
                                    )
                                }
                                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {expanded ? (
                                    <ChevronDown className="h-3.5 w-3.5" />
                                ) : (
                                    <ChevronRight className="h-3.5 w-3.5" />
                                )}

                                {expanded
                                    ? "Hide details"
                                    : "View details"}
                            </button>

                            {expanded && (
                                <HistoryChanges
                                    oldValues={
                                        entry.old_values
                                    }
                                    newValues={
                                        entry.new_values
                                    }
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   HISTORY CHANGES
============================================================ */

function HistoryChanges({
    oldValues,
    newValues,
}: {
    oldValues?: Record<string, unknown> | null;
    newValues?: Record<string, unknown> | null;
}) {
    const keys = Array.from(
        new Set([
            ...Object.keys(oldValues || {}),
            ...Object.keys(newValues || {}),
        ])
    );

    if (keys.length === 0) {
        return null;
    }

    return (
        <div className="mt-3 overflow-hidden rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30">
                        <TableHead>Field</TableHead>
                        <TableHead>Before</TableHead>
                        <TableHead>After</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {keys.map((key) => {
                        const oldValue =
                            oldValues?.[key];

                        const newValue =
                            newValues?.[key];

                        return (
                            <TableRow key={key}>
                                <TableCell className="font-medium">
                                    {formatFieldName(key)}
                                </TableCell>

                                <TableCell className="max-w-[240px] text-muted-foreground break-words">
                                    {formatHistoryValue(
                                        oldValue
                                    )}
                                </TableCell>

                                <TableCell className="max-w-[240px] break-words">
                                    {formatHistoryValue(
                                        newValue
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

/* ============================================================
   HELPERS
============================================================ */

function formatEventName(action?: string | null) {
    const names: Record<string, string> = {
        order_updated: "Order updated",
        item_updated: "Order item updated",
        item_removed: "Order item removed",
        item_modifiers_changed: "Item modifiers changed",
        item_discount_changed: "Item discount changed",
        order_discount_changed: "Order discount changed",
        order_totals_changed: "Order totals changed",
        payments_changed: "Payments changed",
    };

    if (!action) {
        return "Order updated";
    }

    return (
        names[action] ||
        action
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            )
    );
}

function formatFieldName(value: string) {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
}

function formatHistoryValue(value: unknown) {
    if (value === null || value === undefined) {
        return "—";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

/* ============================================================
   INFO CARD
============================================================ */

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

/* ============================================================
   SUMMARY
============================================================ */

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