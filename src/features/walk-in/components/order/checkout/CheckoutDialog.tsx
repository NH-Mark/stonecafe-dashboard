"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
    CreditCard,
    Banknote,
    Smartphone,
    Loader2
} from "lucide-react";

import { useEffect, useState } from "react";

import { useOrderStore } from "@/features/walk-in/store/useOrderStore";

import {
    getDiscountAmount,
    getGrossLineTotal,
    getItemPrice,
    getLineTotal
} from "@/features/walk-in/utils/cart-price";

import { createOrder } from "@/features/walk-in/order.service";
import { PaymentMethod } from "@/types/payment-method";
import { getPaymentIcon } from "./DynamicIcons";
import { PaymentButton } from "./PaymentButton";
import { getPaymentMethods } from "@/features/payment-method/payment-method.service";
import { OrderType } from "@/types/order-type";
import { getOrderTypes } from "@/features/sales/sales.service";
import { toast } from "sonner";
import { printReceipt } from "@/features/printer/receipt";


export function CheckoutDialog({

    open,

    onClose

}: {
    open: boolean;

    onClose: () => void;

}) {


    const [loading, setLoading] =
        useState(false);

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<number | null>(null);

    const [orderTypes, setOrderTypes] =
        useState<OrderType[]>([]);


    const [orderType, setOrderType] =
        useState<number | null>(null);



    const cart =
        useOrderStore(
            state => state.cart
        );


    const clear =
        useOrderStore(
            state => state.clear
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
                sum + getGrossLineTotal(item),
            0
        );

    const itemDiscount =
        cart.reduce(
            (sum, item) =>
                sum + getDiscountAmount(item),
            0
        );



    const afterItemDiscount =
        subtotal - itemDiscount;



    const orderDiscountAmount =

        orderDiscount

            ?

            orderDiscount.type === "percentage"

                ?

                afterItemDiscount *
                (
                    Number(orderDiscount.value) / 100
                )

                :

                Number(orderDiscount.value)

            :

            0;




    const discountAmount =
        itemDiscount +
        orderDiscountAmount;



    const total =
        Math.max(
            afterItemDiscount -
            orderDiscountAmount,
            0
        );





    async function pay() {


        try {


            setLoading(true);



            const payload = {


                location_id: 1,


                order_type_id: orderType,


                order_source_id: 1,



                subtotal,


                discount_amount:
                    discountAmount,



                tax_amount: 0,


                service_charge: 0,


                total_amount:
                    total,



                notes:
                    orderNote || null,



                discounts:

                    orderDiscount

                        ?

                        [
                            {
                                discount_id:
                                    orderDiscount.id,

                                amount:
                                    orderDiscountAmount
                            }
                        ]

                        :

                        [],



                payment: {
                    payment_method_id: paymentMethod,
                    amount: total
                },



                items:


                    cart.map(item => ({


                        menu_item_id:
                            item.menuItem.id,


                        quantity:
                            item.quantity,


                        unit_price:
                            getItemPrice(item),


                        total_price:
                            getLineTotal(item),



                        notes:
                            item.note || null,



                        modifiers:


                            item.modifiers.map(mod => ({

                                modifier_id:
                                    mod.id,


                                quantity: 1,


                                price:
                                    Number(mod.price)

                            }))


                    }))


            };



            const response =
                await createOrder(
                    payload
                );


            console.log(
                "ORDER CREATED",
                response
            );

            await printReceipt(
                response.data
            );

            toast.success('Order Placed Successfully');
            clear();
            setPaymentMethod(null);
            setOrderType(null);
            onClose();



        }
        catch (error) {
            toast.error('Something Went Wrong');
            console.error(
                "Checkout error",
                error
            );
        }
        finally {
            setLoading(false);
        }
    }
    function close() {

        setPaymentMethod(null);
        setOrderType(null);

        onClose();

    }
    useEffect(() => {

        async function loadData() {

            try {

                const [
                    paymentResponse,
                    orderTypeResponse
                ] = await Promise.all([
                    getPaymentMethods(),
                    getOrderTypes()
                ]);


                setPaymentMethods(
                    paymentResponse.data.data ??
                    paymentResponse.data
                );


                setOrderTypes(
                    orderTypeResponse.data.data ??
                    orderTypeResponse.data
                );


            }
            catch (error) {

                console.error(error);

            }

        }


        if (open) {
            loadData();
        }


    }, [open]);





    return (

        <Dialog
            open={open}
            onOpenChange={close}
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
                <div className="bg-primary px-8 py-5 text-primary-foreground">
                    <DialogHeader>
                        <DialogTitle

                            className="
text-xl
font-semibold
"

                        >

                            Complete Payment

                        </DialogTitle>


                        <p className="text-sm opacity-80">

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


                    {/* ORDER TYPE */}

                    <div>

                        <p
                            className="
mb-3
text-sm
font-semibold
text-muted-foreground
"
                        >
                            Order Type
                        </p>


                        <div
                            className="
grid
grid-cols-4
gap-3
"
                        >


                            {
                                orderTypes.map(type => (

                                    <Button

                                        key={type.id}

                                        variant="outline"

                                        disabled={loading}

                                        onClick={() =>
                                            setOrderType(type.id)
                                        }

                                        className={`
h-20
rounded-2xl
flex
flex-col
gap-2
font-semibold

${orderType === type.id
                                                ?
                                                "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                                                :
                                                ""
                                            }

`}

                                    >


                                        <span>
                                            {type.name}
                                        </span>


                                    </Button>

                                ))
                            }


                        </div>

                    </div>

                    {/* ITEMS */}


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


                        <div className="
flex
justify-between
items-center
">


                            <h3 className="font-bold text-lg">

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




                        {
                            cart.map(item => (


                                <div

                                    key={item.lineId}

                                    className="
rounded-2xl
bg-slate-50
p-4
"

                                >


                                    <div className="
flex
justify-between
">


                                        <div>

                                            <p className="font-semibold">

                                                {item.menuItem.name}

                                            </p>


                                            <p className="text-sm text-muted-foreground">

                                                Qty {item.quantity}

                                            </p>


                                        </div>



                                        <p className="font-bold">

                                            {getLineTotal(item).toFixed(2)}
                                            QAR

                                        </p>


                                    </div>





                                    {
                                        item.modifiers.length > 0 &&


                                        <div className="
mt-3
space-y-1
text-sm
text-muted-foreground
">


                                            {
                                                item.modifiers.map(mod => (

                                                    <div
                                                        key={mod.id}
                                                        className="
flex
justify-between
"
                                                    >


                                                        <span>

                                                            + {mod.name}

                                                        </span>


                                                        <span>

                                                            {Number(mod.price).toFixed(2)}
                                                            QAR

                                                        </span>


                                                    </div>

                                                ))

                                            }



                                        </div>

                                    }





                                    {
                                        item.note &&


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

                                            Note: {item.note}

                                        </div>


                                    }



                                </div>


                            ))

                        }



                    </div>






                    {/* TOTAL CARD */}


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



                        <div className="
border-t
border-white/20
pt-3
flex
justify-between
text-xl
font-bold
">

                            <span>

                                Total

                            </span>


                            <span>

                                {total.toFixed(2)} QAR

                            </span>


                        </div>


                    </div>







                    {/* PAYMENT */}


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

                        <div
                            className="
        grid
        grid-cols-4
        gap-3
    "
                        >
                            {paymentMethods.map(method => (
                                <PaymentButton
                                    key={method.id}
                                    icon={getPaymentIcon(method.code)}
                                    label={method.name}
                                    active={paymentMethod === method.id}
                                    disabled={loading}
                                    onClick={() => setPaymentMethod(method.id)}
                                />
                            ))}

                        </div>


                    </div>






                    <Button

                        disabled={
                            loading ||
                            !paymentMethod ||
                            !orderType
                        }

                        onClick={pay}


                        className="
h-14
rounded-2xl
text-lg
font-bold
w-full
"


                    >


                        {
                            loading

                                ?

                                <>

                                    <Loader2 className="
mr-2
animate-spin
"/>

                                    Processing...

                                </>


                                :

                                <>
                                    Pay {total.toFixed(2)} QAR
                                </>


                        }



                    </Button>





                </div>



            </DialogContent>


        </Dialog>


    );

}








function Row({

    label,

    value,

    green = false

}: {

    label: string;

    value: string;

    green?: boolean;

}) {


    return (

        <div className="
flex
justify-between
text-sm
">


            <span>

                {label}

            </span>


            <span

                className={
                    green
                        ?
                        "text-green-400"
                        :
                        ""
                }

            >

                {value}

            </span>


        </div>


    )

}



