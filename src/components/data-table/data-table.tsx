"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnFiltersState,
    SortingState,
    PaginationState,
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

import { useEffect, useState } from "react";
import ColumnFilter from "./ColumnFilter";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];

    searchKey?: string;
    placeholder?: string;

    rowClassName?: (row: TData) => string;

    /**
     * Server-side pagination
     */
    serverPagination?: boolean;

    pageIndex?: number;
    pageSize?: number;
    pageCount?: number;

    total?: number;
    from?: number | null;
    to?: number | null;

    loading?: boolean;

    onPaginationChange?: (
        page: number,
        pageSize: number
    ) => void;

    onSearchChange?: (
        value: string
    ) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,

    searchKey,
    placeholder = "Search...",

    rowClassName,

    serverPagination = false,

    pageIndex = 1,
    pageSize = 20,
    pageCount = 1,

    total,
    from,
    to,

    loading = false,

    onPaginationChange,

    onSearchChange,
}: DataTableProps<TData, TValue>) {
    const [search, setSearch] = useState("");

    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>([]);

    const [sorting, setSorting] =
        useState<SortingState>([]);

    /**
     * Client-side pagination state.
     *
     * TanStack uses 0-based pageIndex internally.
     */
    const [clientPagination, setClientPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });

    /**
     * Reset client pagination when data changes.
     */
    useEffect(() => {
        if (!serverPagination) {
            setClientPagination((previous) => ({
                ...previous,
                pageIndex: 0,
            }));
        }
    }, [data.length, serverPagination]);

    const table = useReactTable({
        data,
        columns,

        state: {
            globalFilter: search,
            columnFilters,
            sorting,

            ...(serverPagination
                ? {}
                : {
                      pagination: clientPagination,
                  }),
        },

        onGlobalFilterChange: setSearch,

        onColumnFiltersChange: setColumnFilters,

        onSortingChange: setSorting,

        /**
         * Server-side pagination
         */
        manualPagination: serverPagination,

        pageCount: serverPagination
            ? pageCount
            : undefined,

        /**
         * Client-side pagination
         */
        ...(serverPagination
            ? {}
            : {
                  onPaginationChange:
                      setClientPagination,
                  getPaginationRowModel:
                      getPaginationRowModel(),
              }),

        getCoreRowModel: getCoreRowModel(),

        getFilteredRowModel:
            getFilteredRowModel(),

        getSortedRowModel:
            getSortedRowModel(),
              
    });

    /**
     * Clear filters.
     */
    function clearFilters() {
        setSearch("");
        setColumnFilters([]);

        if (serverPagination) {
            onPaginationChange?.(
                1,
                pageSize
            );
        } else {
            table.setPageIndex(0);
        }
    }

    /**
     * Search.
     *
     * For server-side searching you should eventually
     * send search to Laravel.
     */
    function handleSearch(value: string) {
        setSearch(value);

        if (serverPagination) {
            onPaginationChange?.(
                1,
                pageSize
            );
        } else {
            table.setPageIndex(0);
        }
    }

    /**
     * Server-side page navigation.
     */
    function goToPage(page: number) {
        if (
            page < 1 ||
            page > pageCount ||
            loading
        ) {
            return;
        }

        onPaginationChange?.(
            page,
            pageSize
        );
    }

    /**
     * Server-side page size.
     */
    function changeServerPageSize(
        size: number
    ) {
        onPaginationChange?.(
            1,
            size
        );
    }

    /**
     * Client-side pagination information.
     */
    const clientRows =
        table.getFilteredRowModel().rows;

    const clientPageIndex =
        table.getState().pagination?.pageIndex ?? 0;

    const clientPageSize =
        table.getState().pagination?.pageSize ?? 10;

    const clientPageCount =
        Math.max(
            1,
            Math.ceil(
                clientRows.length /
                    clientPageSize
            )
        );

    const currentPage =
        serverPagination
            ? pageIndex
            : clientPageIndex + 1;

    const currentPageCount =
        serverPagination
            ? pageCount
            : clientPageCount;

    const currentTotal =
        serverPagination
            ? total ?? 0
            : clientRows.length;

    const currentFrom =
        serverPagination
            ? from ?? 0
            : clientRows.length === 0
            ? 0
            : clientPageIndex *
                  clientPageSize +
              1;

    const currentTo =
        serverPagination
            ? to ?? 0
            : Math.min(
                  (clientPageIndex + 1) *
                      clientPageSize,
                  clientRows.length
              );

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-3">
                {searchKey && (
                    <Input
                        placeholder={placeholder}
                        value={search}
                        onChange={(e) => {
                            const value = e.target.value;

                            setSearch(value);

                            onSearchChange?.(value);

                            if (serverPagination) {
                                onPaginationChange?.(
                                    1,
                                    pageSize
                                );
                            } else {
                                table.setPageIndex(0);
                            }
                        }}
                        className="max-w-sm bg-white"
                    />
                )}

                {(columnFilters.length > 0 ||
                    search) && (
                    <Button
                        variant="outline"
                        onClick={
                            clearFilters
                        }
                    >
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        {table
                            .getHeaderGroups()
                            .map(
                                (
                                    headerGroup
                                ) => (
                                    <TableRow
                                        key={
                                            headerGroup.id
                                        }
                                    >
                                        {headerGroup.headers.map(
                                            (
                                                header
                                            ) => (
                                                <TableHead
                                                    key={
                                                        header.id
                                                    }
                                                >
                                                    <div className="group flex w-full items-center justify-between">
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
                                    colSpan={
                                        columns.length
                                    }
                                    className="h-24 text-center"
                                >
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel()
                              .rows.length ? (
                            table
                                .getRowModel()
                                .rows.map(
                                    (
                                        row
                                    ) => (
                                        <TableRow
                                            key={
                                                row.id
                                            }
                                            className={rowClassName?.(
                                                row.original
                                            )}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map(
                                                    (
                                                        cell
                                                    ) => (
                                                        <TableCell
                                                            key={
                                                                cell.id
                                                            }
                                                        >
                                                            {flexRender(
                                                                cell
                                                                    .column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    )
                                                )}
                                        </TableRow>
                                    )
                                )
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        columns.length
                                    }
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
                <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    {currentFrom} -{" "}
                    {currentTo} of{" "}
                    {currentTotal} entries
                </div>

                <div className="flex items-center gap-2">
                    {/* First */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={
                            loading ||
                            currentPage <= 1
                        }
                        onClick={() => {
                            if (
                                serverPagination
                            ) {
                                goToPage(1);
                            } else {
                                table.setPageIndex(
                                    0
                                );
                            }
                        }}
                    >
                        {"<<"}
                    </Button>

                    {/* Previous */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={
                            loading ||
                            currentPage <= 1
                        }
                        onClick={() => {
                            if (
                                serverPagination
                            ) {
                                goToPage(
                                    currentPage -
                                        1
                                );
                            } else {
                                table.previousPage();
                            }
                        }}
                    >
                        Previous
                    </Button>

                    <span className="px-2 text-sm">
                        Page{" "}
                        {currentPage} of{" "}
                        {currentPageCount}
                    </span>

                    {/* Next */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={
                            loading ||
                            currentPage >=
                                currentPageCount
                        }
                        onClick={() => {
                            if (
                                serverPagination
                            ) {
                                goToPage(
                                    currentPage +
                                        1
                                );
                            } else {
                                table.nextPage();
                            }
                        }}
                    >
                        Next
                    </Button>

                    {/* Last */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={
                            loading ||
                            currentPage >=
                                currentPageCount
                        }
                        onClick={() => {
                            if (
                                serverPagination
                            ) {
                                goToPage(
                                    currentPageCount
                                );
                            } else {
                                table.setPageIndex(
                                    currentPageCount -
                                        1
                                );
                            }
                        }}
                    >
                        {">>"}
                    </Button>

                    {/* Page size */}
                    <select
                        className="rounded-md border px-2 py-1 text-sm"
                        value={
                            serverPagination
                                ? pageSize
                                : clientPageSize
                        }
                        disabled={loading}
                        onChange={(e) => {
                            const size =
                                Number(
                                    e.target
                                        .value
                                );

                            if (
                                serverPagination
                            ) {
                                changeServerPageSize(
                                    size
                                );
                            } else {
                                table.setPageSize(
                                    size
                                );
                                table.setPageIndex(
                                    0
                                );
                            }
                        }}
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