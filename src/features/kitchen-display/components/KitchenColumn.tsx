
import { KitchenOrderCard } from "./KitchenOrderCard";
import { KitchenOrder } from "../kitchen.types";


interface Props {

    title: string;

    status: string;

    orders: KitchenOrder[];

}



export function KitchenColumn({
    title,
    status,
    orders
}: Props) {


    const filteredOrders =
        orders.filter(
            item =>
                item.kitchen_status === status
                &&
                item.status !== "cancelled"
        );


    return (

        <div
            className="
            rounded-2xl
            bg-white
            border
            border-[#d9d9d8]
            overflow-hidden
            "
        >


            <div
                className="
                flex
                items-center
                justify-between
                px-5
                py-4
                bg-[#ddcfbe]
                "
            >

                <h2
                    className="
                    font-bold
                    text-[#40332a]
                    "
                >
                    {title}
                </h2>


                <span
                    className="
                    rounded-full
                    bg-[#40332a]
                    px-3
                    py-1
                    text-xs
                    text-white
                    "
                >
                    {filteredOrders.length}
                </span>


            </div>



            <div
                className="
                h-[calc(100vh-230px)]
                space-y-4
                overflow-y-auto
                p-4
                "
            >


                {
                    filteredOrders.length === 0 && (

                        <div
                            className="
                            py-10
                            text-center
                            text-sm
                            text-[#a5765]
                            "
                        >
                            No orders
                        </div>

                    )
                }



                {
                    filteredOrders.map(order => (

                        <KitchenOrderCard
                            key={order.id}
                            order={order}
                        />

                    ))
                }


            </div>


        </div>

    );
}