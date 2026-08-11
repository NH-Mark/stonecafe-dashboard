
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { OrderItem } from "./OrderItem";
import { CheckoutDialog } from "./payment/CheckoutDialog";

import { useOrderStore } from "../store/useOrderStore";

import {
    getDiscountAmount,
    getGrossLineTotal,
    getItemPrice,
} from "../utils/cart-price";

import { Separator } from "@base-ui/react";

import {
    addItemsToOrder,
    createOrder,
} from "../order.service";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OrderCartProps {
    orderId?: string;

    activeOrderNo?: string;

    /**
     * Only used for dine-in orders.
     */
    sessionId?: number;

    /**
     * Called whenever a real backend order ID
     * or a new local order ID is available.
     *
     * orderNo is returned when the backend
     * creates the order.
     */
    onOrderSaved?: (
        orderId: string,
        orderNo?: string | null
    ) => void;

    /**
     * Cart mode.
     */
    mode?: "dine-in" | "takeaway";
}

export function OrderCart({
    orderId,
    activeOrderNo,
    sessionId,
    onOrderSaved,
    mode = "dine-in",
}: OrderCartProps) {
    const [checkoutOpen, setCheckoutOpen] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    /*
    |--------------------------------------------------------------------------
    | Track lines saved during this component lifecycle
    |--------------------------------------------------------------------------
    */

    const [
        locallySavedLineIds,
        setLocallySavedLineIds,
    ] = useState<string[]>([]);

    /*
    |--------------------------------------------------------------------------
    | Zustand
    |--------------------------------------------------------------------------
    */

    const order =
        useOrderStore(
            state =>
                orderId
                    ? state.orders[orderId]
                    : undefined
        );

    const replaceOrderId =
        useOrderStore(
            state =>
                state.replaceOrderId
        );

    const setActiveOrderNo =
        useOrderStore(
            state =>
                state.setActiveOrderNo
        );

    const markItemsSaved =
        useOrderStore(
            state =>
                state.markItemsSaved
        );

    const updateOrderStatus =
        useOrderStore(
            state =>
                state.updateOrderStatus
        );

    const clearSession =
        useOrderStore(
            state =>
                state.clearSession
        );

    const createNewOrder =
        useOrderStore(
            state =>
                state.createNewOrder
        );

    const router = useRouter();

    /*
    |--------------------------------------------------------------------------
    | Order not initialized
    |--------------------------------------------------------------------------
    */

    if (!order) {
        return (
            <div
                className="
                    flex
                    h-full
                    items-center
                    justify-center
                    p-6
                    text-center
                "
            >
                <div>
                    <p
                        className="
                            text-sm
                            font-semibold
                        "
                    >
                        Order not initialized
                    </p>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-muted-foreground
                        "
                    >
                        Select or create an order.
                    </p>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Order data
    |--------------------------------------------------------------------------
    */

    const {
        cart,
        orderDiscount,
        orderNote,
        status,
        savedLineIds,
    } = order;

    /*
    |--------------------------------------------------------------------------
    | Saved line IDs
    |--------------------------------------------------------------------------
    */

    const allSavedLineIds =
        new Set([
            ...savedLineIds,
            ...locallySavedLineIds,
        ]);

    /*
    |--------------------------------------------------------------------------
    | Unsaved items
    |--------------------------------------------------------------------------
    */

    const unsavedItems =
        cart.filter(
            item =>
                !allSavedLineIds.has(
                    item.lineId
                )
        );

    const hasUnsavedItems =
        unsavedItems.length > 0;

    /*
    |--------------------------------------------------------------------------
    | Totals
    |--------------------------------------------------------------------------
    */

    const subtotal =
        cart.reduce(
            (sum, item) =>
                sum +
                getGrossLineTotal(item),
            0
        );

    const itemDiscount =
        cart.reduce(
            (sum, item) =>
                sum +
                getDiscountAmount(item),
            0
        );

    const afterItemDiscount =
        Math.max(
            subtotal -
                itemDiscount,
            0
        );

    const orderDiscountAmount =
        orderDiscount
            ? orderDiscount.type ===
              "percentage"
                ? (
                      afterItemDiscount *
                      Number(
                          orderDiscount.value
                      )
                  ) / 100
                : Math.min(
                      Number(
                          orderDiscount.value
                      ),
                      afterItemDiscount
                  )
            : 0;

    const discountAmount =
        itemDiscount +
        orderDiscountAmount;

    const total =
        Math.max(
            subtotal -
                discountAmount,
            0
        );

    /*
    |--------------------------------------------------------------------------
    | Order state
    |--------------------------------------------------------------------------
    */

    const isDraft =
        orderId?.startsWith("new-") ??
        true;

    /*
    |--------------------------------------------------------------------------
    | Payment state
    |--------------------------------------------------------------------------
    */

    const isPaymentDisabled =
        status === "completed" ||
        status === "cancelled";

    /*
    |--------------------------------------------------------------------------
    | Send To Kitchen
    |--------------------------------------------------------------------------
    */

    async function handleSendToKitchen() {
        if (cart.length === 0) {
            toast.error(
                "Add at least one item."
            );

            return;
        }

        if (
            !isDraft &&
            unsavedItems.length === 0
        ) {
            toast.info(
                "No new items to send."
            );

            return;
        }

        try {
            setSaving(true);

            const itemsToSend =
                isDraft
                    ? cart
                    : unsavedItems;

            /*
            |--------------------------------------------------------------------------
            | Payload
            |--------------------------------------------------------------------------
            */

            const payload = {
                location_id: 1,

                dining_session_id:
                    mode === "dine-in"
                        ? sessionId ?? null
                        : null,

                customer_id: null,

                order_source_id: 1,

                table_id: null,

                order_type:
                    mode === "dine-in"
                        ? "dine_in"
                        : "takeaway",

                items:
                    itemsToSend.map(
                        item => ({
                            menu_item_id:
                                item
                                    .menuItem
                                    .id,

                            quantity:
                                item.quantity,

                            unit_price:
                                getItemPrice(
                                    item
                                ),

                            total_price:
                                getGrossLineTotal(
                                    item
                                ),

                            notes:
                                item.note ||
                                null,

                            modifiers:
                                item.modifiers.map(
                                    modifier => ({
                                        modifier_id:
                                            modifier.id,

                                        quantity: 1,

                                        price:
                                            Number(
                                                modifier.price
                                            ),
                                    })
                                ),

                            discounts:
                                item.discount
                                    ? [
                                          {
                                              discount_id:
                                                  item
                                                      .discount
                                                      .id,

                                              amount:
                                                  getDiscountAmount(
                                                      item
                                                  ),
                                          },
                                      ]
                                    : [],
                        })
                    ),

                notes:
                    orderNote ||
                    null,
            };

            /*
            |--------------------------------------------------------------------------
            | These values will be updated after createOrder()
            |--------------------------------------------------------------------------
            */

            let savedOrderId =
                Number(orderId);

            let savedOrderNo:
                | string
                | null =
                activeOrderNo ??
                null;

            /*
            |--------------------------------------------------------------------------
            | CREATE ORDER
            |--------------------------------------------------------------------------
            */

            if (isDraft) {
                const response =
                    await createOrder({
                        ...payload,

                        subtotal,

                        discount_amount:
                            discountAmount,

                        tax_amount: 0,

                        service_charge: 0,

                        total_amount: total,

                        discounts:
                            orderDiscount
                                ? [
                                      {
                                          discount_id:
                                              orderDiscount.id,

                                          amount:
                                              orderDiscountAmount,
                                      },
                                  ]
                                : [],
                    });

                /*
                |--------------------------------------------------------------------------
                | Backend response
                |--------------------------------------------------------------------------
                */

                const savedOrder =
                    response.data?.data ??
                    response.data;

                if (!savedOrder) {
                    throw new Error(
                        "Order data was not returned."
                    );
                }

                /*
                |--------------------------------------------------------------------------
                | Get backend order ID
                |--------------------------------------------------------------------------
                */

                savedOrderId =
                    Number(
                        savedOrder.id
                    );

                /*
                |--------------------------------------------------------------------------
                | Get backend order number
                |--------------------------------------------------------------------------
                |
                | Supports both:
                |
                | order_no
                | orderNo
                |
                |--------------------------------------------------------------------------
                */

                savedOrderNo =
                    savedOrder.order_no ??
                    savedOrder.orderNo ??
                    null;

                if (!savedOrderId) {
                    throw new Error(
                        "Order ID was not returned."
                    );
                }

                /*
                |--------------------------------------------------------------------------
                | Replace local draft ID with backend ID
                |--------------------------------------------------------------------------
                */

                replaceOrderId(
                    orderId!,
                    String(
                        savedOrderId
                    )
                );

                /*
                |--------------------------------------------------------------------------
                | IMPORTANT:
                |
                | Update activeOrderNo in Zustand.
                |
                | This makes the header immediately show:
                |
                | Order #12345
                |--------------------------------------------------------------------------
                */

                setActiveOrderNo(
                    savedOrderNo
                );

                /*
                |--------------------------------------------------------------------------
                | Mark all sent items as saved
                |--------------------------------------------------------------------------
                */

                markItemsSaved(
                    String(
                        savedOrderId
                    ),
                    itemsToSend.map(
                        item =>
                            item.lineId
                    )
                );

                /*
                |--------------------------------------------------------------------------
                | Order is now confirmed
                |--------------------------------------------------------------------------
                */

                updateOrderStatus(
                    String(
                        savedOrderId
                    ),
                    "confirmed"
                );
            } else {
                /*
                |--------------------------------------------------------------------------
                | ADD ITEMS TO EXISTING ORDER
                |--------------------------------------------------------------------------
                */

                await addItemsToOrder(
                    Number(orderId),
                    {
                        items:
                            payload.items,
                    }
                );

                /*
                |--------------------------------------------------------------------------
                | Mark newly-added items as saved
                |--------------------------------------------------------------------------
                */

                markItemsSaved(
                    String(orderId),
                    itemsToSend.map(
                        item =>
                            item.lineId
                    )
                );

                /*
                |--------------------------------------------------------------------------
                | Existing order remains confirmed
                |--------------------------------------------------------------------------
                */

                updateOrderStatus(
                    String(orderId),
                    "confirmed"
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Tell parent the real backend order ID + order number
            |--------------------------------------------------------------------------
            */

            onOrderSaved?.(
                String(
                    savedOrderId
                ),
                savedOrderNo
            );

            toast.success(
                isDraft
                    ? "Order sent to kitchen"
                    : "New items sent to kitchen"
            );
        } catch (error) {
            console.error(
                "Failed to save order:",
                error
            );

            toast.error(
                "Unable to send items to kitchen"
            );
        } finally {
            setSaving(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Payment complete
    |--------------------------------------------------------------------------
    */

    function handlePaymentComplete(
        result: {
            order_paid: boolean;
            session_closed: boolean;
        }
    ) {
        /*
        |--------------------------------------------------------------------------
        | Payment failed
        |--------------------------------------------------------------------------
        */

        if (!result.order_paid) {
            toast.error(
                "Payment was not completed."
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Mark paid order completed
        |--------------------------------------------------------------------------
        */

        if (
            orderId &&
            !orderId.startsWith("new-")
        ) {
            updateOrderStatus(
                String(orderId),
                "completed"
            );
        }

        /*
        |--------------------------------------------------------------------------
        | TAKEAWAY
        |--------------------------------------------------------------------------
        */

        if (mode === "takeaway") {
            setCheckoutOpen(false);

            /*
            |--------------------------------------------------------------------------
            | Create a completely fresh local takeaway order.
            |--------------------------------------------------------------------------
            */

            const newOrderId =
                createNewOrder();

            /*
            |--------------------------------------------------------------------------
            | New local order has no backend order number yet.
            |--------------------------------------------------------------------------
            */

            setActiveOrderNo(
                null
            );

            onOrderSaved?.(
                newOrderId,
                null
            );

            setLocallySavedLineIds(
                []
            );

            toast.success(
                "Payment completed. New takeaway order ready."
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | DINE-IN
        |--------------------------------------------------------------------------
        */

        setCheckoutOpen(false);

        /*
        |--------------------------------------------------------------------------
        | Session completely closed
        |--------------------------------------------------------------------------
        */

        if (
            result.session_closed
        ) {
            clearSession();

            router.replace(
                "/walk-in/tables"
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Session remains open
        |--------------------------------------------------------------------------
        */

        toast.success(
            "Payment completed."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div
            className="
                flex
                h-full
                min-h-0
                flex-col
                overflow-hidden
                rounded-3xl
                bg-white
                shadow-sm
            "
        >
            {/* HEADER */}

            <div
                className="
                    shrink-0
                    border-b
                    p-5
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
                        <h2
                            className="
                                text-xl
                                font-bold
                            "
                        >
                            {isDraft
                                ? mode ===
                                  "takeaway"
                                    ? "Takeaway Order"
                                    : "New Order"
                                : activeOrderNo
                                  ? `Order #${activeOrderNo}`
                                  : `Order #${orderId}`}
                        </h2>

                        <p
                            className="
                                text-sm
                                text-muted-foreground
                            "
                        >
                            {cart.length} items
                        </p>
                    </div>

                    {!isDraft && (
                        <span
                            className="
                                rounded-full
                                bg-green-100
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                uppercase
                            "
                        >
                            {status}
                        </span>
                    )}
                </div>
            </div>

            {/* ITEMS */}

            <div
                className="
                    min-h-0
                    flex-1
                    space-y-3
                    overflow-y-auto
                    p-5
                "
            >
                {cart.length === 0 ? (
                    <div
                        className="
                            flex
                            h-full
                            items-center
                            justify-center
                            text-sm
                            text-muted-foreground
                        "
                    >
                        No items added
                    </div>
                ) : (
                    cart.map(
                        item => (
                            <OrderItem
                                key={
                                    item.lineId
                                }
                                item={
                                    item
                                }
                            />
                        )
                    )
                )}
            </div>

            {/* NOTE */}

            {orderNote && (
                <div
                    className="
                        m-3
                        shrink-0
                        rounded-xl
                        border
                        bg-yellow-50
                        p-3
                        text-xs
                        text-yellow-800
                    "
                >
                    <p
                        className="
                            font-semibold
                        "
                    >
                        Order Note
                    </p>

                    <p
                        className="
                            mt-1
                        "
                    >
                        {orderNote}
                    </p>
                </div>
            )}

            {/* FOOTER */}

            <div
                className="
                    shrink-0
                    space-y-4
                    border-t
                    bg-white
                    p-5
                "
            >
                <div
                    className="
                        flex
                        justify-between
                        text-sm
                    "
                >
                    <span>
                        Subtotal
                    </span>

                    <span>
                        {subtotal.toFixed(
                            2
                        )}{" "}
                        QAR
                    </span>
                </div>

                {discountAmount > 0 && (
                    <div
                        className="
                            flex
                            justify-between
                            text-sm
                            text-green-600
                        "
                    >
                        <span>
                            Discount
                        </span>

                        <span>
                            -
                            {discountAmount.toFixed(
                                2
                            )}{" "}
                            QAR
                        </span>
                    </div>
                )}

                <Separator />

                <div
                    className="
                        flex
                        justify-between
                        text-lg
                        font-bold
                    "
                >
                    <span>
                        Total
                    </span>

                    <span>
                        {total.toFixed(
                            2
                        )}{" "}
                        QAR
                    </span>
                </div>

                {/* ACTION */}

                {cart.length === 0 ? (
                    <Button
                        disabled
                        className="
                            h-12
                            w-full
                            rounded-xl
                            text-base
                        "
                    >
                        Add Items to Order
                    </Button>
                ) : hasUnsavedItems ? (
                    <Button
                        disabled={
                            saving
                        }
                        onClick={
                            handleSendToKitchen
                        }
                        className="
                            h-12
                            w-full
                            rounded-xl
                            text-base
                        "
                    >
                        {saving
                            ? "Sending to Kitchen..."
                            : isDraft
                              ? "Send to Kitchen"
                              : "Send New Items"}
                    </Button>
                ) : (
                    <Button
                        disabled={
                            isPaymentDisabled ||
                            !orderId ||
                            orderId.startsWith(
                                "new-"
                            )
                        }
                        onClick={() =>
                            setCheckoutOpen(
                                true
                            )
                        }
                        className="
                            h-12
                            w-full
                            rounded-xl
                            bg-green-900
                            text-base
                            hover:bg-green-800
                        "
                    >
                        {status ===
                        "completed"
                            ? "Payment Completed"
                            : status ===
                                "cancelled"
                              ? "Order Cancelled"
                              : "Payment"}
                    </Button>
                )}

                {/* CHECKOUT */}

                {checkoutOpen && (
                    <CheckoutDialog
                        open={
                            checkoutOpen
                        }
                        onClose={() =>
                            setCheckoutOpen(
                                false
                            )
                        }
                        orderId={Number(
                            orderId
                        )}
                        onPaymentComplete={
                            handlePaymentComplete
                        }
                    />
                )}
            </div>
        </div>
    );
}
