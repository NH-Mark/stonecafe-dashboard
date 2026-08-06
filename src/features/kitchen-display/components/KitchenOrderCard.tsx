import { Clock, ChefHat } from "lucide-react";

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
            rounded-2xl
            border
            border-[#d9d9d8]
            bg-white
            shadow-sm
            overflow-hidden
            "
        >


            {/* Header */}

            <div
                className="
    flex
    items-start
    justify-between
    border-b
    border-[#d9d9d8]
    bg-[#f3f3f3]
    p-4
    "
            >


                <div
                    className="
        min-w-0
        "
                >

                    <h3
                        className="
            truncate
            text-xl
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
                    truncate
                    text-sm
                    font-medium
                    text-[#a5765f]
                    "
                            >
                                {order.customer.name}
                            </p>

                        )
                    }


                    {
                        order.table && (

                            <p
                                className="
                    mt-1
                    text-sm
                    text-[#40332a]
                    "
                            >
                                Table {order.table}
                            </p>

                        )
                    }


                </div>





                <div
                    className="
        ml-3
        flex
        shrink-0
        items-center
        gap-2
        rounded-xl
        bg-[#ddcfbe]
        px-4
        py-3
        text-sm
        font-bold
        text-[#40332a]
        "
                >

                    <Clock
                        size={18}
                    />


                    {formatOrderTime(order.ordered_at)}


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

                            <strong>
                                Order Note:
                            </strong>

                            <p>
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