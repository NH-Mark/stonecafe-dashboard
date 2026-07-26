import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {

    return (

        <div className="space-y-6">

            {/* Page Header */}

            <div>

                <h1 className="text-3xl font-bold tracking-tight">
                    Dashboard
                </h1>

                <p className="text-muted-foreground">
                    Welcome back! Here's what's happening today.
                </p>

            </div>


            {/* Statistics */}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                <Card>

                    <CardHeader className="flex flex-row items-center justify-between pb-2">

                        <CardTitle className="text-sm font-medium">
                            Today's Sales
                        </CardTitle>

                        <DollarSign className="h-5 w-5 text-muted-foreground" />

                    </CardHeader>

                    <CardContent>

                        <div className="text-2xl font-bold">
                            QAR 2,350
                        </div>

                        <p className="text-xs text-muted-foreground">
                            +12.5% from yesterday
                        </p>

                    </CardContent>

                </Card>


                <Card>

                    <CardHeader className="flex flex-row items-center justify-between pb-2">

                        <CardTitle className="text-sm font-medium">
                            Orders
                        </CardTitle>

                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />

                    </CardHeader>

                    <CardContent>

                        <div className="text-2xl font-bold">
                            86
                        </div>

                        <p className="text-xs text-muted-foreground">
                            14 pending
                        </p>

                    </CardContent>

                </Card>


                <Card>

                    <CardHeader className="flex flex-row items-center justify-between pb-2">

                        <CardTitle className="text-sm font-medium">
                            Customers
                        </CardTitle>

                        <Users className="h-5 w-5 text-muted-foreground" />

                    </CardHeader>

                    <CardContent>

                        <div className="text-2xl font-bold">
                            524
                        </div>

                        <p className="text-xs text-muted-foreground">
                            18 new today
                        </p>

                    </CardContent>

                </Card>


                <Card>

                    <CardHeader className="flex flex-row items-center justify-between pb-2">

                        <CardTitle className="text-sm font-medium">
                            Low Stock
                        </CardTitle>

                        <Package className="h-5 w-5 text-muted-foreground" />

                    </CardHeader>

                    <CardContent>

                        <div className="text-2xl font-bold text-red-600">
                            12
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Items need restocking
                        </p>

                    </CardContent>

                </Card>

            </div>


            {/* Content */}

            <div className="grid gap-6 lg:grid-cols-3">

                <Card className="lg:col-span-2">

                    <CardHeader>

                        <CardTitle>
                            Sales Overview
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <div className="flex h-72 items-center justify-center rounded-lg border border-dashed text-muted-foreground">

                            Sales Chart

                        </div>

                    </CardContent>

                </Card>


                <Card>

                    <CardHeader>

                        <CardTitle>
                            Recent Orders
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <div className="space-y-4">

                            <div className="flex justify-between">

                                <span>#10025</span>

                                <span className="font-medium">
                                    QAR 52
                                </span>

                            </div>

                            <div className="flex justify-between">

                                <span>#10024</span>

                                <span className="font-medium">
                                    QAR 87
                                </span>

                            </div>

                            <div className="flex justify-between">

                                <span>#10023</span>

                                <span className="font-medium">
                                    QAR 31
                                </span>

                            </div>

                            <div className="flex justify-between">

                                <span>#10022</span>

                                <span className="font-medium">
                                    QAR 65
                                </span>

                            </div>

                        </div>

                    </CardContent>

                </Card>

            </div>

        </div>

    );

}