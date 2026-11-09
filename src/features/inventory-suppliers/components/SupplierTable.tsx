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
import { InventorySupplier } from "@/types/inventory-supplier";
import { SupplierColumns } from "./SupplierColumns";
import { getSuppliers } from "../supplier.service";

interface SupplierTableProps {
    onSuccess?: () => Promise<void>;
}

export interface SupplierTableRef {
    refresh: () => Promise<void>;
}

interface SupplierResponse {
    data: InventorySupplier[];

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

const SupplierTable = forwardRef<
    SupplierTableRef,
    SupplierTableProps
>(function SupplierTable(
    {
        onSuccess,
    },
    ref
) {
    const [suppliers, setSuppliers] =
        useState<InventorySupplier[]>([]);

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

    async function loadSuppliers(
        page: number,
        perPage: number,
        searchValue: string,
        filters: ColumnFiltersState
    ) {
        try {
            setLoading(true);

            const response =
                await getSuppliers({
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

            const result: SupplierResponse =
                response.data;

            setSuppliers(result.data);

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
                "Failed to load suppliers:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    async function refresh() {
        await loadSuppliers(
            pagination.current_page,
            pagination.per_page,
            search,
            columnFilters
        );
    }

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

    useEffect(() => {
        loadSuppliers(
            1,
            10,
            "",
            []
        );
    }, []);

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

        loadSuppliers(
            page,
            pageSize,
            searchValue,
            filters
        );
    }

    async function handleSuccess() {
        await refresh();

        if (onSuccess) {
            await onSuccess();
        }
    }

    return (
        <DataTable
            serverPagination={true}
            columns={SupplierColumns({
                onSuccess: handleSuccess,
            })}
            data={suppliers}
            searchKey="name"
            placeholder="Search supplier..."
            pageIndex={pagination.current_page}
            pageSize={pagination.per_page}
            pageCount={pagination.last_page}
            total={pagination.total}
            from={pagination.from}
            to={pagination.to}
            loading={loading}
            onServerStateChange={handleServerStateChange}
        />
    );
});

SupplierTable.displayName =
    "SupplierTable";

export default SupplierTable;
