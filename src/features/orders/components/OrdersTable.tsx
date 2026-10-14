"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ColumnFiltersState } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { OrderColumns } from "./OrderColumns";
import { Order } from "../orders.types";
import { getOrders } from "../orders.service";
import { Location } from "@/types/location";
import { OrderType } from "@/types/order-type";
import OrdersFilters, { OrdersFiltersState } from "./ordersFilters";

interface OrdersApiResponse {
data: Order[];
links: {
first: string | null;
last: string | null;
prev: string | null;
next: string | null;
};
meta: {
current_page: number;
last_page: number;
per_page: number;
total: number;
from: number | null;
to: number | null;
};
}

interface TableProps {
onSuccess: () => Promise<void>;
locations: Location[];
orderTypes: OrderType[];
}

const DEFAULT_FILTERS: OrdersFiltersState = {
range: "today",
start_date: undefined,
end_date: undefined,
location_id: undefined,
order_type: undefined,
};

export default function OrdersTable({
onSuccess,
locations,
orderTypes,
}: TableProps) {
const router = useRouter();

const [orders, setOrders] = useState<Order[]>([]);

const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: null as number | null,
    to: null as number | null,
});

const [loading, setLoading] = useState(false);
const [locationsReady, setLocationsReady] = useState(false);
const [activeLocationId, setActiveLocationId] =
    useState<number | undefined>(undefined);

const [search, setSearch] = useState("");
const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);
const [filters, setFilters] =
    useState<OrdersFiltersState>(DEFAULT_FILTERS);
const [refreshKey, setRefreshKey] = useState(0);

/**
 * Initialize and validate the active location.
 * The locations prop should contain only locations
 * the current user is permitted to access.
 */

useEffect(() => {
    if (locations.length === 0) {
        setLocationsReady(false);
        return;
    }

    const storedId = Number(
        Cookies.get("active_location_id")
    );

    const permittedLocation = locations.find(
        (location) => Number(location.id) === storedId
    );

    // If the user has exactly one permitted location,
    // select it automatically.
    const selectedLocation =
        locations.length === 1
            ? locations[0]
            : permittedLocation;

    if (!selectedLocation) {
        setLocationsReady(false);
        router.replace("/select-location");
        return;
    }

    const locationId = Number(selectedLocation.id);

    // Persist the selected location.
    Cookies.set("active_location_id", String(locationId), {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    setActiveLocationId(locationId);

    setFilters((current) => ({
        ...current,
        location_id: locationId,
    }));

    setLocationsReady(true);
}, [locations, router]);

/**
 * Load orders when the initialized filters,
 * search, pagination, or refresh key changes.
 */
const loadOrders = useCallback(async () => {
    if (!locationsReady || filters.location_id == null) {
        return;
    }

    if (
        filters.range === "custom" &&
        (!filters.start_date || !filters.end_date)
    ) {
        return;
    }

    try {
        setLoading(true);

        const response = await getOrders({
            page: pagination.current_page,
            per_page: pagination.per_page,
            search: search || undefined,
            filters: columnFilters.length
                ? columnFilters
                : undefined,
            range: filters.range,
            start_date: filters.start_date,
            end_date: filters.end_date,
            location_id: filters.location_id,
            order_type: filters.order_type,
        });

        const result: OrdersApiResponse = response.data;

        setOrders(result.data);

        setPagination((current) => ({
            ...current,
            current_page: result.meta.current_page,
            last_page: result.meta.last_page,
            per_page: result.meta.per_page,
            total: result.meta.total,
            from: result.meta.from,
            to: result.meta.to,
        }));
    } catch (error) {
        console.error("Failed to load orders:", error);
    } finally {
        setLoading(false);
    }
}, [
    locationsReady,
    filters,
    pagination.current_page,
    pagination.per_page,
    search,
    columnFilters,
    refreshKey,
]);

useEffect(() => {
    void loadOrders();
}, [loadOrders]);

/**
 * Apply top-level filters and return to page 1.
 */
function handleFiltersChange(
    newFilters: OrdersFiltersState
) {
    setFilters({
        ...newFilters,
        location_id:
            newFilters.location_id ?? activeLocationId,
    });

    setPagination((current) => ({
        ...current,
        current_page: 1,
    }));
}

/**
 * Handle DataTable search, column filters,
 * pagination, and page size.
 */
function handleServerStateChange(
    searchValue: string,
    tableFilters: ColumnFiltersState,
    page: number,
    pageSize: number
) {
    if (
        !Number.isFinite(page) ||
        !Number.isFinite(pageSize) ||
        page < 1 ||
        pageSize < 1
    ) {
        return;
    }

    setSearch(searchValue);
    setColumnFilters(tableFilters);

    setPagination((current) => ({
        ...current,
        current_page: page,
        per_page: pageSize,
    }));
}

/**
 * Refresh the parent and current orders after an action.
 */
async function handleSuccess() {
    await onSuccess();
    setRefreshKey((current) => current + 1);
}

return (
    <div className="space-y-4">
        <OrdersFilters
            locations={locations}
            orderTypes={orderTypes}
            filters={filters}
            onChange={handleFiltersChange}
            activeLocationId={activeLocationId}
        />

        <DataTable
            serverPagination={true}
            columns={OrderColumns({
                onSuccess: handleSuccess,
            })}
            data={orders}
            searchKey="order_no"
            placeholder="Search Order..."
            rowClassName={(order) =>
                order.payment_status === "unpaid"
                    ? "bg-red-50 hover:bg-red-100"
                    : ""
            }
            pageIndex={pagination.current_page}
            pageSize={pagination.per_page}
            pageCount={pagination.last_page}
            total={pagination.total}
            from={pagination.from}
            to={pagination.to}
            loading={loading || !locationsReady}
            onServerStateChange={handleServerStateChange}
        />
    </div>
);

}
