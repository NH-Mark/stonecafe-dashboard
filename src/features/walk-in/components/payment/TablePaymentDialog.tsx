
"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Button,
} from "@/components/ui/button";

import {
    Input,
} from "@/components/ui/input";

import {
    Check,
    ChevronDown,
    Loader2,
    Trash2,
} from "lucide-react";

import {
    DiningSession,
} from "@/features/walk-in/dining-session.service";

import {
    useOrderStore,
} from "@/features/walk-in/store/useOrderStore";

import {
    getLineTotal,
} from "@/features/walk-in/utils/cart-price";

import {
    createTablePayment,
} from "../../order.service";

import {
    PaymentMethod,
} from "@/types/payment-method";

import {
    getPaymentMethods,
    listPaymentMethods,
} from "@/features/payment-method/payment-method.service";

import {
    toast,
} from "sonner";
import { OrderSource } from "@/types/order-sources";
import { listOrderSources } from "@/features/order-sources/order-sources.service";

/* ==========================================================================
| Types
|========================================================================== */

interface TablePaymentDialogProps {
    open: boolean;

    onClose: () => void;

    session: DiningSession;

    onPaymentSuccess?: (
        paidOrderIds: string[],
        sessionClosed: boolean
    ) => void;
}

interface PaymentEntry {
    paymentMethodId: number;

    paymentMethodName: string;

    amount: string;

    reference: string;
}

interface TablePaymentResponse {
    message: string;

    sessionId: number;

    sessionStatus:
    | "open"
    | "billing"
    | "closed"
    | "cancelled";

    sessionClosed: boolean;

    orderIds: number[];

    amount: number;

    payments: unknown[];

    paymentCount?: number;

    printJobId?: number | string;

    paymentBatchId?: string;
}

/* ==========================================================================
| Component
|========================================================================== */

