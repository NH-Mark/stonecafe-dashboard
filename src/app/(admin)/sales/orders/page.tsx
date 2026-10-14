"use client";

import { useEffect, useState } from "react";

import OrdersTable from "@/features/orders/components/OrdersTable";
import { getOrderTypes } from "@/features/sales/sales.service";
import PageLoader from "@/components/common/PageLoader";
import { OrderType } from "@/types/order-type";
import { getLocationSelectors } from "@/features/locations/location.service";
import { Location } from "@/types/location";
import { useAuth } from "@/features/auth/useAuth"; // Adjust to your auth hook
import Cookies from "js-cookie";
export default function OrdersPage() {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState<Location[]>([]);
    const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);

    useEffect(() => {
        async function loadPageData() {
            try {
                setLoading(true);

                const [locationResponse, orderTypeResponse] =
                    await Promise.all([
                        getLocationSelectors(),
                        getOrderTypes(),
                    ]);

                setLocations(locationResponse);
                setOrderTypes(
                    orderTypeResponse.data.data ??
                    orderTypeResponse.data
                );
            } catch (error) {
                console.error("Failed to load orders page data:", error);
            } finally {
                setLoading(false);
            }
        }

        void loadPageData();
    }, []);

    if (loading || !user) {
        return <PageLoader />;
    }

    const isSuperAdmin = user?.roles?.some(
        (role) => role.name === "Super Admin"
    );

     const activeLocationId = Number(
        Cookies.get("active_location_id")
    );

    const visibleLocations = isSuperAdmin
    ? locations
    : locations.filter(
          (location) => Number(location.id) === activeLocationId
      );

    return (
        <OrdersTable
            locations={visibleLocations}
            orderTypes={orderTypes}
            onSuccess={async () => {}}
        />
    );
}
