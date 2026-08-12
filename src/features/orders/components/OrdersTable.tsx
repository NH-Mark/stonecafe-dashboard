"use client";

import { useEffect, useState } from "react";

import {
    ColumnFiltersState,
} from "@tanstack/react-table";

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
    const [orders, setOrders] =
        useState<Order[]>([]);

    const [pagination, setPagination] =
        useState({
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
            from: null as number | null,
            to: null as number | null,
        });

    const [loading, setLoading] =
        useState(false);

    /**
     * Search.
     */
    const [search, setSearch] =
        useState("");

    /**
     * DataTable column filters.
     */
    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>([]);

    /**
     * Top-level order filters.
     */
    const [filters, setFilters] =
        useState<OrdersFiltersState>(
            DEFAULT_FILTERS
        );

    /**
     * Load orders.
     */
    async function loadOrders(
        page: number,
        perPage: number,
        searchValue: string,
        tableFilters: ColumnFiltersState,
        orderFilters: OrdersFiltersState
    ) {
        try {
            setLoading(true);

            const response =
                await getOrders({
                    page,
                    per_page: perPage,

                    search:
                        searchValue || undefined,

                    filters:
                        tableFilters.length
                            ? tableFilters
                            : undefined,
                    range:
                        orderFilters.range,

                    start_date:
                        orderFilters.start_date,

                    end_date:
                        orderFilters.end_date,

                    location_id:
                        orderFilters.location_id,

                    order_type:
                        orderFilters.order_type,
                });

            const result: OrdersApiResponse =
                response.data;

            setOrders(result.data);

            setPagination({
                current_page:
                    result.meta.current_page,

                last_page:
                    result.meta.last_page,

                per_page:
                    result.meta.per_page,

                total:
                    result.meta.total,

                from:
                    result.meta.from,

                to:
                    result.meta.to,
            });
        } catch (error) {
            console.error(
                "Failed to load orders:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    /**
     * Initial load.
     */
    useEffect(() => {
        loadOrders(
            1,
            10,
            "",
            [],
            DEFAULT_FILTERS
        );
    }, []);

    /**
     * Handle top-level filters.
     */
    function handleFiltersChange(
        newFilters: OrdersFiltersState
    ) {
        setFilters(newFilters);

        /**
         * Every filter change starts
         * from page 1.
         */
        loadOrders(
            1,
            pagination.per_page,
            search,
            columnFilters,
            newFilters
        );
    }

    /**
     * Handle DataTable server state.
     *
     * This handles:
     *
     * - search
     * - column filters
     * - pagination
     * - page size
     */
    function handleServerStateChange(
        searchValue: string,
        tableFilters: ColumnFiltersState,
        page: number,
        pageSize: number
    ) {
        if (!Number.isFinite(page)) {
            return;
        }

        if (!Number.isFinite(pageSize)) {
            return;
        }

        if (page < 1) {
            return;
        }

        setSearch(searchValue);

        setColumnFilters(tableFilters);

        loadOrders(
            page,
            pageSize,
            searchValue,
            tableFilters,
            filters
        );
    }

    /**
     * Refresh current page after
     * an order action.
     */
    async function handleSuccess() {
        await onSuccess();

        await loadOrders(
            pagination.current_page,
            pagination.per_page,
            search,
            columnFilters,
            filters
        );
    }

    return (
        <div className="space-y-4">
            {/* ========================================
                TOP ORDER FILTERS
            ======================================== */}

            <OrdersFilters
                locations={locations}
                orderTypes={orderTypes}
                filters={filters}
                onChange={
                    handleFiltersChange
                }
            />

            {/* ========================================
                ORDERS TABLE
            ======================================== */}

            <DataTable
                serverPagination={true}

                columns={OrderColumns({
                    onSuccess:
                        handleSuccess,
                })}

                data={orders}

                searchKey="order_no"
                placeholder="Search Order..."

                rowClassName={(order) =>
                    order.payment_status ===
                    "unpaid"
                        ? "bg-red-50 hover:bg-red-100"
                        : ""
                }

                pageIndex={
                    pagination.current_page
                }

                pageSize={
                    pagination.per_page
                }

                pageCount={
                    pagination.last_page
                }

                total={
                    pagination.total
                }

                from={
                    pagination.from
                }

                to={
                    pagination.to
                }

                loading={loading}

                onServerStateChange={
                    handleServerStateChange
                }
            />
        </div>
    );
}