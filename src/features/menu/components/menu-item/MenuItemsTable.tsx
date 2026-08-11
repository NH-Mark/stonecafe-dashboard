"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

import { Category } from "@/types/category";
import { MenuItem } from "@/types/menu-item";

import { menuItemColumns } from "./MenuItemColumns";
import { getMenuItems } from "../../menu.service";

interface Props {
items?: MenuItem[];

categories: Category[];

selectedCategory: number | null;

onSuccess: () => Promise<void>;

}

interface MenuItemsResponse {
data: MenuItem[];

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

export default function MenuItemsTable({
categories,
selectedCategory,
onSuccess,
}: Props) {
const [menuItems, setMenuItems] =
useState<MenuItem[]>([]);

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

const [loading, setLoading] =
    useState(false);

async function loadMenuItems(
    page: number,
    perPage: number,
    searchValue = search,
    categoryId = selectedCategory
) {
    try {
        setLoading(true);

        const response = await getMenuItems({
            page,
            per_page: perPage,
            search: searchValue,
            category_id: categoryId,
        });

        const result: MenuItemsResponse =
            response.data;

        setMenuItems(result.data);

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
            "Failed to load menu items:",
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
    loadMenuItems(
        1,
        pagination.per_page,
        search,
        selectedCategory
    );
}, [selectedCategory]);

/**
 * Pagination
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

    loadMenuItems(
        page,
        pageSize,
        search,
        selectedCategory
    );
}

/**
 * Server-side search
 */
function handleSearch(
    value: string
) {
    setSearch(value);

    loadMenuItems(
        1,
        pagination.per_page,
        value,
        selectedCategory
    );
}

/**
 * Refresh after create/update/delete
 */
async function handleSuccess() {
    await onSuccess();

    await loadMenuItems(
        pagination.current_page,
        pagination.per_page,
        search,
        selectedCategory
    );
}

return (
    <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold">
                    Menu Items
                </h2>
            </div>
            
            <Link href="/menu/create">
                <Button>
                    New Menu Item
                </Button>
            </Link>
        </div>

        {/* Table */}
        <DataTable
            serverPagination={true}
            columns={menuItemColumns({
                categories,
                onSuccess: handleSuccess,
            })}

            data={menuItems}

            searchKey="name"

            placeholder="Search menu items..."

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

            onPaginationChange={
                handlePaginationChange
            }

            onSearchChange={
                handleSearch
            }
        />
    </div>
);

}
