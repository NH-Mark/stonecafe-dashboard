"use client";


import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
}
    from "recharts";


const data = [

    {
        name: "Doha",
        sales: 9000
    },

    {
        name: "Lusail",
        sales: 4000
    }

];


export default function LocationSalesChart() {


    return (

        <div className="
rounded-xl
border
p-6
">


            <h3 className="font-semibold mb-5">
                Sales By Location
            </h3>


            <ResponsiveContainer
                height={300}
                width="100%"
            >


                <BarChart data={data}>


                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />


                    <Bar
                        dataKey="sales"
                    />


                </BarChart>


            </ResponsiveContainer>


        </div>

    )

}