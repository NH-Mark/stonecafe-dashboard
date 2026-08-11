"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/data-table/data-table";

import { staffColumns } from "./StaffColumns";

import { User } from "@/types/user";
import { Role } from "@/types/role";
import { Location } from "@/types/location";

import { getStaff } from "../staff.service";

interface StaffTableProps {
onSuccess: () => Promise<void>;

roles: Role[];

locations: Location[];

selectedRole: number | null;

}

interface StaffResponse {
data: User[];

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

export default function StaffTable({
onSuccess,
roles,
locations,
selectedRole,
}: StaffTableProps) {
const [users, setUsers] =
useState<User[]>([]);

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

async function loadStaff(
    page: number,
    perPage: number,
    searchValue = search,
    roleId = selectedRole
) {
    try {
        setLoading(true);

        const response = await getStaff({
            page,
            per_page: perPage,
            search: searchValue || undefined,
            role_id: roleId,
        });

        const result: StaffResponse =
            response.data;

        setUsers(result.data);

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
            "Failed to load staff:",
            error
        );
    } finally {
        setLoading(false);
    }
}

/**
 * Initial load + role change.
 */
useEffect(() => {
    loadStaff(
        1,
        pagination.per_page,
        search,
        selectedRole
    );
}, [selectedRole]);

/**
 * Pagination.
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

    loadStaff(
        page,
        pageSize,
        search,
        selectedRole
    );
}

/**
 * Server-side search.
 */
function handleSearch(
    value: string
) {
    setSearch(value);

    loadStaff(
        1,
        pagination.per_page,
        value,
        selectedRole
    );
}

/**
 * Refresh after create/update/delete.
 */
async function handleSuccess() {
    await onSuccess();

    await loadStaff(
        pagination.current_page,
        pagination.per_page,
        search,
        selectedRole
    );
}

return (
    <DataTable
        serverPagination={true}
        columns={staffColumns({
            onSuccess: handleSuccess,
            roles,
            locations,
        })}
        data={users}
        searchKey="name"
        placeholder="Search staff..."
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
