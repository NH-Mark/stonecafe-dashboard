"use client";


import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";


import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";


import {
    TrendingUp
} from "lucide-react";


type SalesTrend = {

    date:string;

    sales:number;

};


type Props = {

    data:SalesTrend[];

};



export default function SalesTrendChart({
    data
}:Props) {


    const total =
        data.reduce(
            (sum,item)=>sum + item.sales,
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
                items-center
                justify-between
                pb-2
                "
            >

                <div>

                    <CardTitle
                        className="
                        text-base
                        font-semibold
                        text-[#40332a]
                        "
                    >
                        Sales Trend
                    </CardTitle>


                    <p
                        className="
                        text-xs
                        text-muted-foreground
                        "
                    >
                        Revenue performance
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

                    <TrendingUp
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
                            h-[280px]
                            items-center
                            justify-center
                            text-sm
                            text-muted-foreground
                            "
                        >

                            No sales data

                        </div>
                    )

                    :

                    (

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >

                        <LineChart
                            data={data}
                            margin={{
                                top:10,
                                right:10,
                                left:0,
                                bottom:0
                            }}
                        >


                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="4 4"
                            />



                            <XAxis

                                dataKey="date"

                                tickLine={false}

                                axisLine={false}

                                tick={{
                                    fontSize:12
                                }}

                            />



                            <YAxis

                                tickLine={false}

                                axisLine={false}

                                tick={{
                                    fontSize:12
                                }}

                                tickFormatter={
                                    value =>
                                        `QAR ${value/1000}k`
                                }

                            />




                            <Tooltip

                                contentStyle={{
                                    borderRadius:"12px",
                                    border:"1px solid #d9d9d8",
                                }}

                                formatter={
                                    (value:any)=>
                                    [
                                        `QAR ${Number(value).toLocaleString()}`,
                                        "Sales"
                                    ]
                                }

                            />



                            <Line

                                type="monotone"

                                dataKey="sales"

                                stroke="#40332a"

                                strokeWidth={3}

                                dot={{
                                    r:4,
                                    fill:"#ddcfbe",
                                    stroke:"#40332a",
                                    strokeWidth:2
                                }}

                                activeDot={{
                                    r:6
                                }}

                            />



                        </LineChart>


                    </ResponsiveContainer>

                    )


                }


            </CardContent>


        </Card>

    );

}