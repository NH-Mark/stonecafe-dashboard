"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/data-table/data-table";

import { Location } from "@/types/location";

import { LocationColumns } from "./LocationColumns";

import { getLocations } from "../location.service";

interface LocationTableProps {
onSuccess: () => Promise<void>;
}

interface LocationsResponse {
data: Location[];

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

export default function LocationTable({
onSuccess,
}: LocationTableProps) {
const [locations, setLocations] =
useState<Location[]>([]);

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

async function loadLocations(
    page: number,
    perPage: number,
    searchValue = search
) {
    try {
        setLoading(true);

        const response = await getLocations({
            page,
            per_page: perPage,
            search: searchValue || undefined,
        });

        const result: LocationsResponse =
            response.data;

        setLocations(result.data);

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
            "Failed to load locations:",
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
    loadLocations(1, 10);
}, []);

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

    if (
        pagination.last_page > 0 &&
        page > pagination.last_page
    ) {
        return;
    }

    loadLocations(
        page,
        pageSize,
        search
    );
}

/**
 * Server-side search
 */
function handleSearch(
    value: string
) {
    setSearch(value);

    loadLocations(
        1,
        pagination.per_page,
        value
    );
}

/**
 * Refresh after create/update/delete
 */
async function handleSuccess() {
    await onSuccess();

    await loadLocations(
        pagination.current_page,
        pagination.per_page,
        search
    );
}

return (
    <DataTable
        serverPagination={true}
        columns={LocationColumns({
            onSuccess: handleSuccess,
        })}
        data={locations}
        searchKey="name"
        placeholder="Search Location..."
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
