"use client";


import { Button } from "@/components/ui/button";

import {
    Minus,
    Plus,
    Pencil,
    Trash2,
    Tag,
    MessageSquare
} from "lucide-react";


import { CartItem } from "../cart.types";

import {
    getLineTotal
} from "../utils/cart-price";


import { useOrderStore } from "../store/useOrderStore";

import { useModifierDialog } from "../store/useModifierDialog";

import { useState } from "react";

import { DiscountDialog } from "./discount/DiscountDialog";



export function OrderItem({

    item

}: {

    item: CartItem

}) {


    const increaseQty =
        useOrderStore(
            state => state.increaseQty
        );


    const decreaseQty =
        useOrderStore(
            state => state.decreaseQty
        );


    const removeItem =
        useOrderStore(
            state => state.removeItem
        );



    const openEditDialog =
        useModifierDialog(
            state => state.openEditDialog
        );



    const [discountOpen,setDiscountOpen] =
        useState(false);



    const total =
        getLineTotal(item);



    return (

        <div
            className="
                rounded-3xl
                border
                bg-white
                p-4
                space-y-4
                shadow-sm
            "
        >


            {/* Discount Dialog */}

            <DiscountDialog

                open={discountOpen}

                onClose={()=>setDiscountOpen(false)}

                lineId={item.lineId}

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


                    <h3
                        className="
                            font-bold
                            text-base
                        "
                    >
                        {item.menuItem.name}
                    </h3>



                    {
                        item.modifiers.length > 0 &&

                        <div
                            className="
                                mt-2
                                space-y-1
                                text-xs
                                text-muted-foreground
                            "
                        >

                            {
                                item.modifiers.map(mod => (

                                    <div
                                        key={mod.id}
                                    >

                                        + {mod.name}

                                    </div>

                                ))
                            }


                        </div>

                    }



                    {
                        item.note && (

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

                        )
                    }




                    {
                        item.discount && (

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

                                    {
                                        item.discount.type === "percentage"

                                        ?

                                        `${item.discount.value}%`

                                        :

                                        `${item.discount.value} QAR`

                                    }

                                </span>


                            </div>

                        )
                    }



                </div>




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

                            if(item.quantity === 1){

                                removeItem(
                                    item.lineId
                                );

                            }
                            else{

                                decreaseQty(
                                    item.lineId
                                );

                            }

                        }}

                    >

                        {
                            item.quantity === 1

                            ?

                            <Trash2
                                className="h-4 w-4"
                            />

                            :

                            <Minus
                                className="h-4 w-4"
                            />

                        }


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
                            className="h-4 w-4"
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

                    <Button

                        size="icon"

                        variant="ghost"

                        className="
                            rounded-xl
                        "

                        onClick={() =>
                            setDiscountOpen(true)
                        }

                    >

                        <Tag
                            className="h-4 w-4"
                        />

                    </Button>



                    <Button

                        size="icon"

                        variant="ghost"

                        className="
                            rounded-xl
                        "

                        onClick={() =>
                            openEditDialog(item)
                        }

                    >

                        <Pencil
                            className="h-4 w-4"
                        />

                    </Button>


                </div>


            </div>


        </div>

    );

}