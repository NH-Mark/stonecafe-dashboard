"use client"

import { useMemo, useState } from "react"

import { ClipboardList } from "lucide-react"


import OrderFilters from "./order-filters"

import OrderListItem from "./order-list-item"
import { Order } from "@/features/orders/orders.types"

interface OrdersListProps {
    orders: Order[]
    selectedOrderId?: number
    onSelect: (order: Order) => void
}

export default function OrdersList({
    orders,
    selectedOrderId,
    onSelect,
}: OrdersListProps) {

    const [search, setSearch] = useState("")
    const [type, setType] = useState("all")
    const [paymentStatus, setPaymentStatus] = useState("all")
    const filteredOrders = useMemo(() => {

        return orders.filter(order => {

            const searchValue =
                search.toLowerCase().trim()

            const matchesSearch =
                !searchValue ||
                order.order_no
                    .toLowerCase()
                    .includes(searchValue) ||
                order.customer
                    ?.toLowerCase()
                    .includes(searchValue) ||
                order.table
                    ?.toLowerCase()
                    .includes(searchValue) ||
                order.cashier
                    ?.toLowerCase()
                    .includes(searchValue)


            const matchesType =
                type === "all" ||
                order.type?.toLowerCase() === type


            const matchesPayment =
                paymentStatus === "all" ||
                order.payment_status?.toLowerCase() === paymentStatus


            return (
                matchesSearch &&
                matchesType &&
                matchesPayment
            )

        })

    }, [
        orders,
        search,
        type,
        paymentStatus,
    ])


    return (

        <div className="flex min-h-0 flex-col border-r">

            {/* <div className="flex items-center justify-between p-4">

                <div>

                    <h2 className="font-semibold">
                        Orders
                    </h2>

                    <p className="text-xs text-muted-foreground">
                        {filteredOrders.length} orders
                    </p>

                </div>


                <ClipboardList className="h-5 w-5 text-muted-foreground" />

            </div> */}


            <OrderFilters
                search={search}
                setSearch={setSearch}
                type={type}
                setType={setType}
                paymentStatus={paymentStatus}
                setPaymentStatus={setPaymentStatus}
            />


            <div className="min-h-0 flex-1 overflow-y-auto">

                {filteredOrders.length === 0 ? (

                    <div className="p-8 text-center text-sm text-muted-foreground">

                        No orders found.

                    </div>

                ) : (

                    filteredOrders.map(order => (
                        <OrderListItem
                            key={order.id}
                            order={order}
                            selected={selectedOrderId === order.id}
                            onClick={() => onSelect(order)}
                        />
                    ))

                )}

            </div>

        </div>
    )
}