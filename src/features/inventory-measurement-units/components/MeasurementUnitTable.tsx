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
import { InventoryMeasurementUnit } from "@/types/inventory-measurement-unit";
import { MeasurementUnitColumns } from "./MeasurementUnitColumns";
import { getMeasurementUnits } from "../measurement-unit.service";

interface MeasurementUnitTableProps {
    onSuccess?: () => Promise<void>;
}

export interface MeasurementUnitTableRef {
    refresh: () => Promise<void>;
}

interface MeasurementUnitResponse {
    data: InventoryMeasurementUnit[];

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

const MeasurementUnitTable = forwardRef<
    MeasurementUnitTableRef,
    MeasurementUnitTableProps
>(function MeasurementUnitTable(
    {
        onSuccess,
    },
    ref
) {
    const [measurementUnits, setMeasurementUnits] =
        useState<InventoryMeasurementUnit[]>([]);

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

    async function loadMeasurementUnits(
        page: number,
        perPage: number,
        searchValue: string,
        filters: ColumnFiltersState
    ) {
        try {
            setLoading(true);

            const response =
                await getMeasurementUnits({
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

            const result: MeasurementUnitResponse =
                response.data;

            setMeasurementUnits(result.data);

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
                "Failed to load measurement units:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    async function refresh() {
        await loadMeasurementUnits(
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
        loadMeasurementUnits(
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

        loadMeasurementUnits(
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
            columns={MeasurementUnitColumns({
                onSuccess: handleSuccess,
            })}
            data={measurementUnits}
            searchKey="name"
            placeholder="Search measurement unit..."
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

MeasurementUnitTable.displayName =
    "MeasurementUnitTable";

export default MeasurementUnitTable;
