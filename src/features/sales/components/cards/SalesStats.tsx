"use client";

import {
    Card,
    CardContent
} from "@/components/ui/card";

import {
    Wallet,
    ShoppingCart,
    TrendingUp,
    ReceiptText,
    Users,
    BadgePercent,
    RotateCcw,
    Banknote
} from "lucide-react";

import { SalesStat } from "../../sales.types";


const icons: any = {

    sales: Wallet,
    orders: ShoppingCart,
    gross: TrendingUp,
    net: Banknote,
    average: ReceiptText,
    customers: Users,
    discount: BadgePercent,
    refund: RotateCcw

};



type Props = {
    data: SalesStat[];
};


export default function SalesStats({
    data
}: Props) {


    return (

        <div
            className="
grid
gap-3
sm:grid-cols-2
xl:grid-cols-4
"
        >


            {
                data.map((item) => (


                    <Card

                        key={item.title}

                        className="
group
cursor-pointer
rounded-xl
border-[#d9d9d8]
bg-white
transition
hover:shadow-md
"

                    >


                        <CardContent

                            className="
p-3
"

                        >


                            <div

                                className="
flex
items-center
justify-between
"

                            >


                                <div
                                    className="
space-y-1
"
                                >


                                    <p

                                        className="
text-[11px]
font-medium
uppercase
tracking-wide
text-[#40332a]/60
"

                                    >

                                        {item.title}

                                    </p>



                                    <h2

                                        className="
text-lg
font-bold
leading-none
text-[#40332a]
"

                                    >

                                        {item.value}

                                    </h2>



                                    {
                                        item.change &&

                                        <p

                                            className="
text-[11px]
text-green-600
font-medium
"

                                        >

                                            {item.change}

                                        </p>

                                    }



                                </div>




                                <div

                                    className="
flex
h-8
w-8
shrink-0
items-center
justify-center
rounded-lg
bg-[#f3f3f3]
transition
group-hover:bg-[#ddcfbe]
"

                                >


                                    {
                                        (() => {

                                            const Icon =
                                                icons[item.icon];


                                            return Icon && (

                                                <Icon

                                                    className="
h-4
w-4
text-[#40332a]
"

                                                />

                                            )

                                        })()
                                    }



                                </div>


                            </div>



                        </CardContent>


                    </Card>


                ))
            }


        </div>


    );

}