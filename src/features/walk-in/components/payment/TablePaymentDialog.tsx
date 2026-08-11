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

import { Button } from "@/components/ui/button";

import {
    Check,
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
} from "@/features/payment-method/payment-method.service";

interface TablePaymentDialogProps {

    open: boolean;

    onClose: () => void;

    session: DiningSession;

    /*
    |--------------------------------------------------------------------------
    | Tell parent that payment succeeded
    |--------------------------------------------------------------------------
    */

    onPaymentSuccess?: (
        paidOrderIds: string[],
        sessionClosed: boolean
    ) => void;
}

export function TablePaymentDialog({
    open,
    onClose,
    session,
    onPaymentSuccess,
}: TablePaymentDialogProps) {

    /*
    |--------------------------------------------------------------------------
    | Zustand
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Payment methods
    |--------------------------------------------------------------------------
    */

    const [
        paymentMethods,
        setPaymentMethods,
    ] = useState<PaymentMethod[]>([]);

    const [
        selectedPaymentMethod,
        setSelectedPaymentMethod,
    ] = useState<string>("");

    /*
    |--------------------------------------------------------------------------
    | Selected orders
    |--------------------------------------------------------------------------
    */

    const [
        selectedOrderIds,
        setSelectedOrderIds,
    ] = useState<string[]>([]);

    /*
    |--------------------------------------------------------------------------
    | Payment state
    |--------------------------------------------------------------------------
    */

    const [
        paying,
        setPaying,
    ] = useState(false);

    const [
        paymentError,
        setPaymentError,
    ] = useState<string | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Load payment methods
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!open) {
            return;
        }

        async function loadPaymentMethods() {

            try {

                const response =
                    await getPaymentMethods();

                const methods =
                    response.data?.data ??
                    response.data ??
                    [];

                setPaymentMethods(
                    methods
                );

                if (
                    methods.length > 0
                ) {

                    setSelectedPaymentMethod(
                        current =>
                            current ||
                            String(
                                methods[0].id
                            )
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to load payment methods:",
                    error
                );

            }

        }

        void loadPaymentMethods();

    }, [open]);

    /*
    |--------------------------------------------------------------------------
    | Session orders
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | Zustand is checked FIRST.
    |
    | If Zustand says completed, the order is NOT payable even if
    | session.orders still contains the old "confirmed" status.
    |
    */

    const orders = useMemo(() => {
        return (session.orders ?? [])
            .filter(
                order =>
                    order.status ===
                    "confirmed"
            )
            .map(order => {
                const id =
                    String(order.id);

                const orderNo =
                    order.order_no ??
                    null;

                const localOrder =
                    storeOrders[id];

                let total =
                    Number(
                        order.total ?? 0
                    );

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

                    /*
                    |--------------------------------------------------------------------------
                    | Human-readable order number
                    |--------------------------------------------------------------------------
                    |
                    | Example:
                    | id      = 154
                    | order_no = "ORD-00154"
                    |
                    */

                    orderNo,

                    total,
                };
            });
    }, [
        session.orders,
        storeOrders,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Remove stale selections
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Toggle order
    |--------------------------------------------------------------------------
    */

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

    }

    /*
    |--------------------------------------------------------------------------
    | Select all
    |--------------------------------------------------------------------------
    */

    function selectAll() {

        if (paying) {
            return;
        }

        setSelectedOrderIds(
            orders.map(
                order =>
                    order.id
            )
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Clear selection
    |--------------------------------------------------------------------------
    */

    function clearSelection() {

        if (paying) {
            return;
        }

        setSelectedOrderIds([]);

    }

    /*
    |--------------------------------------------------------------------------
    | Selected total
    |--------------------------------------------------------------------------
    */

    const selectedTotal =
        useMemo(
            () => {

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
                                order.total
                            ),
                        0
                    );

            },
            [
                orders,
                selectedOrderIds,
            ]
        );

    /*
    |--------------------------------------------------------------------------
    | Continue payment
    |--------------------------------------------------------------------------
    */

    interface TablePaymentResponse {
        message: string;
        sessionId: number;
        sessionStatus: "open" | "billing" | "closed" | "cancelled";
        sessionClosed: boolean;
        orderIds: number[];
        paymentMethodId: number;
        amount: number;
        payments: unknown[];
    }

    async function handleContinue() {

        if (paying) {
            return;
        }

        if (
            selectedOrderIds.length ===
            0
        ) {
            return;
        }

        if (
            !selectedPaymentMethod
        ) {
            return;
        }

        try {

            setPaying(
                true
            );

            setPaymentError(
                null
            );

            /*
            |--------------------------------------------------------------------------
            | Immutable copy
            |--------------------------------------------------------------------------
            */

            const paidOrderIds = [
                ...selectedOrderIds
            ];

            /*
            |--------------------------------------------------------------------------
            | Create payment
            |--------------------------------------------------------------------------
            */

            const response = await createTablePayment({

                sessionId:
                    Number(
                        session.id
                    ),

                orderIds:
                    paidOrderIds.map(
                        Number
                    ),

                amount:
                    selectedTotal,

                paymentMethodId:
                    Number(
                        selectedPaymentMethod
                    ),

            });

            /*
            |--------------------------------------------------------------------------
            | PAYMENT SUCCESS
            |--------------------------------------------------------------------------
            |
            | Update Zustand BEFORE closing the dialog.
            |
            | This immediately changes:
            |
            | orders[id].status
            | active order status
            | cart/order status UI
            |
            */

            paidOrderIds.forEach(
                orderId => {

                    completeOrder(
                        orderId
                    );

                }
            );

            /*
            |--------------------------------------------------------------------------
            | Notify parent
            |--------------------------------------------------------------------------
            |
            | Parent should update DiningSession.orders and session status.
            |
            */

            const data =
                response.data as TablePaymentResponse;

            /*
            |--------------------------------------------------------------------------
            | Notify parent
            |--------------------------------------------------------------------------
            */

            onPaymentSuccess?.(
                data.orderIds.map(
                    String
                ),
                data.sessionClosed
            );

            /*
            |--------------------------------------------------------------------------
            | Clear selection
            |--------------------------------------------------------------------------
            */

            setSelectedOrderIds([]);

            /*
            |--------------------------------------------------------------------------
            | Close
            |--------------------------------------------------------------------------
            */

            onClose();

        } catch (error) {

            console.error(
                "Table payment failed:",
                error
            );

            setPaymentError(

                error instanceof Error
                    ? error.message
                    : "Unable to create table payment."

            );

        } finally {

            setPaying(
                false
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <Dialog

            open={
                open
            }

            onOpenChange={
                value => {

                    if (
                        !value &&
                        !paying
                    ) {

                        onClose();

                    }

                }
            }

        >

            <DialogContent
                className="
                    max-w-3xl
                "
            >

                <DialogHeader>

                    <DialogTitle>
                        Pay Table
                    </DialogTitle>

                </DialogHeader>

                <div
                    className="
                        space-y-4
                    "
                >

                    {/* ================================================= */}
                    {/* TABLE */}
                    {/* ================================================= */}

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
                                font-semibold
                            "
                        >
                            {session.table?.name}
                        </p>

                    </div>

                    {/* ================================================= */}
                    {/* SELECT CONTROLS */}
                    {/* ================================================= */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-semibold
                            "
                        >
                            Select Orders
                        </p>

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
                                    orders.length === 0 ||
                                    paying
                                }
                                onClick={
                                    selectAll
                                }
                            >
                                Select All
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={
                                    paying
                                }
                                onClick={
                                    clearSelection
                                }
                            >
                                Clear
                            </Button>

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* ORDERS */}
                    {/* ================================================= */}

                    <div
                        className="
                            max-h-[350px]
                            space-y-2
                            overflow-y-auto
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

                                        className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    p-3
                    text-left
                    transition
                    hover:bg-muted/50
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "

                                        style={{
                                            borderColor:
                                                selected
                                                    ? "#40332a"
                                                    : undefined,

                                            backgroundColor:
                                                selected
                                                    ? "#f3eadf"
                                                    : undefined,
                                        }}
                                    >

                                        <div
                                            className="
                        flex
                        items-center
                        gap-3
                    "
                                        >

                                            <div
                                                className="
                            flex
                            h-6
                            w-6
                            shrink-0
                            items-center
                            justify-center
                            rounded-md
                            border
                        "
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
                                                    {order.orderNo ??
                                                        order.id}
                                                </p>

                                                <p
                                                    className="
                                text-xs
                                uppercase
                                text-muted-foreground
                            "
                                                >
                                                    {order.status}
                                                </p>

                                            </div>

                                        </div>

                                        <span
                                            className="
                        font-semibold
                    "
                                        >
                                            {Number(
                                                order.total
                                            ).toFixed(2)}
                                            {" "}QAR
                                        </span>

                                    </button>
                                );
                            }
                        )}

                    </div>

                    {/* ================================================= */}
                    {/* TOTAL */}
                    {/* ================================================= */}

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
                                        font-semibold
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
                                        text-xl
                                        font-bold
                                    "
                                >
                                    {selectedTotal.toFixed(2)}
                                    {" "}QAR
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* ERROR */}
                    {/* ================================================= */}

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
                            {paymentError}
                        </div>

                    )}

                    {/* ================================================= */}
                    {/* PAYMENT METHOD */}
                    {/* ================================================= */}

                    <div
                        className="
                            space-y-2
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-semibold
                            "
                        >
                            Payment Method
                        </p>

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-2
                            "
                        >

                            {paymentMethods.map(
                                method => {

                                    const methodId =
                                        String(
                                            method.id
                                        );

                                    const selected =
                                        selectedPaymentMethod ===
                                        methodId;

                                    return (

                                        <button
                                            key={
                                                method.id
                                            }

                                            type="button"

                                            disabled={
                                                paying
                                            }

                                            onClick={() =>
                                                setSelectedPaymentMethod(
                                                    methodId
                                                )
                                            }

                                            className="
                                                rounded-xl
                                                border
                                                p-3
                                                text-sm
                                                font-semibold
                                                transition
                                                hover:bg-muted/50
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
                                            "

                                            style={{
                                                borderColor:
                                                    selected
                                                        ? "#40332a"
                                                        : undefined,

                                                backgroundColor:
                                                    selected
                                                        ? "#f3eadf"
                                                        : undefined,
                                            }}

                                        >

                                            {method.name}

                                        </button>

                                    );

                                }
                            )}

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* PAYMENT */}
                    {/* ================================================= */}

                    <Button

                        type="button"

                        className="
                            w-full
                            rounded-xl
                            p-5
                        "

                        disabled={
                            orders.length === 0 ||
                            selectedOrderIds.length === 0 ||
                            !selectedPaymentMethod ||
                            paying
                        }

                        onClick={
                            handleContinue
                        }

                    >

                        {paying
                            ? "Processing Payment..."
                            : "Continue Payment"}

                    </Button>

                </div>

            </DialogContent>

        </Dialog>

    );
}