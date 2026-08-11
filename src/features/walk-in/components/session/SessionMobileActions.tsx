// features/walk-in/components/session/SessionMobileActions.tsx

"use client";

import {
    Plus,
    ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";


interface Props {

    onNewOrder:
        () => void;

    hasActiveOrder:
        boolean;

    onOpenOrder:
        () => void;
}


export function SessionMobileActions({

    onNewOrder,

    hasActiveOrder,

    onOpenOrder,

}: Props) {

    return (

        <div
            className="
                flex
                shrink-0
                gap-2
                border-t
                bg-white
                p-2
                sm:p-3
                lg:hidden
            "
            style={{
                borderColor:
                    "#d9d9d8",
            }}
        >

            <Button
                type="button"
                variant="outline"
                onClick={onNewOrder}
                className="
                    h-12
                    flex-1
                    rounded-xl
                "
                style={{
                    borderColor:
                        "#d9d9d8",

                    color:
                        "#40332a",
                }}
            >

                <Plus
                    className="
                        mr-2
                        h-5
                        w-5
                    "
                />

                New Order

            </Button>


            <Button
                type="button"
                onClick={onOpenOrder}
                disabled={
                    !hasActiveOrder
                }
                className="
                    h-12
                    flex-1
                    rounded-xl
                "
                style={{
                    backgroundColor:
                        "#40332a",

                    color:
                        "#ffffff",
                }}
            >

                <ShoppingBag
                    className="
                        mr-2
                        h-5
                        w-5
                    "
                />

                Order

            </Button>

        </div>

    );
}