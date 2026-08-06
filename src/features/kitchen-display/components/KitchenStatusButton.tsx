"use client";


import { Button } from "@/components/ui/button";

import {
    ChefHat,
    CheckCircle,
    Loader2,
    Clock
} from "lucide-react";


import { KitchenOrder } from "../kitchen.types";

import { useState } from "react";

import { updateKitchenStatus } from "../services/kitchen.service";



interface Props {

    order: KitchenOrder;

}



export function KitchenStatusButton({
    order
}: Props) {


    const [loading, setLoading] =
        useState(false);



    async function changeStatus(
        status: string
    ) {

        try {

            setLoading(true);


            await updateKitchenStatus(
                order.id,
                status
            );


        }
        catch (error) {

            console.error(
                "Kitchen status update failed",
                error
            );

        }
        finally {

            setLoading(false);

        }

    }





    if (order.kitchen_status === "pending") {

        return (

            <Button

                disabled={loading}

                onClick={() =>
                    changeStatus("preparing")
                }

                className="
                group
                w-full
                h-11
                rounded-xl
                bg-[#40332a]
                text-white
                font-semibold
                shadow-sm
                transition-all
                hover:bg-[#a5765]
                active:scale-[0.98]
                "

            >

                {
                    loading
                        ?

                        <>

                            <Loader2
                                className="
                        mr-2
                        h-4
                        w-4
                        animate-spin
                        "
                            />

                            Starting...

                        </>


                        :

                        <>

                            <ChefHat
                                className="
                        mr-2
                        h-5
                        w-5
                        "
                            />

                            Start Preparing

                        </>

                }


            </Button>

        );

    }





    if (order.kitchen_status === "preparing") {

        return (

            <Button
                disabled={loading}
                onClick={() => changeStatus("ready")}
                className="
        !w-full
        !h-11
        !rounded-xl
        !bg-[#a5765]
        !text-white
        !font-semibold
        !shadow-sm
        transition-all
        hover:!bg-[#40332a]
        active:scale-[0.98]
    "
            >
                {
                    loading
                        ?
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                        :
                        <>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Mark Ready
                        </>
                }
            </Button>

        );

    }





    return (

        <Button

            disabled

            className="
            w-full
            h-11
            rounded-xl
            bg-[#d9d9d8]
            text-[#40332a]
            font-semibold
            "

        >

            <CheckCircle
                className="
                mr-2
                h-5
                w-5
                "
            />

            Completed

        </Button>

    );


}