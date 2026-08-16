"use client";

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
    Plus,
    ShoppingBag,
    Trash2,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useOrderStore,
} from "@/features/walk-in/store/useOrderStore";

import {
    getDiscountAmount,
    getGrossLineTotal,
    getLineTotal,
} from "@/features/walk-in/utils/cart-price";

import {
    PaymentMethod,
} from "@/types/payment-method";

import {
    getPaymentIcon,
} from "./DynamicIcons";

import {
    PaymentButton,
} from "./PaymentButton";

import {
    getPaymentMethods,
} from "@/features/payment-method/payment-method.service";

import {
    createPayment,
} from "@/features/orders/orders.service";

import {
    toast,
} from "sonner";
import { OrderSource } from "@/types/order-sources";
import { listOrderSources } from "@/features/order-sources/order-sources.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CheckoutDialogProps {

    open: boolean;

    onClose: () => void;

    orderId?: number;

    onPaymentComplete?: (
        result: {
            order_paid: boolean;
            session_closed: boolean;
        }
    ) => void;

}


interface PendingPayment {
    id: string;

    paymentMethodId: number;

    paymentMethodName: string;

    amount: number;

    reference: string;
}

export function CheckoutDialog({

    open,

    onClose,

    orderId,

    onPaymentComplete,

}: CheckoutDialogProps) {

    /*
    |--------------------------------------------------------------------------
    | Store
    |--------------------------------------------------------------------------
    */

    const cart =
        useOrderStore(
            state =>
                state.cart
        );


    const orderDiscount =
        useOrderStore(
            state =>
                state.orderDiscount
        );

    const completeOrder =
        useOrderStore(
            state =>
                state.completeOrder
        );
    const [orderSources, setOrderSources] = useState<OrderSource[]>([]);
    const [orderSourceId, setOrderSourceId] =
        useState<number | null>(null);
    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        paymentMethods,
        setPaymentMethods,
    ] = useState<PaymentMethod[]>([]);


    const [
        selectedPaymentMethodId,
        setSelectedPaymentMethodId,
    ] = useState<number | null>(null);


    const [
        amountInput,
        setAmountInput,
    ] = useState("");


    const [
        reference,
        setReference,
    ] = useState("");


    const [
        payments,
        setPayments,
    ] = useState<PendingPayment[]>([]);


    const [
        error,
        setError,
    ] = useState<string | null>(null);


    /*
    |--------------------------------------------------------------------------
    | Pricing
    |--------------------------------------------------------------------------
    */

    const subtotal =
        useMemo(
            () =>
                cart.reduce(
                    (
                        sum,
                        item
                    ) =>
                        sum +
                        getGrossLineTotal(
                            item
                        ),
                    0
                ),
            [cart]
        );


    const itemDiscount =
        useMemo(
            () =>
                cart.reduce(
                    (
                        sum,
                        item
                    ) =>
                        sum +
                        getDiscountAmount(
                            item
                        ),
                    0
                ),
            [cart]
        );


    const afterItemDiscount =
        Math.max(
            subtotal -
            itemDiscount,
            0
        );


    const orderDiscountAmount =
        useMemo(
            () => {

                if (!orderDiscount) {
                    return 0;
                }


                if (
                    orderDiscount.type ===
                    "percentage"
                ) {

                    return (
                        afterItemDiscount *
                        (
                            Number(
                                orderDiscount.value
                            ) /
                            100
                        )
                    );

                }


                return Math.min(
                    Number(
                        orderDiscount.value
                    ),
                    afterItemDiscount
                );

            },
            [
                orderDiscount,
                afterItemDiscount,
            ]
        );


    const discountAmount =
        itemDiscount +
        orderDiscountAmount;


    const total =
        Math.max(
            afterItemDiscount -
            orderDiscountAmount,
            0
        );


    /*
    |--------------------------------------------------------------------------
    | Payment totals
    |--------------------------------------------------------------------------
    */

    const paidAmount =
        useMemo(
            () =>
                payments.reduce(
                    (
                        sum,
                        payment
                    ) =>
                        sum +
                        Number(
                            payment.amount
                        ),
                    0
                ),
            [payments]
        );


    const remainingAmount =
        Math.max(
            total -
            paidAmount,
            0
        );


    /*
    |--------------------------------------------------------------------------
    | Floating point safe check
    |--------------------------------------------------------------------------
    */

    const isFullyPaid =
        total > 0 &&
        Math.abs(
            remainingAmount
        ) < 0.01;


    /*
    |--------------------------------------------------------------------------
    | Load payment methods
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

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


                } catch (error) {

                    console.error(
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

                    setOrderSources(
                        response.data?.data ??
                        response.data ??
                        []
                    );
                } catch (error) {
                    console.error(
                        "Failed to load order sources",
                        error
                    );

                    toast.error(
                        "Unable to load order sources."
                    );
                }
            }

            loadOrderSources();
            void loadPaymentMethods();

        },
        [open]
    );


    /*
    |--------------------------------------------------------------------------
    | Reset dialog
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            if (!open) {

                setSelectedPaymentMethodId(
                    null
                );

                setAmountInput(
                    ""
                );

                setReference(
                    ""
                );

                setPayments(
                    []
                );

                setError(
                    null
                );

                setLoading(
                    false
                );
                setOrderSourceId(null);

            }

        },
        [open]
    );


    /*
    |--------------------------------------------------------------------------
    | Automatically select first payment method
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            if (
                open &&
                paymentMethods.length > 0 &&
                selectedPaymentMethodId === null
            ) {

                setSelectedPaymentMethodId(
                    paymentMethods[0].id
                );

            }

        },
        [
            open,
            paymentMethods,
            selectedPaymentMethodId,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | Add payment
    |--------------------------------------------------------------------------
    */

    function addPayment() {

        if (loading) {
            return;
        }


        if (
            !selectedPaymentMethodId
        ) {

            toast.error(
                "Please select a payment method."
            );

            return;

        }


        const amount =
            Number(
                amountInput
            );


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            toast.error(
                "Enter a valid payment amount."
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Do not allow payment above remaining
        |--------------------------------------------------------------------------
        */

        if (
            amount >
            remainingAmount +
            0.01
        ) {

            toast.error(
                `Maximum payment is ${remainingAmount.toFixed(2)} QAR.`
            );

            return;

        }


        const method =
            paymentMethods.find(
                item =>
                    item.id ===
                    selectedPaymentMethodId
            );


        if (!method) {

            toast.error(
                "Payment method not found."
            );

            return;

        }


        const payment: PendingPayment = {

            id:
                `${Date.now()}-${Math.random()}`,

            paymentMethodId:
                method.id,

            paymentMethodName:
                method.name,

            amount:
                Number(
                    amount.toFixed(2)
                ),

            reference:
                reference.trim(),

        };


        setPayments(
            current => [
                ...current,
                payment,
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Clear input
        |--------------------------------------------------------------------------
        */

        setAmountInput(
            ""
        );

        setReference(
            ""
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Remove payment
    |--------------------------------------------------------------------------
    */

    function removePayment(
        paymentId: string
    ) {

        if (loading) {
            return;
        }


        setPayments(
            current =>
                current.filter(
                    payment =>
                        payment.id !==
                        paymentId
                )
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Add remaining amount
    |--------------------------------------------------------------------------
    |
    | Useful for quickly paying the remaining amount with
    | the selected method.
    |
    */

    function fillRemaining() {

        if (remainingAmount <= 0) {
            return;
        }


        setAmountInput(
            remainingAmount.toFixed(2)
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Pay
    |--------------------------------------------------------------------------
    */

    async function pay() {

        if (loading) {
            return;
        }


        if (!orderId) {

            toast.error(
                "Order has not been created yet."
            );

            return;

        }


        if (total <= 0) {

            toast.error(
                "Order total must be greater than zero."
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | IMPORTANT
        |--------------------------------------------------------------------------
        |
        | Payment is allowed ONLY when the entire order
        | has been allocated to payments.
        |
        */

        if (!isFullyPaid) {

            toast.error(
                `Remaining amount is ${remainingAmount.toFixed(2)} QAR.`
            );

            return;

        }


        if (payments.length === 0) {

            toast.error(
                "Please add at least one payment."
            );

            return;

        }


        try {

            setLoading(
                true
            );

            setError(
                null
            );


            /*
            |--------------------------------------------------------------------------
            | Send ALL payment splits
            |--------------------------------------------------------------------------
            */

            const response =
                await createPayment(
                    orderId,
                    {
                        order_source_id: orderSourceId,
                        payments:
                            payments.map(
                                payment => ({
                                    payment_method_id:
                                        payment.paymentMethodId,

                                    amount:
                                        Number(
                                            payment.amount.toFixed(2)
                                        ),

                                    ...(payment.reference
                                        ? {
                                            reference:
                                                payment.reference,
                                        }
                                        : {}),
                                })
                            ),
                    }
                );


            /*
            |--------------------------------------------------------------------------
            | Backend result
            |--------------------------------------------------------------------------
            */

            const paymentResult = {

                order_paid:
                    response?.data?.order_paid === true,

                session_closed:
                    response?.data?.session_closed === true,

            };


            /*
            |--------------------------------------------------------------------------
            | Only complete local order if backend says paid
            |--------------------------------------------------------------------------
            */

            if (
                paymentResult.order_paid
            ) {

                const updated =
                    completeOrder(
                        orderId
                    );


                if (!updated) {

                    console.warn(
                        "Payment succeeded but local order was not found.",
                        {
                            backendOrderId:
                                orderId,
                        }
                    );

                }

            }


            /*
            |--------------------------------------------------------------------------
            | Notify parent
            |--------------------------------------------------------------------------
            */

            onPaymentComplete?.(
                paymentResult
            );


            /*
            |--------------------------------------------------------------------------
            | Feedback
            |--------------------------------------------------------------------------
            */

            if (
                paymentResult.session_closed
            ) {

                toast.success(
                    "Payment completed. Dining session closed."
                );

            } else {

                toast.success(
                    "Payment completed successfully."
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Close
            |--------------------------------------------------------------------------
            */

            onClose();


        } catch (error) {

            console.error(
                "Payment error:",
                error
            );


            const message =
                error instanceof Error
                    ? error.message
                    : "Payment failed. Please try again.";


            setError(
                message
            );


            toast.error(
                "Payment failed."
            );


        } finally {

            setLoading(
                false
            );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Close
    |--------------------------------------------------------------------------
    */

    function close() {

        if (loading) {
            return;
        }


        setPayments(
            []
        );

        setAmountInput(
            ""
        );

        setReference(
            ""
        );

        setSelectedPaymentMethodId(
            null
        );

        setError(
            null
        );

        onClose();

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

                    if (!value) {
                        close();
                    }

                }
            }

        >

            <DialogContent

                className="
                !max-w-2xl
                rounded-[32px]
                p-0
                overflow-hidden
                border-0
                shadow-2xl
                max-h-[90vh]
                flex
                flex-col
            "

            >

                {/* HEADER */}

                <div
                    className="
                    bg-primary
                    px-8
                    py-5
                    text-primary-foreground
                "
                >

                    <DialogHeader>

                        <DialogTitle
                            className="
                            text-xl
                            font-semibold
                        "
                        >
                            Complete Payment
                        </DialogTitle>

                        <p
                            className="
                            text-sm
                            opacity-80
                        "
                        >
                            Add one or more payment methods
                        </p>

                    </DialogHeader>

                </div>


                <div
                    className="
                    flex-1
                    min-h-0
                    overflow-y-auto
                    space-y-5
                    p-6
                "
                >

                    {/* ORDER SUMMARY */}

                    <div
                        className="
                        rounded-3xl
                        border
                        p-5
                        space-y-4
                        max-h-72
                        overflow-y-auto
                    "
                    >

                        <div
                            className="
                            flex
                            justify-between
                            items-center
                        "
                        >

                            <h3
                                className="
                                font-bold
                                text-lg
                            "
                            >
                                Order Summary
                            </h3>

                            <span
                                className="
                                rounded-full
                                bg-primary/10
                                px-3
                                py-1
                                text-xs
                                font-semibold
                            "
                            >
                                {cart.length} items
                            </span>

                        </div>


                        {cart.map(
                            item => (

                                <div
                                    key={
                                        item.lineId
                                    }
                                    className="
                                    rounded-2xl
                                    bg-slate-50
                                    p-4
                                "
                                >

                                    <div
                                        className="
                                        flex
                                        justify-between
                                    "
                                    >

                                        <div>

                                            <p
                                                className="
                                                font-semibold
                                            "
                                            >
                                                {
                                                    item
                                                        .menuItem
                                                        .name
                                                }
                                            </p>

                                            <p
                                                className="
                                                text-sm
                                                text-muted-foreground
                                            "
                                            >
                                                Qty{" "}
                                                {
                                                    item.quantity
                                                }
                                            </p>

                                        </div>


                                        <p
                                            className="
                                            font-bold
                                        "
                                        >
                                            {
                                                getLineTotal(
                                                    item
                                                ).toFixed(2)
                                            }{" "}
                                            QAR
                                        </p>

                                    </div>


                                    {item.modifiers.length > 0 && (

                                        <div
                                            className="
                                            mt-3
                                            space-y-1
                                            text-sm
                                            text-muted-foreground
                                        "
                                        >

                                            {item.modifiers.map(
                                                modifier => (

                                                    <div
                                                        key={
                                                            modifier.id
                                                        }
                                                        className="
                                                        flex
                                                        justify-between
                                                    "
                                                    >

                                                        <span>
                                                            +{" "}
                                                            {
                                                                modifier.name
                                                            }
                                                        </span>

                                                        <span>
                                                            {
                                                                Number(
                                                                    modifier.price
                                                                ).toFixed(2)
                                                            }{" "}
                                                            QAR
                                                        </span>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    )}


                                    {item.note && (

                                        <div
                                            className="
                                            mt-3
                                            rounded-xl
                                            bg-yellow-50
                                            px-3
                                            py-2
                                            text-xs
                                            text-yellow-700
                                        "
                                        >
                                            Note:{" "}
                                            {
                                                item.note
                                            }
                                        </div>

                                    )}

                                </div>

                            )
                        )}

                    </div>


                    {/* TOTAL */}

                    <div
                        className="
                        rounded-3xl
                        bg-[#40332a]
                        p-6
                        text-white
                        space-y-3
                    "
                    >

                        <Row
                            label="Subtotal"
                            value={`${subtotal.toFixed(2)} QAR`}
                        />

                        <Row
                            label="Discount"
                            value={`-${discountAmount.toFixed(2)} QAR`}
                            green
                        />

                        <div
                            className="
                            border-t
                            border-white/20
                            pt-3
                            flex
                            justify-between
                            text-xl
                            font-bold
                        "
                        >

                            <span>
                                Total
                            </span>

                            <span>
                                {total.toFixed(2)} QAR
                            </span>

                        </div>

                    </div>


                    {/* PAYMENT METHODS */}

                    <div>

                        <p
                            className="
                            mb-3
                            text-sm
                            font-semibold
                            text-muted-foreground
                        "
                        >
                            Payment Method
                        </p>


                        {paymentMethods.length === 0 ? (

                            <div
                                className="
                                rounded-2xl
                                border
                                p-4
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
                                grid
                                grid-cols-2
                                gap-3
                            "
                            >

                                {paymentMethods.map(
                                    method => (

                                        <PaymentButton

                                            key={
                                                method.id
                                            }

                                            icon={
                                                getPaymentIcon(
                                                    method.code
                                                )
                                            }

                                            label={
                                                method.name
                                            }

                                            active={
                                                selectedPaymentMethodId ===
                                                method.id
                                            }

                                            disabled={
                                                loading
                                            }

                                            onClick={() =>
                                                setSelectedPaymentMethodId(
                                                    method.id
                                                )
                                            }

                                        />

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* ADD PAYMENT */}

                    <div
                        className="
                        rounded-3xl
                        border
                        p-5
                        space-y-4
                    "
                    >

                        <div
                            className="
                            flex
                            items-center
                            justify-between
                        "
                        >

                            <p
                                className="
                                font-semibold
                            "
                            >
                                Add Payment
                            </p>

                            <button
                                type="button"
                                onClick={
                                    fillRemaining
                                }
                                disabled={
                                    loading ||
                                    remainingAmount <= 0
                                }
                                className="
                                text-xs
                                font-semibold
                                text-primary
                                disabled:opacity-40
                            "
                            >
                                Use Remaining
                            </button>

                        </div>


                        <Input

                            type="number"

                            min="0"

                            step="0.01"

                            value={
                                amountInput
                            }

                            onChange={
                                event =>
                                    setAmountInput(
                                        event.target.value
                                    )
                            }

                            disabled={
                                loading ||
                                !selectedPaymentMethodId ||
                                remainingAmount <= 0
                            }

                            placeholder="Payment amount"

                        />


                        <Input

                            value={
                                reference
                            }

                            onChange={
                                event =>
                                    setReference(
                                        event.target.value
                                    )
                            }

                            disabled={
                                loading ||
                                !selectedPaymentMethodId ||
                                remainingAmount <= 0
                            }

                            placeholder="Reference (optional)"

                        />


                        <Button

                            type="button"

                            variant="outline"

                            className="
                            w-full
                            rounded-2xl
                        "

                            disabled={
                                loading ||
                                !selectedPaymentMethodId ||
                                remainingAmount <= 0 ||
                                !amountInput
                            }

                            onClick={
                                addPayment
                            }

                        >

                            <Plus
                                className="
                                mr-2
                                h-4
                                w-4
                            "
                            />

                            Add Payment

                        </Button>

                    </div>


                    {/* PAYMENTS */}

                    {payments.length > 0 && (

                        <div
                            className="
                            rounded-3xl
                            border
                            p-5
                            space-y-3
                        "
                        >

                            <div
                                className="
                                flex
                                justify-between
                                items-center
                            "
                            >

                                <p
                                    className="
                                    font-semibold
                                "
                                >
                                    Payments
                                </p>

                                <p
                                    className="
                                    text-sm
                                    text-muted-foreground
                                "
                                >
                                    {payments.length} payment
                                    {payments.length !== 1
                                        ? "s"
                                        : ""}
                                </p>

                            </div>


                            {payments.map(
                                payment => (

                                    <div
                                        key={
                                            payment.id
                                        }
                                        className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-2xl
                                        bg-slate-50
                                        p-4
                                    "
                                    >

                                        <div>

                                            <p
                                                className="
                                                font-semibold
                                            "
                                            >
                                                {
                                                    payment.paymentMethodName
                                                }
                                            </p>

                                            {payment.reference && (

                                                <p
                                                    className="
                                                    text-xs
                                                    text-muted-foreground
                                                "
                                                >
                                                    Ref:{" "}
                                                    {
                                                        payment.reference
                                                    }
                                                </p>

                                            )}

                                        </div>


                                        <div
                                            className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                        >

                                            <span
                                                className="
                                                font-bold
                                            "
                                            >
                                                {
                                                    payment.amount.toFixed(2)
                                                }{" "}
                                                QAR
                                            </span>


                                            <Button

                                                type="button"

                                                variant="ghost"

                                                size="icon"

                                                disabled={
                                                    loading
                                                }

                                                onClick={() =>
                                                    removePayment(
                                                        payment.id
                                                    )
                                                }

                                            >

                                                <Trash2
                                                    className="
                                                    h-4
                                                    w-4
                                                    text-destructive
                                                "
                                                />

                                            </Button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold">
                                    Order Source
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Select where this order came from
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
                                    const value = event.target.value;

                                    setOrderSourceId(
                                        value === ""
                                            ? null
                                            : Number(value)
                                    );
                                }}
                                disabled={loading}
                                className="
                h-11
                w-full
                appearance-none
                rounded-xl
                border
                border-border
                bg-background
                px-3.5
                pr-10
                text-sm
                font-medium
                outline-none
                transition-all
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

                                {orderSources.map(source => (
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
                right-3.5
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
            "
                            />
                        </div>
                    </div>


                    {/* PAYMENT SUMMARY */}

                    <div
                        className={`
                        rounded-3xl
                        border
                        p-5
                        space-y-3
                        ${isFullyPaid
                                ? "border-green-300 bg-green-50"
                                : "bg-muted/30"
                            }
                    `}
                    >

                        <Row
                            label="Order Total"
                            value={`${total.toFixed(2)} QAR`}
                        />

                        <Row
                            label="Paid"
                            value={`${paidAmount.toFixed(2)} QAR`}
                        />

                        <div
                            className="
                            border-t
                            pt-3
                            flex
                            justify-between
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
                                {remainingAmount.toFixed(2)} QAR
                            </span>

                        </div>


                        {isFullyPaid && (

                            <div
                                className="
                                rounded-xl
                                bg-green-100
                                px-3
                                py-2
                                text-center
                                text-sm
                                font-semibold
                                text-green-700
                            "
                            >
                                Payment complete — ready to pay
                            </div>

                        )}

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div
                            className="
                            rounded-lg
                            bg-red-50
                            px-3
                            py-2
                            text-sm
                            text-red-600
                        "
                        >
                            {error}
                        </div>

                    )}


                    {/* PAY */}

                    <Button

                        disabled={
                            loading ||
                            !orderId ||
                            total <= 0 ||
                            payments.length === 0 ||
                            !isFullyPaid
                        }

                        onClick={
                            pay
                        }

                        className="
                        h-14
                        w-full
                        rounded-2xl
                        text-lg
                        font-bold
                    "

                    >

                        {loading ? (

                            <>

                                <Loader2
                                    className="
                                    mr-2
                                    animate-spin
                                "
                                />

                                Processing...

                            </>

                        ) : !isFullyPaid ? (

                            <>
                                Remaining{" "}
                                {
                                    remainingAmount.toFixed(2)
                                }{" "}
                                QAR
                            </>

                        ) : (

                            <>
                                Pay{" "}
                                {
                                    total.toFixed(2)
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


function Row({

    label,

    value,

    green = false,

}: {

    label: string;

    value: string;

    green?: boolean;

}) {

    return (

        <div
            className="
            flex
            justify-between
            text-sm
        "
        >

            <span>
                {label}
            </span>

            <span
                className={
                    green
                        ? "text-green-400"
                        : ""
                }
            >
                {value}
            </span>

        </div>

    );

}
