"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { Modifier } from "@/types/modifier";

import { modifierColumns } from "./ModifierColumns";
import { getModifiers } from "../modifier.service";

interface Props {
groups: {
id: number;
name: string;
}[];

selectedGroup: number | null;

onSuccess: () => Promise<void>;

}

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

export default function ModifierTable({
groups,
selectedGroup,
onSuccess,
}: Props) {
const [modifiers, setModifiers] =
useState<Modifier[]>([]);

const [loading, setLoading] =
    useState(false);

const [search, setSearch] =
    useState("");

const [pagination, setPagination] =
    useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: null as number | null,
        to: null as number | null,
    });

async function loadModifiers(
    page: number,
    perPage: number,
    searchValue = search,
    groupId = selectedGroup
) {
    try {
        setLoading(true);

        const response = await getModifiers({
            page,
            per_page: perPage,
            search: searchValue || undefined,
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
 * Initial load + reload
 * when modifier group changes.
 */
useEffect(() => {
    loadModifiers(
        1,
        pagination.per_page,
        search,
        selectedGroup
    );
}, [selectedGroup]);

/**
 * Pagination
 */
function handlePaginationChange(
    page: number,
    pageSize: number
) {
    loadModifiers(
        page,
        pageSize,
        search,
        selectedGroup
    );
}

/**
 * Search
 */
function handleSearch(
    value: string
) {
    setSearch(value);

    loadModifiers(
        1,
        pagination.per_page,
        value,
        selectedGroup
    );
}

/**
 * Refresh after create/update/delete.
 */
async function handleSuccess() {
    await onSuccess();

    await loadModifiers(
        pagination.current_page,
        pagination.per_page,
        search,
        selectedGroup
    );
}

return (
    <DataTable
        serverPagination={true}
        columns={modifierColumns({
            groups,
            onSuccess: handleSuccess,
        })}
        data={modifiers}
        searchKey="name"
        placeholder="Search modifiers..."
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
);

}
