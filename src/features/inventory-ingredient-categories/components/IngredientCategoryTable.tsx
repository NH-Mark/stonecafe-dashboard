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
import { InventoryIngredientCategory } from "@/types/inventory-ingredient-category";
import { IngredientCategoryColumns } from "./IngredientCategoryColumns";
import { getIngredientCategories } from "../ingredient-category.service";

interface IngredientCategoryTableProps {
    onSuccess?: () => Promise<void>;
}

export interface IngredientCategoryTableRef {
    refresh: () => Promise<void>;
}

interface IngredientCategoryResponse {
    data: InventoryIngredientCategory[];

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

const IngredientCategoryTable = forwardRef<
    IngredientCategoryTableRef,
    IngredientCategoryTableProps
>(function IngredientCategoryTable(
    {
        onSuccess,
    },
    ref
) {
    const [ingredientCategories, setIngredientCategories] =
        useState<InventoryIngredientCategory[]>([]);

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

    async function loadIngredientCategories(
        page: number,
        perPage: number,
        searchValue: string,
        filters: ColumnFiltersState
    ) {
        try {
            setLoading(true);

            const response =
                await getIngredientCategories({
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

            const result: IngredientCategoryResponse =
                response.data;

            setIngredientCategories(result.data);

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
                "Failed to load ingredient categories:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    async function refresh() {
        await loadIngredientCategories(
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
        loadIngredientCategories(
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

        loadIngredientCategories(
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

            columns={IngredientCategoryColumns({
                onSuccess:
                    handleSuccess,
            })}

            data={ingredientCategories}

            searchKey="name"

            placeholder="Search category..."

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

IngredientCategoryTable.displayName =
    "IngredientCategoryTable";

export default IngredientCategoryTable;
