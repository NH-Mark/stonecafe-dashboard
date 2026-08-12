"use client";

import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";

import {
    ColumnFiltersState,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";

import { Discount } from "@/types/discount";

import { getDiscounts } from "../discount.service";

import { DiscountColumns } from "./DiscountColumns";

interface DiscountTableProps {
    onSuccess?: () => Promise<void>;
}

export interface DiscountTableRef {
    refresh: () => Promise<void>;
}

interface DiscountResponse {
    data: Discount[];

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

const DiscountTable = forwardRef<
    DiscountTableRef,
    DiscountTableProps
>(function DiscountTable(
    {
        onSuccess,
    },
    ref
) {
    const [discounts, setDiscounts] =
        useState<Discount[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>([]);

    const [pagination, setPagination] =
        useState({
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
            from: null as number | null,
            to: null as number | null,
        });

    async function loadDiscounts(
        page: number,
        perPage: number,
        searchValue: string,
        filters: ColumnFiltersState
    ) {
        try {
            setLoading(true);

            const response =
                await getDiscounts({
                    page,
                    per_page: perPage,

                    search:
                        searchValue ||
                        undefined,

                    filters:
                        filters.length
                            ? filters
                            : undefined,
                });

            const result: DiscountResponse =
                response.data;

            setDiscounts(result.data);

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
                "Failed to load discounts:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    /**
     * Refresh using the current
     * table state.
     */
    async function refresh() {
        await loadDiscounts(
            pagination.current_page,
            pagination.per_page,
            search,
            columnFilters
        );
    }

    /**
     * Expose refresh() to parent.
     */
    useImperativeHandle(
        ref,
        () => ({
            refresh,
        }),
        [
            pagination.current_page,
            pagination.per_page,
            search,
            columnFilters,
        ]
    );

    /**
     * Initial load.
     */
    useEffect(() => {
        loadDiscounts(
            1,
            10,
            "",
            []
        );
    }, []);

    /**
     * Handle server-side state.
     */
    function handleServerStateChange(
        searchValue: string,
        filters: ColumnFiltersState,
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

        setColumnFilters(filters);

        loadDiscounts(
            page,
            pageSize,
            searchValue,
            filters
        );
    }

    /**
     * Called after table actions
     * such as update/delete.
     */
    async function handleSuccess() {
        await refresh();

        if (onSuccess) {
            await onSuccess();
        }
    }

    return (
        <DataTable
            serverPagination={true}

            columns={DiscountColumns({
                onSuccess:
                    handleSuccess,
            })}

            data={discounts}

            searchKey="name"

            placeholder="Search Discount..."

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
    );
});

DiscountTable.displayName =
    "DiscountTable";

export default DiscountTable;