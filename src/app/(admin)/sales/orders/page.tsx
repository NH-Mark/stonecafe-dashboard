"use client";

import { useCallback, useEffect, useState } from "react";
import OrdersTable from "@/features/orders/components/OrdersTable";
import { getOrders } from "@/features/orders/orders.service";
import { Order } from "@/features/orders/orders.types";
import PageLoader from "@/components/common/PageLoader";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = useCallback(async () => {
        setLoading(true);
         try {
            const response = await getOrders();
            setOrders(response.data.data ?? response.data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    if(loading){
        return (
            <PageLoader/>
        );
    }

    return (
        
        <OrdersTable
            orders={orders}
            onSuccess={loadOrders}
        />
    );
}