import { Button } from "@/components/ui/button";
import { OrderItem } from "./OrderItem";
import { useOrderStore } from "../store/useOrderStore";
import { getLineTotal } from "../utils/cart-price";
import { Separator } from "@base-ui/react";
import { useState } from "react";
import { CheckoutDialog } from "./order/checkout/CheckoutDialog";


export function OrderCart() {
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const cart =
        useOrderStore(
            state => state.cart
        );


    const orderDiscount =
        useOrderStore(
            state => state.orderDiscount
        );

    const orderNote =
        useOrderStore(
            state => state.orderNote
        );


    const subtotal =
        cart.reduce(
            (sum, item) =>
                sum + getLineTotal(item),
            0
        );


    const discountAmount =

        orderDiscount

            ?

            orderDiscount.type === "percentage"

                ?

                subtotal *
                (Number(orderDiscount.value) / 100)

                :

                Number(orderDiscount.value)

            :

            0;



    const total =
        Math.max(
            subtotal - discountAmount,
            0
        );


    return (

        <div
            className="
                flex
                h-full
                min-h-0
                flex-col
                rounded-3xl
                bg-white
                shadow-sm
                overflow-hidden
            "
        >

            {/* Header */}
            <div
                className="
                    shrink-0
                    border-b
                    p-5
                "
            >

                <h2 className="text-xl font-bold">
                    Current Order
                </h2>

                <p className="text-sm text-muted-foreground">
                    {cart.length} items
                </p>

            </div>



            {/* Cart Items Scroll Area */}
            <div
                className="
                    min-h-0
                    flex-1
                    space-y-3
                    overflow-y-auto
                    p-5
                "
            >

                {
                    cart.length === 0 ?

                        (
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
                        )

                        :

                        cart.map(item => (

                            <OrderItem

                                key={item.lineId}

                                item={item}

                            />

                        ))
                }

            </div>

            {
                orderNote && (

                    <div
                        className="
                    m-3
                    rounded-xl
                    border
                    bg-yellow-50
                    p-2
                    text-xs
                    text-yellow-800
                    
                "
                    >
                        <p className="font-semibold">
                            Order Note
                        </p>

                        <p>
                            {orderNote}
                        </p>
                    </div>

                )
            }


            {/* Footer Fixed */}
            <div
                className="
                    shrink-0
                    space-y-4
                    border-t
                    bg-white
                    p-5
                "
            >

                <div className="flex justify-between">

                    <span>
                        Subtotal
                    </span>


                    <span>
                        {subtotal.toFixed(2)} QAR
                    </span>

                </div>


                {
                    orderDiscount && (

                        <div
                            className="
            flex
            justify-between
            text-green-600
            "
                        >

                            <span>
                                Discount ({orderDiscount.name})
                            </span>


                            <span>
                                -
                                {discountAmount.toFixed(2)}
                                QAR
                            </span>

                        </div>

                    )
                }


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
                        {total.toFixed(2)} QAR
                    </span>

                </div>



                <Button
                    disabled={cart.length === 0}
                    onClick={() => setCheckoutOpen(true)}
                    className="
                        h-12
                        w-full
                        rounded-xl
                        text-base
                    "
                >
                    {
                        cart.length === 0
                            ? "Add Items to Checkout"
                            : "Checkout"
                    }
                </Button>
                <CheckoutDialog
                    open={checkoutOpen}
                    onClose={() => setCheckoutOpen(false)}
                />


            </div>


        </div>

    );

}