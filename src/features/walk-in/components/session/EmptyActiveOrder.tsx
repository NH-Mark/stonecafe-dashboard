// features/walk-in/components/session/EmptyActiveOrder.tsx

import {
    ShoppingBag,
} from "lucide-react";


export function EmptyActiveOrder() {

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

                <ShoppingBag
                    className="
                        mx-auto
                        mb-3
                        h-8
                        w-8
                    "
                    style={{
                        color:
                            "#c3b6a4",
                    }}
                />


                <p
                    className="
                        text-sm
                        font-semibold
                    "
                    style={{
                        color:
                            "#40332a",
                    }}
                >
                    No active order
                </p>


                <p
                    className="
                        mt-1
                        text-xs
                    "
                    style={{
                        color:
                            "#40332a",

                        opacity:
                            0.55,
                    }}
                >
                    Select an order or create
                    a new one.
                </p>

            </div>

        </div>

    );
}