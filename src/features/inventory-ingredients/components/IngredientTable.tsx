"use client";

import { useEffect, useState } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { InventoryIngredient } from "@/types/inventory-ingredient";
import { getIngredients } from "../ingredient.service";
import { ingredientColumns } from "./IngredientColumns";

interface IngredientResponse {
    data: InventoryIngredient[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
}

export default function IngredientTable() {
    const [ingredients, setIngredients] =
        useState<InventoryIngredient[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [pagination, setPagination] =
        useState({
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
            from: null as number | null,
            to: null as number | null,
        });

    const [search, setSearch] =
        useState("");

    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>([]);

    async function loadIngredients(
        page: number,
        perPage: number,
        search: string,
        filters: ColumnFiltersState
    ) {
        try {
            setLoading(true);

            const response =
                await getIngredients({
                    page,
                    per_page: perPage,
                    search:
                        search || undefined,
                    filters:
                        filters.length
                            ? filters
                            : undefined,
                });

            const result: IngredientResponse =
                response.data;

            setIngredients(result.data ?? []);

            setPagination({
                current_page:
                    result.meta?.current_page ?? 1,
                last_page:
                    result.meta?.last_page ?? 1,
                per_page:
                    result.meta?.per_page ?? perPage,
                total:
                    result.meta?.total ?? 0,
                from:
                    result.meta?.from ?? null,
                to:
                    result.meta?.to ?? null,
            });
        } catch (error) {
            console.error(
                "Failed to load ingredients:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadIngredients(
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

        void loadIngredients(
            page,
            pageSize,
            searchValue,
            filters
        );
    }

    async function handleSuccess() {
        await loadIngredients(
            pagination.current_page,
            pagination.per_page,
            search,
            columnFilters
        );
    }

    return (
        <DataTable
            serverPagination={true}
            columns={ingredientColumns({
                onSuccess: handleSuccess,
            })}
            data={ingredients}
            searchKey="name"
            placeholder="Search ingredient..."
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
}
