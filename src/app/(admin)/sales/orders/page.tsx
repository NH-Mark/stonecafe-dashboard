"use client";

import { useEffect, useState } from "react";

import OrdersTable from "@/features/orders/components/OrdersTable";

import { getOrderTypes } from "@/features/sales/sales.service";


import PageLoader from "@/components/common/PageLoader";
import { OrderType } from "@/types/order-type";
import { getLocations } from "@/features/locations/location.service";
import { Location } from "@/types/location";

export default function OrdersPage() {
    const [loading, setLoading] = useState(true);

    const [locations, setLocations] = useState<Location[]>([]);
    const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);

    async function loadLocations() {
        try {
            const response = await getLocations();

            setLocations(
                response.data.data ?? response.data
            );
        } catch (error) {
            console.error(
                "Failed to load locations:",
                error
            );
        }
    }

    async function loadOrderTypes() {
        try {
            const response = await getOrderTypes();

            setOrderTypes(
                response.data.data ?? response.data
            );
        } catch (error) {
            console.error(
                "Failed to load order types:",
                error
            );
        }
    }

    async function loadPageData() {
        try {
            setLoading(true);

            await Promise.all([
                loadLocations(),
                loadOrderTypes(),
            ]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPageData();
    }, []);

    if (loading) {
        return <PageLoader />;
    }

    return (
        <OrdersTable
            locations={locations}
            orderTypes={orderTypes}
            onSuccess={async () => {
                // OrdersTable handles its own reload.
            }}
        />
    );
}