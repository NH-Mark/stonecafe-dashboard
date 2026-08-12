"use client";

import { useEffect, useState } from "react";

import {
    ColumnFiltersState,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";

import { Location } from "@/types/location";
import { OrderType } from "@/types/order-type";
import { Modifier } from "@/types/modifier";
import { ModifierGroup } from "@/types/modifier-group";
import { getModifiers } from "../modifier.service";
import { modifierColumns } from "./ModifierColumns";

interface ModifierResponse {
data: Modifier[];
meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
};

}


interface Props {
    groups:ModifierGroup[];

    selectedGroup: number | null;

    onSuccess: () => Promise<void>;

}

export default function ModifierTable({
    groups,
    selectedGroup,
    onSuccess,
}: Props) {
    const [modifiers, setModifiers] =
        useState<Modifier[]>([]);

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
     * Load orders.
     */
    async function loadModifiers(
        page: number,
        perPage: number,
        searchValue: string,
        tableFilters: ColumnFiltersState,
        groupId = selectedGroup
    ) {
        try {
            setLoading(true);

            const response =
                await getModifiers({
                    page,
                    per_page: perPage,

                    search:
                        searchValue || undefined,

                    filters:
                        tableFilters.length
                            ? tableFilters
                            : undefined,
                    modifier_group_id:
                    groupId ?? undefined,

                });

            const result: ModifierResponse =
                response.data;

            setModifiers(result.data);

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
                "Failed to load modifiers:",
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
        setSearch("");
        setColumnFilters([]);

        loadModifiers(
            1,
            10,
            "",
            [],
            selectedGroup
        );
    }, [selectedGroup]);

   

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

        loadModifiers(
            page,
            pageSize,
            searchValue,
            tableFilters,
            selectedGroup
        );
    }

    /**
     * Refresh current page after
     * an order action.
     */
    async function handleSuccess() {
        await onSuccess();

        await loadModifiers(
            pagination.current_page,
            pagination.per_page,
            search,
            columnFilters,
            selectedGroup
        );
    }

    return (
        <div className="space-y-4">
         
            {/* ========================================
                ORDERS TABLE
            ======================================== */}

            <DataTable
                serverPagination={true}

                columns={modifierColumns({
                    groups,
                    onSuccess: handleSuccess,
                })}


                data={modifiers}

                searchKey="order_no"
                placeholder="Search Order..."

              
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