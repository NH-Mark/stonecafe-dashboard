"use client";

import {
ColumnDef,
flexRender,
getCoreRowModel,
getFilteredRowModel,
getSortedRowModel,
useReactTable,
ColumnFiltersState,
SortingState,
} from "@tanstack/react-table";

import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import ColumnFilter from "./ColumnFilter";

interface DataTableProps<TData, TValue> {
columns: ColumnDef<TData, TValue>[];
data: TData[];

searchKey?: string;
placeholder?: string;

rowClassName?: (row: TData) => string;

pageIndex: number;
pageSize: number;
pageCount: number;

total: number;
from: number | null;
to: number | null;

loading?: boolean;

onPaginationChange: (
    page: number,
    pageSize: number
) => void;

onSearchChange?: (search: string) => void;

}


export function DataTable<TData, TValue>({
columns,
data,
searchKey,
placeholder = "Search...",
rowClassName,

pageIndex,
pageSize,
pageCount,

total,
from,
to,

loading = false,

onPaginationChange,


}: DataTableProps<TData, TValue>) {
const [search, setSearch] = useState("");

const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);

const [sorting, setSorting] =
    useState<SortingState>([]);

/**
 * IMPORTANT:
 *
 * Pagination is handled by Laravel.
 *
 * Therefore we DO NOT use:
 *
 * getPaginationRowModel()
 *
 * TanStack only renders the records that Laravel
 * has already returned for the current page.
 */
const table = useReactTable({
    data,
    columns,

    state: {
        globalFilter: search,
        columnFilters,
        sorting,
    },

    onGlobalFilterChange: setSearch,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,

    manualPagination: true,

    pageCount,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
});

/**
 * Clear local table filters.
 *
 * If search/filtering is moved completely to Laravel,
 * you should also send these values to the parent.
 */
function clearFilters() {
    setSearch("");
    setColumnFilters([]);

    onPaginationChange(1, pageSize);
}

/**
 * Go to a specific page.
 */
function goToPage(page: number) {
    if (page < 1 || page > pageCount) {
        return;
    }

    onPaginationChange(page, pageSize);
}

/**
 * Change page size.
 *
 * We reset to page 1 because changing page size can
 * make the current page invalid.
 */
function changePageSize(size: number) {
    onPaginationChange(1, size);
}

return (
    <div className="space-y-4">
        {/* Search / Filters */}
        <div className="flex items-center gap-3">
            {searchKey && (
                <Input
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);

                        /**
                         * Reset to first page when searching.
                         *
                         * IMPORTANT:
                         * For true server-side search, the parent
                         * should receive this search value and send
                         * it to Laravel.
                         */
                        onPaginationChange(1, pageSize);
                    }}
                    className="max-w-sm bg-white"
                />
            )}

            {(columnFilters.length > 0 || search) && (
                <Button
                    variant="outline"
                    onClick={clearFilters}
                >
                    Clear Filters
                </Button>
            )}
        </div>

        {/* Table */}
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(
                        (headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                            >
                                {headerGroup.headers.map(
                                    (header) => (
                                        <TableHead
                                            key={header.id}
                                        >
                                            <div className="space-y-2">
                                                <div className="group flex items-center justify-between w-full">
                                                    <div className="truncate">
                                                        {flexRender(
                                                            header
                                                                .column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                    </div>

                                                    {header.column.getCanFilter() && (
                                                        <div className="ml-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <ColumnFilter
                                                                column={
                                                                    header.column
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableHead>
                                    )
                                )}
                            </TableRow>
                        )
                    )}
                </TableHeader>

                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows.length ? (
                        table
                            .getRowModel()
                            .rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className={rowClassName?.(
                                        row.original
                                    )}
                                >
                                    {row
                                        .getVisibleCells()
                                        .map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                            >
                                                {flexRender(
                                                    cell.column
                                                        .columnDef
                                                        .cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No records found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
            {/* Result count */}
            <div className="text-sm text-muted-foreground">
                Showing{" "}
                {from ?? 0}
                {" - "}
                {to ?? 0}
                {" of "}
                {total} entries
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                {/* First */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(1)}
                    disabled={
                        loading ||
                        pageIndex <= 1 ||
                        pageCount <= 1
                    }
                >
                    {"<<"}
                </Button>

                {/* Previous */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        goToPage(pageIndex - 1)
                    }
                    disabled={
                        loading ||
                        pageIndex <= 1
                    }
                >
                    Previous
                </Button>

                {/* Page number */}
                <span className="text-sm px-2">
                    Page {pageIndex} of {pageCount}
                </span>

                {/* Next */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        goToPage(pageIndex + 1)
                    }
                    disabled={
                        loading ||
                        pageIndex >= pageCount
                    }
                >
                    Next
                </Button>

                {/* Last */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        goToPage(pageCount)
                    }
                    disabled={
                        loading ||
                        pageIndex >= pageCount
                    }
                >
                    {">>"}
                </Button>

                {/* Page size */}
                <select
                    className="border rounded-md px-2 py-1 text-sm"
                    value={pageSize}
                    disabled={loading}
                    onChange={(e) =>
                        changePageSize(
                            Number(e.target.value)
                        )
                    }
                >
                    {[10, 20, 50, 100].map(
                        (size) => (
                            <option
                                key={size}
                                value={size}
                            >
                                {size} / page
                            </option>
                        )
                    )}
                </select>
            </div>
        </div>
    </div>
);

}
