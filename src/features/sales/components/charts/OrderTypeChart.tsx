"use client";


import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";


import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";


import {
    ShoppingBag
} from "lucide-react";
import { OrderTypeSales } from "../../sales.types";




type Props = {
    data:OrderTypeSales[];
};



const COLORS = [

    "#40332a",
    "#a5765f",
    "#ddcfbe",
    "#c3b6a4",
    "#d9d9d8"

];



export default function OrderTypeChart({
    data
}:Props) {


    const total =
        data.reduce(
            (sum,item)=>sum + item.value,
            0
        );



    return (

        <Card
            className="
            rounded-2xl
            border-[#d9d9d8]
            bg-white
            "
        >


            <CardHeader
                className="
                flex
                flex-row
                justify-between
                items-center
                pb-2
                "
            >

                <div>

                    <CardTitle
                        className="
                        text-sm
                        font-semibold
                        text-[#40332a]
                        "
                    >
                        Sales By Order Type
                    </CardTitle>


                    <p
                        className="
                        text-xs
                        text-muted-foreground
                        "
                    >
                        Revenue distribution
                    </p>

                </div>



                <div
                    className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-[#f3f3f3]
                    px-3
                    py-2
                    "
                >

                    <ShoppingBag
                        className="
                        h-4
                        w-4
                        text-[#40332a]
                        "
                    />


                    <span
                        className="
                        text-sm
                        font-bold
                        text-[#40332a]
                        "
                    >

                        QAR {total.toLocaleString()}

                    </span>


                </div>


            </CardHeader>




            <CardContent>


                {
                    data.length === 0 ?


                    (

                        <div
                            className="
                            flex
                            h-[300px]
                            items-center
                            justify-center
                            text-sm
                            text-muted-foreground
                            "
                        >

                            No order data

                        </div>

                    )


                    :

                    (

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >

                        <PieChart>


                            <Pie

                                data={data}

                                dataKey="value"

                                nameKey="name"

                                cx="50%"

                                cy="50%"

                                innerRadius={65}

                                outerRadius={95}

                                paddingAngle={3}

                            >


                                {
                                    data.map(
                                        (_,index)=>(

                                            <Cell

                                                key={index}

                                                fill={
                                                    COLORS[
                                                        index %
                                                        COLORS.length
                                                    ]
                                                }

                                            />

                                        )
                                    )
                                }


                            </Pie>




                            <Tooltip

                                formatter={
                                    (value:any)=>[
                                        `QAR ${Number(value).toLocaleString()}`,
                                        "Sales"
                                    ]
                                }

                            />



                            <Legend

                                verticalAlign="bottom"

                                height={36}

                                iconType="circle"

                            />


                        </PieChart>


                    </ResponsiveContainer>

                    )


                }



            </CardContent>


        </Card>

    );

}