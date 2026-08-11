"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
    Minus,
    Plus,
    Pencil,
    Trash2,
    Tag,
    MessageSquare,
    Lock,
} from "lucide-react";

import { CartItem } from "../cart.types";

import {
    getLineTotal,
} from "../utils/cart-price";

import {
    useOrderStore,
} from "../store/useOrderStore";

import {
    useModifierDialog,
} from "../store/useModifierDialog";

import {
    DiscountDialog,
} from "./discount/DiscountDialog";


export function OrderItem({

    item,

}: {

    item: CartItem;

}) {

    /*
    |--------------------------------------------------------------------------
    | Store
    |--------------------------------------------------------------------------
    */

    const increaseQty =
        useOrderStore(
            state =>
                state.increaseQty
        );


    const decreaseQty =
        useOrderStore(
            state =>
                state.decreaseQty
        );


    const removeItem =
        useOrderStore(
            state =>
                state.removeItem
        );


    const openEditDialog =
        useModifierDialog(
            state =>
                state.openEditDialog
        );


    /*
    |--------------------------------------------------------------------------
    | Find current order
    |--------------------------------------------------------------------------
    */

    const order =
        useOrderStore(
            state => {

                if (
                    !state.activeOrderId
                ) {
                    return null;
                }

                return state.orders[
                    state.activeOrderId
                ];
            }
        );


    /*
    |--------------------------------------------------------------------------
    | Discount dialog
    |--------------------------------------------------------------------------
    */

    const [
        discountOpen,
        setDiscountOpen,
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Price
    |--------------------------------------------------------------------------
    */

    const total =
        getLineTotal(
            item
        );


    /*
    |--------------------------------------------------------------------------
    | Saved / locked state
    |--------------------------------------------------------------------------
    |
    | If this lineId exists inside savedLineIds,
    | the item has already been sent to the kitchen.
    |
    */

    const isSaved =
        order?.savedLineIds?.includes(
            item.lineId
        ) ?? false;


    /*
    |--------------------------------------------------------------------------
    | Modifier / note editing
    |--------------------------------------------------------------------------
    */

    const canEditModifier =
        !isSaved;


    /*
    |--------------------------------------------------------------------------
    | Edit modifier
    |--------------------------------------------------------------------------
    */

    function handleEditModifier() {

        if (
            !canEditModifier
        ) {
            return;
        }

        openEditDialog(
            item
        );
    }


    return (

        <div
            className="
                space-y-4
                rounded-3xl
                border
                bg-white
                p-4
                shadow-sm
            "
        >

            {/* Discount Dialog */}

            <DiscountDialog

                open={
                    discountOpen
                }

                onClose={() =>
                    setDiscountOpen(
                        false
                    )
                }

                lineId={
                    item.lineId
                }

                type="item"

            />


            {/* Item Header */}

            <div
                className="
                    flex
                    justify-between
                    gap-4
                "
            >

                <div
                    className="
                        flex-1
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <h3
                            className="
                                text-base
                                font-bold
                            "
                        >
                            {item.menuItem.name}
                        </h3>


                        {isSaved && (

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    rounded-full
                                    bg-gray-100
                                    px-2
                                    py-1
                                    text-[10px]
                                    font-semibold
                                    text-gray-500
                                "
                            >

                                <Lock
                                    className="
                                        h-3
                                        w-3
                                    "
                                />

                                Sent

                            </span>

                        )}

                    </div>


                    {/* Modifiers */}

                    {item.modifiers.length > 0 && (

                        <div
                            className="
                                mt-2
                                space-y-1
                                text-xs
                                text-muted-foreground
                            "
                        >

                            {item.modifiers.map(
                                modifier => (

                                    <div
                                        key={
                                            modifier.id
                                        }
                                    >

                                        + {modifier.name}

                                        {Number(
                                            modifier.price
                                        ) > 0 && (

                                            <span>
                                                {" "}
                                                (
                                                +
                                                {Number(
                                                    modifier.price
                                                ).toFixed(2)}
                                                {" "}
                                                QAR
                                                )
                                            </span>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {/* Note */}

                    {item.note && (

                        <div
                            className="
                                mt-2
                                flex
                                gap-2
                                rounded-xl
                                bg-yellow-50
                                p-2
                                text-xs
                                text-yellow-800
                            "
                        >

                            <MessageSquare
                                className="
                                    h-4
                                    w-4
                                "
                            />

                            <span>
                                {item.note}
                            </span>

                        </div>

                    )}


                    {/* Discount */}

                    {item.discount && (

                        <div
                            className="
                                mt-3
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-green-50
                                px-3
                                py-2
                                text-xs
                                text-green-700
                            "
                        >

                            <Tag
                                className="
                                    h-3
                                    w-3
                                "
                            />

                            <span>

                                {item.discount.name}

                                {" - "}

                                {item.discount.type ===
                                "percentage"

                                    ? `${item.discount.value}%`

                                    : `${item.discount.value} QAR`}

                            </span>

                        </div>

                    )}

                </div>


                {/* Total */}

                <div
                    className="
                        text-right
                    "
                >

                    <p
                        className="
                            text-lg
                            font-bold
                        "
                    >
                        {total.toFixed(2)}
                    </p>

                    <p
                        className="
                            text-xs
                            text-muted-foreground
                        "
                    >
                        QAR
                    </p>

                </div>

            </div>


            {/* Bottom Controls */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-t
                    pt-3
                "
            >

                {/* Quantity */}

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <Button

                        size="icon"

                        variant="outline"

                        className="
                            rounded-xl
                        "

                        onClick={() => {

                            if (
                                item.quantity === 1
                            ) {

                                removeItem(
                                    item.lineId
                                );

                            } else {

                                decreaseQty(
                                    item.lineId
                                );

                            }

                        }}

                    >

                        {item.quantity === 1 ? (

                            <Trash2
                                className="
                                    h-4
                                    w-4
                                "
                            />

                        ) : (

                            <Minus
                                className="
                                    h-4
                                    w-4
                                "
                            />

                        )}

                    </Button>


                    <span
                        className="
                            w-8
                            text-center
                            font-bold
                        "
                    >
                        {item.quantity}
                    </span>


                    <Button

                        size="icon"

                        variant="outline"

                        className="
                            rounded-xl
                        "

                        onClick={() =>
                            increaseQty(
                                item.lineId
                            )
                        }

                    >

                        <Plus
                            className="
                                h-4
                                w-4
                            "
                        />

                    </Button>

                </div>


                {/* Actions */}

                <div
                    className="
                        flex
                        gap-1
                    "
                >

                    {/* Discount */}

                    <Button

                        size="icon"

                        variant="ghost"

                        className="
                            rounded-xl
                        "

                        onClick={() =>
                            setDiscountOpen(
                                true
                            )
                        }

                    >

                        <Tag
                            className="
                                h-4
                                w-4
                            "
                        />

                    </Button>


                    {/* Modifier / Note Edit */}

                    <Button

                        size="icon"

                        variant="ghost"

                        disabled={
                            !canEditModifier
                        }

                        className="
                            rounded-xl
                        "

                        title={
                            isSaved
                                ? "This item has already been sent to the kitchen"
                                : "Edit modifier and note"
                        }

                        onClick={
                            handleEditModifier
                        }

                    >

                        {isSaved ? (

                            <Lock
                                className="
                                    h-4
                                    w-4
                                "
                            />

                        ) : (

                            <Pencil
                                className="
                                    h-4
                                    w-4
                                "
                            />

                        )}

                    </Button>

                </div>

            </div>


            {/* Locked message */}

            {/* {isSaved && (

                <p
                    className="
                        border-t
                        pt-2
                        text-[11px]
                        text-muted-foreground
                    "
                >
                    Modifier and note cannot be edited after
                    the item has been sent to the kitchen.
                </p>

            )} */}

        </div>

    );
}