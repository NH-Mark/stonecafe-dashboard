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
                justify-between
                items-start
                border-b
                border-[#d9d9d8]
                bg-[#f3f3f3]
                p-4
                "
            >


                <div>

                    <div
                        className="
                        flex
                        items-center
                        gap-2
                        "
                    >

                        <h3
                            className="
                            font-bold
                            text-lg
                            text-[#40332a]
                            "
                        >
                            {order.order_no}
                        </h3>


                        <span
                            className="
                            rounded-full
                            bg-[#40332a]
                            px-2
                            py-1
                            text-[10px]
                            text-white
                            "
                        >
                            NEW
                        </span>


                    </div>


                    <div
                        className="
                        mt-1
                        flex
                        gap-2
                        text-xs
                        text-[#a5765]
                        "
                    >

                       {
                            order.customer?.name && (
                                <span>
                                    • {order.customer.name}
                                </span>
                            )
                        }
                    </div>

                </div>



                <div
                    className="
                    flex
                    items-center
                    gap-1
                    rounded-lg
                    bg-[#ddcfbe]
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-[#40332a]
                    "
                >

                    <Clock size={14}/>

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