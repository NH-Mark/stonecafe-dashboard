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
    Loader2,
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

    /*
    |--------------------------------------------------------------------------
    | Local state
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
        paymentMethodId,
        setPaymentMethodId,
    ] = useState<number | null>(null);

    const [
        reference,
        setReference,
    ] = useState("");

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
                            ) / 100
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
                        response.data.data ??
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

            void loadPaymentMethods();

        },
        [open]
    );

    /*
    |--------------------------------------------------------------------------
    | Reset
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            if (!open) {

                setPaymentMethodId(
                    null
                );

                setReference("");

                setError(null);

                setLoading(false);

            }

        },
        [open]
    );

    /*
    |--------------------------------------------------------------------------
    | Payment
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

    if (!paymentMethodId) {

        toast.error(
            "Please select a payment method."
        );

        return;
    }

    if (total <= 0) {

        toast.error(
            "Order total must be greater than zero."
        );

        return;
    }

    try {

        setLoading(true);

        setError(null);

        /*
        |--------------------------------------------------------------------------
        | 1. Create payment
        |--------------------------------------------------------------------------
        |
        | Backend is responsible for determining:
        |
        | - whether this order is paid
        | - whether this was the last unpaid order
        | - whether the dining session was closed
        |
        */

        const response =
            await createPayment(
                orderId,
                {
                    payment_method_id:
                        paymentMethodId,

                    amount:
                        Number(
                            total.toFixed(2)
                        ),

                    ...(reference.trim()
                        ? {
                            reference:
                                reference.trim(),
                        }
                        : {}),
                }
            );


        /*
        |--------------------------------------------------------------------------
        | 2. Normalize backend response
        |--------------------------------------------------------------------------
        */

        const paymentResult = {

            order_paid:
                response?.data.order_paid === true,

            session_closed:
                response?.data.session_closed === true,

        };


        /*
        |--------------------------------------------------------------------------
        | 3. Update local Zustand order
        |--------------------------------------------------------------------------
        |
        | The backend payment succeeded, so mark the local order
        | as completed as well.
        |
        */

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

            toast.warning(
                "Payment completed, but the local order status could not be synchronized."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | 4. Notify parent
        |--------------------------------------------------------------------------
        */

        onPaymentComplete?.(
            paymentResult
        );


        /*
        |--------------------------------------------------------------------------
        | 5. User feedback
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
        | 6. Close dialog
        |--------------------------------------------------------------------------
        */

        onClose();

    } catch (error) {

        console.error(
            "Payment error:",
            error
        );

        setError(
            "Payment failed. Please try again."
        );

        toast.error(
            "Payment failed."
        );

    } finally {

        setLoading(false);

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

        setPaymentMethodId(
            null
        );

        setReference("");

        setError(null);

        onClose();

    }

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <Dialog
            open={open}
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
                            Review order and select payment method
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
                                                paymentMethodId ===
                                                method.id
                                            }

                                            disabled={
                                                loading
                                            }

                                            onClick={() =>
                                                setPaymentMethodId(
                                                    method.id
                                                )
                                            }
                                        />

                                    )
                                )}

                            </div>

                        )}

                    </div>

                    {/* REFERENCE */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-semibold
                            "
                        >

                            Reference

                            <span
                                className="
                                    ml-1
                                    font-normal
                                    text-muted-foreground
                                "
                            >
                                Optional
                            </span>

                        </label>

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

                            placeholder="Transaction/reference number"

                            disabled={
                                loading
                            }
                        />

                    </div>

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
                            !paymentMethodId ||
                            !orderId ||
                            total <= 0
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

/*
|--------------------------------------------------------------------------
| Row
|--------------------------------------------------------------------------
*/

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