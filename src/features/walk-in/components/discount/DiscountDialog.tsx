"use client";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";


import {
    Tag,
    Percent,
    BadgeDollarSign,
    X,
    Loader2
} from "lucide-react";


import { Button } from "@/components/ui/button";


import {
    useOrderStore
} from "../../store/useOrderStore";


import {
    useDiscounts
} from "../../hooks/useDiscounts";



export function DiscountDialog({

    open,

    onClose,

    lineId,

    type = "item"

}: {
    open: boolean;

    onClose: () => void;

    lineId?: string;

    type?: "item" | "order";

}) {


    const {
        discounts,
        loading
    } = useDiscounts();

    const orderDiscount =
        useOrderStore(
            s => s.orderDiscount
        );


    const applyOrderDiscount =
        useOrderStore(
            s => s.applyOrderDiscount
        );


    const removeOrderDiscount =
        useOrderStore(
            s => s.removeOrderDiscount
        );



    const applyDiscount =
        useOrderStore(
            s => s.applyDiscount
        );


    const removeDiscount =
        useOrderStore(
            s => s.removeDiscount
        );





    const cart =
        useOrderStore(
            s => s.cart
        );


    const currentItem =
        type === "item"
            ? cart.find(
                item => item.lineId === lineId
            )
            : null;

    const activeDiscount =
        type === "order"
            ? orderDiscount
            : currentItem?.discount;




    function selectDiscount(discount: any) {


        if (type === "order") {

            applyOrderDiscount({

                ...discount,

                value: Number(discount.value)

            });

        }
        else if (lineId) {

            applyDiscount(
                lineId,
                discount
            );

        }


        onClose();

    }




    function clearDiscount() {


        if (type === "order") {

            removeOrderDiscount();

        }
        else if (lineId) {

            removeDiscount(
                lineId
            );

        }


        onClose();

    }


    return (

        <Dialog
            open={open}
            onOpenChange={onClose}
        >


            <DialogContent
                className="
                    !max-w-2xl
                    max-h-[90vh]
                    overflow-hidden
                    rounded-3xl
                    p-6
                "
            >


                <DialogHeader>


                    <DialogTitle
                        className="
                            flex
                            items-center
                            gap-2
                            text-2xl
                        "
                    >

                        <Tag
                            className="
                                text-primary
                            "
                        />

                        Discount


                    </DialogTitle>


                    <DialogDescription>

                        Apply promotion or loyalty discount

                    </DialogDescription>


                </DialogHeader>



                {
                    activeDiscount && (

                        <div
                            className="
                flex
                items-center
                justify-between
                rounded-2xl
                border
                bg-green-50
                p-4
            "
                        >

                            <div>

                                <p className="font-semibold">
                                    Current Discount
                                </p>


                                <p
                                    className="
                    text-sm
                    text-green-700
                    "
                                >

                                    {activeDiscount.name}

                                    {" - "}

                                    {
                                        activeDiscount.type === "percentage"
                                            ?
                                            `${activeDiscount.value}%`
                                            :
                                            `${activeDiscount.value} QAR`
                                    }

                                </p>


                            </div>


                            <Button

                                variant="destructive"

                                size="sm"

                                onClick={clearDiscount}

                            >

                                <X className="mr-2 h-4 w-4" />

                                Remove

                            </Button>


                        </div>

                    )
                }






                {
                    loading &&

                    <div
                        className="
                            flex
                            h-48
                            items-center
                            justify-center
                        "
                    >

                        <Loader2
                            className="
                                animate-spin
                            "
                        />

                    </div>

                }






                {
                    !loading && (
                        <div
                            className="
                mt-4
                max-h-[50vh]
                overflow-y-auto
                pr-2
                overscroll-contain
            "
                        >
                            <div
                                className="
                    grid
                    grid-cols-2
                    gap-4
                    md:grid-cols-3
                    lg:grid-cols-4
                "
                            >
                                {discounts.map(discount => (
                                    <button
                                        key={discount.id}
                                        onClick={() =>
                                            selectDiscount(discount)
                                        }
                                        className="
                            group
                            relative
                            flex
                            h-44
                            flex-col
                            items-center
                            justify-center
                            rounded-3xl
                            border
                            bg-white
                            p-5
                            transition-all
                            duration-200
                            hover:-translate-y-1
                            hover:border-primary
                            hover:bg-primary/5
                            hover:shadow-xl
                            active:scale-95
                        "
                                    >
                                        <div
                                            className="
                                mb-3
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-2xl
                                bg-primary/10
                                text-primary
                                transition
                                group-hover:bg-primary
                                group-hover:text-primary-foreground
                            "
                                        >
                                            {discount.type === "percentage" ? (
                                                <Percent className="h-4 w-4" />
                                            ) : (
                                                <BadgeDollarSign className="h-4 w-4" />
                                            )}
                                        </div>

                                        <div
                                            className="
                                rounded-full
                                bg-green-100
                                px-3
                                py-1
                                text-xs
                                font-bold
                                text-green-700
                            "
                                        >
                                            {discount.type === "percentage"
                                                ? `${discount.value}%`
                                                : `${discount.value} QAR`}
                                        </div>

                                        <h3
                                            className="
                                mt-3
                                max-w-full
                                truncate
                                text-center
                                text-sm
                                font-semibold
                                text-slate-900
                            "
                                        >
                                            {discount.name}
                                        </h3>

                                        <p
                                            className="
                                mt-1
                                text-xs
                                text-muted-foreground
                            "
                                        >
                                            {discount.type === "percentage"
                                                ? "Percentage"
                                                : "Fixed amount"}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                }

                <DialogFooter>

                    <Button
                        variant="outline"
                        onClick={onClose}
                    >

                        Cancel

                    </Button>

                </DialogFooter>


            </DialogContent>


        </Dialog>

    );

}