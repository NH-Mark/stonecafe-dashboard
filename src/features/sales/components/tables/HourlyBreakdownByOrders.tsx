"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

import { Clock3 } from "lucide-react";

type HourlyBreakdown = {
    date: string;
    hours: number[];
};

type Props = {
    data: HourlyBreakdown[];
};

const COLORS = [
    "#40332a", // dark brown
    "#c3b6a4", // warm beige
    "#ddcfbe", // light sand
    "#a5765a", // muted caramel
    "#d9d9d8", // soft gray
    "#8c6b52", // earthy brown
    "#b89f86", // taupe beige
    "#e8dccb", // cream sand
    "#6f5643", // deep mocha
    "#c9b39d", // dusty beige
    "#95745c", // warm clay
    "#f3eee8", // off white
];
const HOURS = [
    "12-1 AM",
    "1-2 AM",
    "2-3 AM",
    "3-4 AM",
    "4-5 AM",
    "5-6 AM",
    "6-7 AM",
    "7-8 AM",
    "8-9 AM",
    "9-10 AM",
    "10-11 AM",
    "11-12 AM",
    "12-1 PM",
    "1-2 PM",
    "2-3 PM",
    "3-4 PM",
    "4-5 PM",
    "5-6 PM",
    "6-7 PM",
    "7-8 PM",
    "8-9 PM",
    "9-10 PM",
    "10-11 PM",
    "11-12 PM",
];


export default function HourlyBreakdownByOrders({
    data,
}: Props) {

    const chartData = HOURS.map((hour, index) => {

        const row: any = {
            hour,
        };

        data.forEach(day => {
            row[day.date] = day.hours[index] ?? 0;
        });

        return row;
    });


    return (

        <Card className="
            w-full
            min-w-0
            max-w-full
            overflow-hidden
            rounded-2xl
            border-[#d9d9d8]
            bg-[#ffffff]
        ">

            <CardHeader className="
                flex
                flex-row
                items-center
                justify-between
            ">

                <div>

                    <CardTitle className="
                        text-sm
                        font-semibold
                        text-[#40332a]
                    ">
                        Hourly Breakdown by Orders
                    </CardTitle>

                    <p className="
                        text-xs
                        text-[#40332a]/60
                    ">
                        Orders grouped by hour
                    </p>

                </div>


                <div className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-[#f3f3f3]
                    px-3
                    py-2
                ">

                    <Clock3 className="
                        h-4
                        w-4
                        text-[#40332a]
                    "/>

                    <span className="
                        text-sm
                        font-medium
                        text-[#40332a]
                    ">
                        {data.length} Day{data.length !== 1 && "s"}
                    </span>

                </div>


            </CardHeader>



            <CardContent className="
                w-full
                min-w-0
                space-y-8
                overflow-hidden
            ">


                {data.length === 0 ? (

                    <div className="
                        flex
                        h-[350px]
                        items-center
                        justify-center
                        text-sm
                        text-[#40332a]/60
                    ">
                        No hourly data available
                    </div>

                ) : (

                    <>


                        {/* Chart */}

                        <div className="
                            h-[350px]
                            w-full
                            min-w-0
                        ">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <LineChart
                                    data={chartData}
                                    margin={{
                                        top:10,
                                        right:20,
                                        left:0,
                                        bottom:10
                                    }}
                                >

                                    <CartesianGrid
                                        vertical={false}
                                        stroke="#d9d9d8"
                                        strokeDasharray="4 4"
                                    />


                                    <XAxis
                                        dataKey="hour"
                                        tick={{
                                            fontSize:10,
                                            fill:"#40332a"
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                    />


                                    <YAxis
                                        allowDecimals={false}
                                        tick={{
                                            fontSize:11,
                                            fill:"#40332a"
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                    />


                                    <Tooltip
                                        contentStyle={{
                                            borderRadius:12,
                                            border:"1px solid #d9d9d8",
                                            background:"#ffffff"
                                        }}
                                    />


                                    <Legend
                                        wrapperStyle={{
                                            paddingTop:15,
                                            fontSize:12
                                        }}
                                    />


                                    {data.map((day,index)=>(

                                        <Line
                                            key={day.date}
                                            type="monotone"
                                            dataKey={day.date}
                                            stroke={
                                                COLORS[index % COLORS.length]
                                            }
                                            strokeWidth={3}
                                            dot={false}
                                            activeDot={{
                                                r:5
                                            }}
                                        />

                                    ))}


                                </LineChart>

                            </ResponsiveContainer>

                        </div>




                        {/* Table */}

                        <div className="
                            w-full
                            max-w-full
                            overflow-x-auto
                            rounded-xl
                            border
                            border-[#d9d9d8]
                        ">


                            <Table className="
                                w-full
                                table-fixed
                            ">


                                <TableHeader>


                                    <TableRow>


                                        <TableHead
                                            className="
                                                sticky
                                                left-0
                                                z-10
                                                w-[80px]
                                                bg-[#ffffff]
                                                px-2
                                                text-xs
                                                font-semibold
                                                text-[#40332a]
                                            "
                                        >
                                            Date
                                        </TableHead>



                                        {HOURS.map(hour=>(

                                            <TableHead
                                                key={hour}
                                                className="
                                                    px-1
                                                    text-center
                                                    text-[10px]
                                                    whitespace-nowrap
                                                    text-[#40332a]
                                                "
                                            >
                                                {hour}
                                            </TableHead>

                                        ))}


                                    </TableRow>


                                </TableHeader>



                                <TableBody>


                                    {data.map(day=>(

                                        <TableRow
                                            key={day.date}
                                        >


                                            <TableCell
                                                className="
                                                    sticky
                                                    left-0
                                                    z-10
                                                    w-[80px]
                                                    bg-[#ffffff]
                                                    px-2
                                                    text-xs
                                                    font-medium
                                                    text-[#40332a]
                                                "
                                            >
                                                {day.date}
                                            </TableCell>



                                            {day.hours.map((value,index)=>(

                                                <TableCell
                                                    key={index}
                                                    className={`
                                                        px-1
                                                        py-2
                                                        text-center
                                                        text-xs
                                                        ${
                                                            value > 0
                                                            ?
                                                            "bg-[#ddcfbe] text-[#40332a] font-medium"
                                                            :
                                                            "text-[#40332a]/50"
                                                        }
                                                    `}
                                                >

                                                    {value}

                                                </TableCell>

                                            ))}


                                        </TableRow>

                                    ))}


                                </TableBody>


                            </Table>


                        </div>


                    </>

                )}


            </CardContent>


        </Card>

    );
}