import { Clock } from "lucide-react";

import { KitchenOrderItem } from "./KitchenOrderItem";
import { KitchenOrder } from "../kitchen.types";
import { formatOrderTime } from "../utils/date";
import { KitchenStatusButton } from "./KitchenStatusButton";


interface Props {
    order: KitchenOrder;
}



export function KitchenOrderCard({
    order
}: Props) {


    return (

        <div
            className="
            overflow-hidden
            rounded-2xl
            border
            border-[#d9d9d8]
            bg-white
            shadow-sm
            "
        >


            {/* Header */}

            {/* Header */}

            <div
                className="
    border-b
    border-[#d9d9d8]
    bg-[#f3f3f3]
    p-4
    "
            >

                <div
                    className="
        flex
        flex-col
        gap-4

        lg:flex-row
        lg:items-start
        lg:justify-between
        "
                >

                    {/* Order Info */}

                    <div
                        className="
            flex
            flex-col
            "
                    >

                        <h3
                            className="
                whitespace-nowrap
                text-lg
                font-extrabold
                tracking-wide
                text-[#40332a]
                "
                        >
                            {order.order_no}
                        </h3>



                        {
                            order.customer?.name && (

                                <p
                                    className="
                        mt-1
                        text-base
                        font-medium
                        text-[#a5765f]
                        "
                                >
                                    {order.customer.name}
                                </p>

                            )
                        }



                    </div>





                    {/* Timer */}

                    <div
                        className="
            flex
            h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#ddcfbe]
            px-4
            text-base
            font-bold
            text-[#40332a]

            lg:w-auto
            lg:min-w-[150px]
            "
                    >

                        <Clock
                            size={20}
                            className="shrink-0"
                        />

                        <span>
                            {formatOrderTime(order.ordered_at)}
                        </span>


                    </div>


                </div>

            </div>





            {/* Items */}

            <div
                className="
                space-y-3
                p-4
                "
            >


                {
                    order.items.map(item => (

                        <KitchenOrderItem

                            key={item.id}

                            item={item}

                        />

                    ))
                }





                {/* Order Notes */}

                {
                    order.notes && (

                        <div
                            className="
                            rounded-xl
                            border
                            border-[#c3b6a4]
                            bg-[#c3b6a4]
                            p-3
                            text-sm
                            text-[#40332a]
                            "
                        >

                            <p
                                className="
                                font-bold
                                "
                            >
                                Order Note
                            </p>


                            <p
                                className="
                                mt-1
                                "
                            >
                                {order.notes}
                            </p>


                        </div>

                    )
                }


                <KitchenStatusButton
                    order={order}
                />


            </div>


        </div>

    );

}