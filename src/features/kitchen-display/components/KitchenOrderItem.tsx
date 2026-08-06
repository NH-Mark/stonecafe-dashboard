import { KitchenOrderItem as OrderItem } from "../kitchen.types";



interface Props {

    item: OrderItem;

}



export function KitchenOrderItem({
    item
}: Props) {


    return (

        <div
            className="
rounded-xl
bg-[#f3f3f3]
p-3
"
        >


            <div
                className="
flex
justify-between
"
            >


                <div
                    className="
font-semibold
text-[#40332a]
"
                >

                    <span>
                        {item.quantity} ×
                    </span>


                    <span className="ml-2">
                        {item.menu_item.name}
                    </span>


                </div>


                <div
                    className="
text-sm
font-bold
text-[#40332a]
"
                >
                    {item.total_price}
                </div>


            </div>





            {/* Modifiers */}

            {

                item.modifiers?.length > 0 && (

                    <div
                        className="
mt-2
space-y-1
pl-4
text-xs
text-[#a5765]
"
                    >

                        {
                            item.modifiers.map(mod => (

                                <div
                                    key={mod.id}
                                    className="
flex
items-center
gap-2
"
                                >

                                    <span>
                                        +
                                    </span>

                                    <span>
                                        {mod.quantity} × {mod.modifier.name}
                                    </span>


                                </div>


                            ))
                        }


                    </div>

                )

            }





            {/* Item Notes */}

            {

                item.notes && (

                    <div
                        className="
mt-2
rounded-lg
bg-[#ddcfbe]
p-2
text-xs
text-[#40332a]
"
                    >

                        <strong>
                            Item Note:
                        </strong>

                        {" "}

                        {item.notes}


                    </div>


                )

            }



        </div>


    );


}