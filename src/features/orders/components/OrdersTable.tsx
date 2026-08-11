"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { OrderColumns } from "./OrderColumns";
import { Order } from "../orders.types";
import { getOrders } from "../orders.service";

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
}

export default function OrdersTable({
onSuccess,
}: TableProps) {
const [orders, setOrders] = useState<Order[]>([]);

const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
    from: null as number | null,
    to: null as number | null,
});

const [loading, setLoading] = useState(false);

async function loadOrders(
    page: number,
    perPage: number
) {
    try {
        setLoading(true);

        const response = await getOrders({
            page,
            per_page: perPage,
        });

        const result: OrdersApiResponse =
            response.data;

        setOrders(result.data);

        // Laravel pagination is inside "meta"
        setPagination({
            current_page: result.meta.current_page,
            last_page: result.meta.last_page,
            per_page: result.meta.per_page,
            total: result.meta.total,
            from: result.meta.from,
            to: result.meta.to,
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
 * Initial load
 */
useEffect(() => {
    loadOrders(1, 10);
}, []);

/**
 * Pagination handler
 */
function handlePaginationChange(
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

    if (page > pagination.last_page) {
        return;
    }

    loadOrders(page, pageSize);
}

/**
 * Refresh current page after an action.
 */
async function handleSuccess() {
    await onSuccess();

    await loadOrders(
        pagination.current_page,
        pagination.per_page
    );
}

return (
    <DataTable
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
        loading={loading}
        onPaginationChange={
            handlePaginationChange
        }
    />
);

}
