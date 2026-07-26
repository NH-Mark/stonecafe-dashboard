import {
    Card,
    CardContent
}
    from "@/components/ui/card";


const orders = [

    {
        no: "ORD-1001",
        type: "QR",
        amount: 50
    },

    {
        no: "ORD-1002",
        type: "Dine In",
        amount: 120
    }

];


export default function RecentOrders() {


    return (

        <Card>

            <CardContent className="p-6">


                <h3 className="font-semibold mb-5">
                    Recent Orders
                </h3>


                <div className="space-y-4">


                    {
                        orders.map(order => (


                            <div
                                key={order.no}
                                className="
flex
justify-between
border-b
pb-3
"
                            >

                                <div>

                                    <p className="font-medium">
                                        {order.no}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {order.type}
                                    </p>

                                </div>


                                <p>
                                    QAR {order.amount}
                                </p>


                            </div>


                        ))
                    }


                </div>


            </CardContent>

        </Card>


    )

}