export function TablePaymentDialog({
    open,
    onClose,
    session,
    onPaymentSuccess,
}: TablePaymentDialogProps) {

    /* ==========================================================================
    | Zustand
    |========================================================================== */

    const storeOrders =
        useOrderStore(
            state =>
                state.orders
        );

    const completeOrder =
        useOrderStore(
            state =>
                state.completeOrder
        );

    /* ==========================================================================
    | Payment methods
    |========================================================================== */

    const [
        paymentMethods,
        setPaymentMethods,
    ] = useState<PaymentMethod[]>([]);

    /*
    | IDs of selected payment methods.
    |
    | Example:
    |
    | [1, 2]
    |
    | Cash + Card
    */

    const [
        selectedPaymentMethodIds,
        setSelectedPaymentMethodIds,
    ] = useState<number[]>([]);

    const [orderSources, setOrderSources] =
        useState<OrderSource[]>([]);

    const [orderSourceId, setOrderSourceId] =
        useState<number | null>(null);

    /*
    | Payment details for each selected method.
    |
    | Example:
    |
    | {
    |     1: {
    |         paymentMethodId: 1,
    |         paymentMethodName: "Cash",
    |         amount: "10",
    |         reference: ""
    |     },
    |
    |     2: {
    |         paymentMethodId: 2,
    |         paymentMethodName: "Card",
    |         amount: "2",
    |         reference: ""
    |     }
    | }
    */

    const [
        paymentEntries,
        setPaymentEntries,
    ] = useState<
        Record<number, PaymentEntry>
    >({});

    /* ==========================================================================
    | Orders
    |========================================================================== */

    const [
        selectedOrderIds,
        setSelectedOrderIds,
    ] = useState<string[]>([]);

    /* ==========================================================================
    | Payment state
    |========================================================================== */

    const [
        paying,
        setPaying,
    ] = useState(false);

    const [
        paymentError,
        setPaymentError,
    ] = useState<string | null>(null);

    /* ==========================================================================
    | Load payment methods
    |========================================================================== */

    useEffect(() => {
        if (!open) {
            return;
        }

        async function loadPaymentMethods() {
            try {
                const response =
                    await listPaymentMethods();

                const methods =
                    response.data?.data ??
                    response.data ??
                    [];

                setPaymentMethods(
                    Array.isArray(methods)
                        ? methods
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to load payment methods:",
                    error
                );

                toast.error(
                    "Unable to load payment methods."
                );
            }
        }

        async function loadOrderSources() {
            try {
                const response =
                    await listOrderSources();

                const sources =
                    response.data?.data ??
                    response.data ??
                    [];

                setOrderSources(
                    Array.isArray(sources)
                        ? sources
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to load order sources:",
                    error
                );

                toast.error(
                    "Unable to load order sources."
                );
            }
        }

        void loadPaymentMethods();
        void loadOrderSources();
    }, [open]);

    /* ==========================================================================
    | Session orders
    |========================================================================== */

    const orders =
        useMemo(() => {

            return (session.orders ?? [])
                .filter(
                    order =>
                        order.status ===
                        "confirmed"
                )
                .map(order => {

                    const id =
                        String(
                            order.id
                        );

                    const orderNo =
                        order.order_no ??
                        null;

                    const localOrder =
                        storeOrders[id];

                    let total =
                        Number(
                            order.total ?? 0
                        );

                    /*
                    |------------------------------------------------------------------
                    | Use local cart total when available
                    |------------------------------------------------------------------
                    */

                    if (localOrder) {

                        const subtotal =
                            localOrder.cart.reduce(
                                (
                                    sum,
                                    item
                                ) =>
                                    sum +
                                    getLineTotal(
                                        item
                                    ),
                                0
                            );

                        if (
                            localOrder.orderDiscount
                        ) {

                            const discount =
                                localOrder.orderDiscount;

                            if (
                                discount.type ===
                                "percentage"
                            ) {

                                total =
                                    Math.max(
                                        subtotal -
                                        (
                                            subtotal *
                                            Number(
                                                discount.value
                                            ) /
                                            100
                                        ),
                                        0
                                    );

                            } else {

                                total =
                                    Math.max(
                                        subtotal -
                                        Math.min(
                                            Number(
                                                discount.value
                                            ),
                                            subtotal
                                        ),
                                        0
                                    );
                            }

                        } else {

                            total =
                                subtotal;
                        }
                    }

                    return {
                        ...order,

                        id,

                        orderNo,

                        total,
                    };
                });

        }, [
            session.orders,
            storeOrders,
        ]);

    /* ==========================================================================
    | Remove stale order selections
    |========================================================================== */

    useEffect(() => {

        const validIds =
            new Set(
                orders.map(
                    order =>
                        order.id
                )
            );

        setSelectedOrderIds(
            current =>
                current.filter(
                    id =>
                        validIds.has(id)
                )
        );

    }, [orders]);

    /* ==========================================================================
    | Selected order total
    |========================================================================== */

    const selectedTotal =
        useMemo(() => {

            return orders
                .filter(
                    order =>
                        selectedOrderIds.includes(
                            order.id
                        )
                )
                .reduce(
                    (
                        sum,
                        order
                    ) =>
                        sum +
                        Number(
                            order.total ?? 0
                        ),
                    0
                );

        }, [
            orders,
            selectedOrderIds,
        ]);

    /* ==========================================================================
    | Paid amount
    |========================================================================== */

    const paidAmount =
        useMemo(() => {

            return selectedPaymentMethodIds.reduce(
                (
                    total,
                    methodId
                ) => {

                    const entry =
                        paymentEntries[
                        methodId
                        ];

                    if (!entry) {
                        return total;
                    }

                    const amount =
                        Number(
                            entry.amount
                        );

                    if (
                        !Number.isFinite(
                            amount
                        ) ||
                        amount <= 0
                    ) {
                        return total;
                    }

                    return total + amount;
                },
                0
            );

        }, [
            selectedPaymentMethodIds,
            paymentEntries,
        ]);

    /* ==========================================================================
    | Remaining amount
    |========================================================================== */

    const remainingAmount =
        Math.max(
            selectedTotal -
            paidAmount,
            0
        );

    /* ==========================================================================
    | Fully paid
    |========================================================================== */

    const isFullyPaid =
        selectedTotal > 0 &&
        Math.abs(
            selectedTotal -
            paidAmount
        ) < 0.01;

    /* ==========================================================================
    | Toggle order
    |========================================================================== */

    function toggleOrder(
        orderId: string
    ) {

        if (paying) {
            return;
        }

        setSelectedOrderIds(
            current => {

                if (
                    current.includes(
                        orderId
                    )
                ) {

                    return current.filter(
                        id =>
                            id !==
                            orderId
                    );
                }

                return [
                    ...current,
                    orderId,
                ];
            }
        );

        /*
        | Changing orders resets payment
        | allocation because the total changed.
        */

        setSelectedPaymentMethodIds([]);

        setPaymentEntries({});

        setPaymentError(null);
    }

    /* ==========================================================================
    | Select all orders
    |========================================================================== */

    function selectAllOrders() {

        if (paying) {
            return;
        }

        setSelectedOrderIds(
            orders.map(
                order =>
                    order.id
            )
        );

        setSelectedPaymentMethodIds([]);

        setPaymentEntries({});

        setPaymentError(null);
    }

    /* ==========================================================================
    | Clear orders
    |========================================================================== */

    function clearOrders() {

        if (paying) {
            return;
        }

        setSelectedOrderIds([]);

        setSelectedPaymentMethodIds([]);

        setPaymentEntries({});

        setPaymentError(null);
    }

    /* ==========================================================================
    | Toggle payment method
    |========================================================================== */

    function togglePaymentMethod(
        method: PaymentMethod
    ) {

        if (paying) {
            return;
        }

        if (
            selectedOrderIds.length === 0
        ) {

            toast.error(
                "Please select an order first."
            );

            return;
        }

        const methodId =
            Number(
                method.id
            );

        const alreadySelected =
            selectedPaymentMethodIds.includes(
                methodId
            );

        /* --------------------------------------------------------------
        | Remove method
        |--------------------------------------------------------------- */

        if (alreadySelected) {

            setSelectedPaymentMethodIds(
                current =>
                    current.filter(
                        id =>
                            id !==
                            methodId
                    )
            );

            setPaymentEntries(
                current => {

                    const next = {
                        ...current,
                    };

                    delete next[
                        methodId
                    ];

                    return next;
                }
            );

            setPaymentError(null);

            return;
        }

        /* --------------------------------------------------------------
        | Add method
        |--------------------------------------------------------------- */

        setSelectedPaymentMethodIds(
            current => [
                ...current,
                methodId,
            ]
        );

        setPaymentEntries(
            current => ({
                ...current,

                [methodId]: {
                    paymentMethodId:
                        methodId,

                    paymentMethodName:
                        method.name,

                    amount:
                        "",

                    reference:
                        "",
                },
            })
        );

        setPaymentError(null);
    }

    /* ==========================================================================
    | Update amount
    |========================================================================== */

    function updatePaymentAmount(
        methodId: number,
        value: string
    ) {

        if (paying) {
            return;
        }

        /*
        | Allow empty input.
        */

        if (value === "") {

            setPaymentEntries(
                current => {

                    const entry =
                        current[
                        methodId
                        ];

                    if (!entry) {
                        return current;
                    }

                    return {
                        ...current,

                        [methodId]: {
                            ...entry,
                            amount: "",
                        },
                    };
                }
            );

            return;
        }

        const newAmount =
            Number(
                value
            );

        if (
            !Number.isFinite(
                newAmount
            ) ||
            newAmount < 0
        ) {
            return;
        }

        /*
        | Calculate all OTHER payment amounts.
        |
        | This is important when editing:
        |
        | Total = 12
        |
        | Cash = 10
        | Card = 2
        |
        | If user changes Card, we calculate the
        | maximum using Cash only.
        */

        const otherPayments =
            selectedPaymentMethodIds.reduce(
                (
                    total,
                    id
                ) => {

                    if (
                        id ===
                        methodId
                    ) {
                        return total;
                    }

                    const entry =
                        paymentEntries[
                        id
                        ];

                    if (!entry) {
                        return total;
                    }

                    const amount =
                        Number(
                            entry.amount
                        );

                    if (
                        Number.isFinite(
                            amount
                        )
                    ) {
                        return total + amount;
                    }

                    return total;
                },
                0
            );

        const maxAllowed =
            Math.max(
                selectedTotal -
                otherPayments,
                0
            );

        /*
        | Prevent this method from exceeding
        | the total.
        */

        if (
            newAmount >
            maxAllowed
        ) {

            // toast.error(
            //     `Maximum allowed for this payment is ${maxAllowed.toFixed(2)} QAR.`
            // );

            setPaymentEntries(
                current => {

                    const entry =
                        current[
                        methodId
                        ];

                    if (!entry) {
                        return current;
                    }

                    return {
                        ...current,

                        [methodId]: {
                            ...entry,

                            amount:
                                maxAllowed.toFixed(
                                    2
                                ),
                        },
                    };
                }
            );

            return;
        }

        setPaymentEntries(
            current => {

                const entry =
                    current[
                    methodId
                    ];

                if (!entry) {
                    return current;
                }

                return {
                    ...current,

                    [methodId]: {
                        ...entry,

                        amount:
                            value,
                    },
                };
            }
        );

        setPaymentError(null);
    }

    /* ==========================================================================
    | Update reference
    |========================================================================== */

    function updatePaymentReference(
        methodId: number,
        value: string
    ) {

        if (paying) {
            return;
        }

        setPaymentEntries(
            current => {

                const entry =
                    current[
                    methodId
                    ];

                if (!entry) {
                    return current;
                }

                return {
                    ...current,

                    [methodId]: {
                        ...entry,

                        reference:
                            value,
                    },
                };
            }
        );
    }

    /* ==========================================================================
    | Fill remaining
    |========================================================================== */

    function fillPaymentRemaining(
        methodId: number
    ) {

        if (
            paying ||
            selectedOrderIds.length === 0
        ) {
            return;
        }

        if (
            remainingAmount <= 0
        ) {
            return;
        }

        updatePaymentAmount(
            methodId,
            remainingAmount.toFixed(
                2
            )
        );
    }

    /* ==========================================================================
    | Remove payment method
    |========================================================================== */

    function removePaymentMethod(
        methodId: number
    ) {

        if (paying) {
            return;
        }

        setSelectedPaymentMethodIds(
            current =>
                current.filter(
                    id =>
                        id !==
                        methodId
                )
        );

        setPaymentEntries(
            current => {

                const next = {
                    ...current,
                };

                delete next[
                    methodId
                ];

                return next;
            }
        );

        setPaymentError(null);
    }

    /* ==========================================================================
    | Validate payments
    |========================================================================== */

    function validatePayments() {

        if (
            selectedOrderIds.length === 0
        ) {

            toast.error(
                "Please select at least one order."
            );

            return false;
        }

        if (
            selectedPaymentMethodIds.length === 0
        ) {

            toast.error(
                "Please select at least one payment method."
            );

            return false;
        }

        for (
            const methodId
            of selectedPaymentMethodIds
        ) {

            const entry =
                paymentEntries[
                methodId
                ];

            if (!entry) {

                toast.error(
                    "Payment information is incomplete."
                );

                return false;
            }

            const amount =
                Number(
                    entry.amount
                );

            if (
                !Number.isFinite(
                    amount
                ) ||
                amount <= 0
            ) {

                toast.error(
                    `Enter an amount for ${entry.paymentMethodName}.`
                );

                return false;
            }
        }

        if (
            paidAmount >
            selectedTotal +
            0.01
        ) {

            toast.error(
                "Payment amount cannot exceed the order total."
            );

            return false;
        }

        if (
            !isFullyPaid
        ) {

            toast.error(
                `Please pay the remaining ${remainingAmount.toFixed(2)} QAR.`
            );

            return false;
        }

        return true;
    }

    /* ==========================================================================
    | Build API payments
    |========================================================================== */

    function buildPayments() {

        return selectedPaymentMethodIds.map(
            methodId => {

                const entry =
                    paymentEntries[
                    methodId
                    ];

                return {
                    payment_method_id:
                        entry.paymentMethodId,

                    amount:
                        Number(
                            Number(
                                entry.amount
                            ).toFixed(
                                2
                            )
                        ),

                    ...(entry.reference.trim()
                        ? {
                            reference:
                                entry.reference.trim(),
                        }
                        : {}),
                };
            }
        );
    }

    /* ==========================================================================
    | Pay
    |========================================================================== */

    async function handleContinue() {

        if (paying) {
            return;
        }

        if (
            !validatePayments()
        ) {
            return;
        }

        try {

            setPaying(true);

            setPaymentError(null);

            const paidOrderIds =
                [
                    ...selectedOrderIds,
                ];

            const response =
                await createTablePayment({

                    sessionId:
                        Number(
                            session.id
                        ),

                    orderIds:
                        paidOrderIds.map(
                            Number
                        ),
                    orderSourceId:
                     orderSourceId,
                    amount:
                        Number(
                            paidAmount.toFixed(
                                2
                            )
                        ),

                    payments:
                        buildPayments(),
                });

            const data =
                response.data as
                TablePaymentResponse;

            const backendPaidOrderIds =
                data.orderIds?.length
                    ? data.orderIds.map(
                        String
                    )
                    : paidOrderIds;

            /* --------------------------------------------------------------
            | Complete paid orders in Zustand
            |--------------------------------------------------------------- */

            backendPaidOrderIds.forEach(
                orderId => {

                    completeOrder(
                        Number(
                            orderId
                        )
                    );
                }
            );

            /* --------------------------------------------------------------
            | Notify parent
            |--------------------------------------------------------------- */

            onPaymentSuccess?.(
                backendPaidOrderIds,
                data.sessionClosed === true
            );

            /* --------------------------------------------------------------
            | Clear
            |--------------------------------------------------------------- */

            setSelectedOrderIds([]);

            setSelectedPaymentMethodIds([]);

            setPaymentEntries({});

            /* --------------------------------------------------------------
            | Success
            |--------------------------------------------------------------- */

            if (
                data.sessionClosed
            ) {

                toast.success(
                    "Table payment completed. Dining session closed."
                );

            } else {

                toast.success(
                    "Table payment completed successfully."
                );
            }

            onClose();

        } catch (error) {

            console.error(
                "Table payment failed:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to create table payment.";

            setPaymentError(
                message
            );

            toast.error(
                "Table payment failed."
            );

        } finally {

            setPaying(false);
        }
    }

    /* ==========================================================================
    | Close
    |========================================================================== */

    function close() {

        if (paying) {
            return;
        }

        setSelectedOrderIds([]);

        setSelectedPaymentMethodIds([]);

        setPaymentEntries({});

        setPaymentError(null);
        setOrderSourceId(null);

        onClose();
    }

    /* ==========================================================================
    | Render
    |========================================================================== */

    return (
        <Dialog
            open={open}
            onOpenChange={value => {

                if (
                    !value &&
                    !paying
                ) {

                    close();
                }
            }}
        >

            <DialogContent
                className="
                    !max-w-2xl
                    max-h-[90vh]
                    overflow-y-auto
                "
            >

                <DialogHeader>

                    <DialogTitle>
                        Pay Table
                    </DialogTitle>

                </DialogHeader>

                <div
                    className="
                        space-y-5
                    "
                >

                    {/* =====================================================
                    | TABLE
                    ====================================================== */}

                    <div
                        className="
                            rounded-xl
                            border
                            bg-muted/30
                            p-4
                        "
                    >

                        <p
                            className="
                                text-xs
                                text-muted-foreground
                            "
                        >
                            Table
                        </p>

                        <p
                            className="
                                text-lg
                                font-semibold
                            "
                        >
                            {session.table?.name}
                        </p>

                    </div>

                    {/* =====================================================
                    | ORDERS
                    ====================================================== */}

                    <div
                        className="
                            space-y-3
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    Select Orders
                                </p>

                                <p
                                    className="
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Select one or multiple orders
                                </p>

                            </div>

                            <div
                                className="
                                    flex
                                    gap-2
                                "
                            >

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={
                                        paying ||
                                        orders.length === 0
                                    }
                                    onClick={
                                        selectAllOrders
                                    }
                                >
                                    Select All
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={
                                        paying ||
                                        selectedOrderIds.length === 0
                                    }
                                    onClick={
                                        clearOrders
                                    }
                                >
                                    Clear
                                </Button>

                            </div>

                        </div>

                        <div
                            className="
                                space-y-2
                            "
                        >

                            {orders.length === 0 && (

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-dashed
                                        p-6
                                        text-center
                                        text-sm
                                        text-muted-foreground
                                    "
                                >
                                    No confirmed orders available for payment.
                                </div>

                            )}

                            {orders.map(
                                order => {

                                    const selected =
                                        selectedOrderIds.includes(
                                            order.id
                                        );

                                    return (

                                        <button
                                            key={
                                                order.id
                                            }
                                            type="button"
                                            disabled={
                                                paying
                                            }
                                            onClick={() =>
                                                toggleOrder(
                                                    order.id
                                                )
                                            }
                                            className={`
                                                flex
                                                w-full
                                                items-center
                                                justify-between
                                                rounded-xl
                                                border
                                                p-4
                                                text-left
                                                transition
                                                ${selected
                                                    ? "border-primary bg-primary/5"
                                                    : "hover:bg-muted/50"
                                                }
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
                                            `}
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className={`
                                                        flex
                                                        h-6
                                                        w-6
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-md
                                                        border
                                                        ${selected
                                                            ? "border-primary bg-primary text-primary-foreground"
                                                            : ""
                                                        }
                                                    `}
                                                >

                                                    {selected && (

                                                        <Check
                                                            className="
                                                                h-4
                                                                w-4
                                                            "
                                                        />

                                                    )}

                                                </div>

                                                <div>

                                                    <p
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                        "
                                                    >
                                                        Order #
                                                        {
                                                            order.orderNo ??
                                                            order.id
                                                        }
                                                    </p>

                                                    <p
                                                        className="
                                                            text-xs
                                                            uppercase
                                                            text-muted-foreground
                                                        "
                                                    >
                                                        {
                                                            order.status
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                            <span
                                                className="
                                                    font-semibold
                                                "
                                            >
                                                {
                                                    Number(
                                                        order.total
                                                    ).toFixed(
                                                        2
                                                    )
                                                }{" "}
                                                QAR
                                            </span>

                                        </button>
                                    );
                                }
                            )}

                        </div>

                    </div>

                    {/* =====================================================
                    | SELECTED ORDER TOTAL
                    ====================================================== */}

                    <div
                        className="
                            rounded-xl
                            border
                            bg-muted/30
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Selected Orders
                                </p>

                                <p
                                    className="
                                        text-lg
                                        font-bold
                                    "
                                >
                                    {
                                        selectedOrderIds.length
                                    }
                                </p>

                            </div>

                            <div
                                className="
                                    text-right
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Amount Due
                                </p>

                                <p
                                    className="
                                        text-2xl
                                        font-bold
                                    "
                                >
                                    {
                                        selectedTotal.toFixed(
                                            2
                                        )
                                    }{" "}
                                    QAR
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* =====================================================
| ORDER SOURCE
====================================================== */}

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold">
                                    Order Source
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Where did these orders come from?
                                </p>
                            </div>

                            <span className="text-[11px] text-muted-foreground">
                                Optional
                            </span>
                        </div>

                        <div className="relative">
                            <select
                                value={orderSourceId ?? ""}
                                onChange={(event) => {
                                    const value =
                                        event.target.value;

                                    setOrderSourceId(
                                        value === ""
                                            ? null
                                            : Number(value)
                                    );
                                }}
                                disabled={
                                    paying ||
                                    selectedOrderIds.length === 0
                                }
                                className="
                h-10
                w-full
                appearance-none
                rounded-lg
                border
                border-input
                bg-background
                px-3
                pr-9
                text-sm
                outline-none
                transition
                hover:border-primary/40
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10
                disabled:cursor-not-allowed
                disabled:opacity-50
            "
                            >
                                <option value="">
                                    Select order source
                                </option>

                                {orderSources.map((source) => (
                                    <option
                                        key={source.id}
                                        value={source.id}
                                    >
                                        {source.name}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
            "
                            />
                        </div>
                    </div>

                    {/* =====================================================
                    | PAYMENT METHODS
                    ====================================================== */}

                    <div
                        className="
                            space-y-3
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                "
                            >
                                Payment Methods
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                Select one or more methods.
                                Enter how much was paid with each method.
                            </p>

                        </div>

                        {paymentMethods.length === 0 ? (

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-dashed
                                    p-6
                                    text-center
                                    text-sm
                                    text-muted-foreground
                                "
                            >
                                No payment methods available.
                            </div>

                        ) : (

                            <div
                                className="
                                    space-y-3
                                "
                            >

                                {paymentMethods.map(
                                    method => {

                                        const methodId =
                                            Number(
                                                method.id
                                            );

                                        const selected =
                                            selectedPaymentMethodIds.includes(
                                                methodId
                                            );

                                        const entry =
                                            paymentEntries[
                                            methodId
                                            ];

                                        /*
                                        | Amount already entered
                                        | by OTHER methods.
                                        */

                                        const otherPaid =
                                            selectedPaymentMethodIds.reduce(
                                                (
                                                    total,
                                                    id
                                                ) => {

                                                    if (
                                                        id ===
                                                        methodId
                                                    ) {
                                                        return total;
                                                    }

                                                    const other =
                                                        paymentEntries[
                                                        id
                                                        ];

                                                    if (!other) {
                                                        return total;
                                                    }

                                                    const value =
                                                        Number(
                                                            other.amount
                                                        );

                                                    return Number.isFinite(
                                                        value
                                                    )
                                                        ? total + value
                                                        : total;
                                                },
                                                0
                                            );

                                        const methodMaximum =
                                            Math.max(
                                                selectedTotal -
                                                otherPaid,
                                                0
                                            );

                                        return (

                                            <div
                                                key={
                                                    methodId
                                                }
                                                className={`
                                                    rounded-xl
                                                    border-2
                                                    p-4
                                                    transition-all
                                                    ${selected
                                                        ? "border-primary bg-primary/5 shadow-sm"
                                                        : "border-border bg-background"
                                                    }
                                                `}
                                            >

                                                {/* =================================================
                                                | PAYMENT METHOD SELECTOR
                                                ================================================== */}

                                                <button
                                                    type="button"
                                                    disabled={
                                                        paying ||
                                                        selectedOrderIds.length === 0
                                                    }
                                                    onClick={() =>
                                                        togglePaymentMethod(
                                                            method
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        w-full
                                                        items-center
                                                        gap-3
                                                        text-left
                                                    "
                                                >

                                                    <div
                                                        className={`
                                                            flex
                                                            h-7
                                                            w-7
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-md
                                                            border-2
                                                            ${selected
                                                                ? "border-primary bg-primary text-primary-foreground"
                                                                : "border-muted-foreground/40"
                                                            }
                                                        `}
                                                    >

                                                        {selected && (

                                                            <Check
                                                                className="
                                                                    h-5
                                                                    w-5
                                                                "
                                                            />

                                                        )}

                                                    </div>

                                                    <div
                                                        className="
                                                            flex-1
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                font-semibold
                                                            "
                                                        >
                                                            {
                                                                method.name
                                                            }
                                                        </p>

                                                        <p
                                                            className="
                                                                text-xs
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            {selected
                                                                ? "Selected"
                                                                : "Click to select"}
                                                        </p>

                                                    </div>

                                                    {selected && (

                                                        <span
                                                            className="
                                                                rounded-full
                                                                bg-primary/10
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                font-semibold
                                                                text-primary
                                                            "
                                                        >
                                                            Selected
                                                        </span>

                                                    )}

                                                </button>

                                                {/* =================================================
                                                | PAYMENT AMOUNT
                                                |
                                                | IMPORTANT:
                                                | The input is ALWAYS visible.
                                                | It becomes enabled after selecting
                                                | the payment method.
                                                ================================================== */}

                                                <div
                                                    className="
                                                        mt-4
                                                        space-y-3
                                                        border-t
                                                        pt-4
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            justify-between
                                                        "
                                                    >

                                                        <label
                                                            className="
                                                                text-sm
                                                                font-semibold
                                                            "
                                                        >
                                                            Amount
                                                        </label>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                paying ||
                                                                !selected ||
                                                                selectedOrderIds.length === 0 ||
                                                                remainingAmount <= 0
                                                            }
                                                            onClick={() =>
                                                                fillPaymentRemaining(
                                                                    methodId
                                                                )
                                                            }
                                                            className="
                                                                text-xs
                                                                font-semibold
                                                                text-primary
                                                                hover:underline
                                                                disabled:cursor-not-allowed
                                                                disabled:opacity-40
                                                            "
                                                        >
                                                            Use Remaining
                                                        </button>

                                                    </div>

                                                    <div
                                                        className="
                                                            relative
                                                        "
                                                    >

                                                        <Input
                                                            type="number"
                                                            inputMode="decimal"
                                                            min="0"
                                                            max={
                                                                methodMaximum.toFixed(
                                                                    2
                                                                )
                                                            }
                                                            step="0.01"
                                                            value={
                                                                entry?.amount ??
                                                                ""
                                                            }
                                                            onChange={event =>
                                                                updatePaymentAmount(
                                                                    methodId,
                                                                    event.target.value
                                                                )
                                                            }
                                                            disabled={
                                                                paying ||
                                                                !selected ||
                                                                selectedOrderIds.length === 0
                                                            }
                                                            placeholder="0.00"
                                                            className="
                                                                h-12
                                                                pr-16
                                                                text-lg
                                                                font-semibold
                                                            "
                                                        />

                                                        <span
                                                            className="
                                                                pointer-events-none
                                                                absolute
                                                                right-3
                                                                top-1/2
                                                                -translate-y-1/2
                                                                text-sm
                                                                font-medium
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            QAR
                                                        </span>

                                                    </div>

                                                    {selected && (

                                                        <p
                                                            className="
                                                                text-xs
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            Maximum:
                                                            {" "}
                                                            {
                                                                methodMaximum.toFixed(
                                                                    2
                                                                )
                                                            }
                                                            {" "}
                                                            QAR
                                                        </p>

                                                    )}

                                                    {/* =================================================
                                                    | REFERENCE
                                                    ================================================== */}

                                                    <Input
                                                        value={
                                                            entry?.reference ??
                                                            ""
                                                        }
                                                        onChange={event =>
                                                            updatePaymentReference(
                                                                methodId,
                                                                event.target.value
                                                            )
                                                        }
                                                        disabled={
                                                            paying ||
                                                            !selected ||
                                                            selectedOrderIds.length === 0
                                                        }
                                                        placeholder="Reference (optional)"
                                                    />

                                                    {selected && (

                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="
                                                                w-full
                                                                text-destructive
                                                                hover:bg-destructive/10
                                                                hover:text-destructive
                                                            "
                                                            disabled={
                                                                paying
                                                            }
                                                            onClick={() =>
                                                                removePaymentMethod(
                                                                    methodId
                                                                )
                                                            }
                                                        >

                                                            <Trash2
                                                                className="
                                                                    mr-2
                                                                    h-4
                                                                    w-4
                                                                "
                                                            />

                                                            Remove {method.name}

                                                        </Button>

                                                    )}

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </div>

                    {/* =====================================================
                    | PAYMENT SUMMARY
                    ====================================================== */}

                    <div
                        className={`
                            rounded-xl
                            border-2
                            p-5
                            space-y-3
                            ${isFullyPaid
                                ? "border-green-300 bg-green-50"
                                : "bg-muted/30"
                            }
                        `}
                    >

                        <div
                            className="
                                flex
                                justify-between
                                text-sm
                            "
                        >

                            <span>
                                Order Total
                            </span>

                            <span
                                className="
                                    font-semibold
                                "
                            >
                                {
                                    selectedTotal.toFixed(
                                        2
                                    )
                                }{" "}
                                QAR
                            </span>

                        </div>

                        <div
                            className="
                                flex
                                justify-between
                                text-sm
                            "
                        >

                            <span>
                                Paid
                            </span>

                            <span
                                className="
                                    font-semibold
                                    text-green-600
                                "
                            >
                                {
                                    paidAmount.toFixed(
                                        2
                                    )
                                }{" "}
                                QAR
                            </span>

                        </div>

                        <div
                            className="
                                flex
                                justify-between
                                border-t
                                pt-3
                                text-lg
                                font-bold
                            "
                        >

                            <span>
                                Remaining
                            </span>

                            <span
                                className={
                                    isFullyPaid
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {
                                    remainingAmount.toFixed(
                                        2
                                    )
                                }{" "}
                                QAR
                            </span>

                        </div>

                        {/* =================================================
                        | PAYMENT BREAKDOWN
                        ================================================== */}

                        {selectedPaymentMethodIds.length > 0 && (

                            <div
                                className="
                                    mt-3
                                    space-y-2
                                    border-t
                                    pt-3
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        text-muted-foreground
                                    "
                                >
                                    Payment Breakdown
                                </p>

                                {selectedPaymentMethodIds.map(
                                    methodId => {

                                        const entry =
                                            paymentEntries[
                                            methodId
                                            ];

                                        if (!entry) {
                                            return null;
                                        }

                                        return (

                                            <div
                                                key={
                                                    methodId
                                                }
                                                className="
                                                    flex
                                                    justify-between
                                                    text-sm
                                                "
                                            >

                                                <span>
                                                    {
                                                        entry.paymentMethodName
                                                    }
                                                </span>

                                                <span
                                                    className="
                                                        font-semibold
                                                    "
                                                >
                                                    {
                                                        Number(
                                                            entry.amount ||
                                                            0
                                                        ).toFixed(
                                                            2
                                                        )
                                                    }{" "}
                                                    QAR
                                                </span>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                        {isFullyPaid && (

                            <div
                                className="
                                    rounded-lg
                                    bg-green-100
                                    px-3
                                    py-3
                                    text-center
                                    text-sm
                                    font-semibold
                                    text-green-700
                                "
                            >
                                ✓ Payment complete — ready to pay
                            </div>

                        )}

                    </div>

                    {/* =====================================================
                    | ERROR
                    ====================================================== */}

                    {paymentError && (

                        <div
                            className="
                                rounded-xl
                                border
                                border-destructive/30
                                bg-destructive/5
                                p-3
                                text-sm
                                text-destructive
                            "
                        >
                            {
                                paymentError
                            }
                        </div>

                    )}

                    {/* =====================================================
                    | PAY BUTTON
                    ====================================================== */}

                    <Button
                        type="button"
                        className="
                            w-full
                            rounded-xl
                            p-6
                            text-base
                            font-semibold
                        "
                        disabled={
                            orders.length === 0 ||
                            selectedOrderIds.length === 0 ||
                            selectedPaymentMethodIds.length === 0 ||
                            !isFullyPaid ||
                            paying
                        }
                        onClick={
                            handleContinue
                        }
                    >

                        {paying ? (

                            <>

                                <Loader2
                                    className="
                                        mr-2
                                        h-5
                                        w-5
                                        animate-spin
                                    "
                                />

                                Processing Payment...

                            </>

                        ) : !isFullyPaid ? (

                            <>
                                Remaining{" "}
                                {
                                    remainingAmount.toFixed(
                                        2
                                    )
                                }{" "}
                                QAR
                            </>

                        ) : (

                            <>
                                Pay Table{" "}
                                {
                                    selectedTotal.toFixed(
                                        2
                                    )
                                }{" "}
                                QAR
                            </>

                        )}

                    </Button>

                </div>

            </DialogContent>

        </Dialog>
    );
}
