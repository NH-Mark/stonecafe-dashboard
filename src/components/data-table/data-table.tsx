
"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
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

import {
    useEffect,
    useRef,
    useState,
} from "react";

import ColumnFilter from "./ColumnFilter";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];

    searchKey?: string;
    placeholder?: string;

    rowClassName?: (row: TData) => string;

    /**
     * Server-side pagination.
     */
    serverPagination?: boolean;

    /**
     * Laravel pagination values.
     */
    pageIndex?: number;
    pageSize?: number;
    pageCount?: number;

    total?: number;
    from?: number | null;
    to?: number | null;

    loading?: boolean;

    /**
     * Normal pagination callback.
     */
    onPaginationChange?: (
        page: number,
        pageSize: number
    ) => void;

    /**
     * Complete server-side state.
     *
     * search:
     * Global search value.
     *
     * filters:
     * TanStack column filters.
     *
     * page:
     * 1-based page.
     *
     * pageSize:
     * Records per page.
     */
    onServerStateChange?: (
        search: string,
        filters: ColumnFiltersState,
        page: number,
        pageSize: number
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
    onServerStateChange,
}: DataTableProps<TData, TValue>) {
    /**
     * Global search.
     */
    const [search, setSearch] = useState("");

    /**
     * Column filters.
     */
    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>([]);

    /**
     * Sorting.
     */
    const [sorting, setSorting] =
        useState<SortingState>([]);

    /**
     * Client-side pagination.
     */
    const [clientPagination, setClientPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });

    /**
     * Search debounce timer.
     */
    const searchTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(
            null
        );

    /**
     * Column filter debounce timer.
     */
    const filterTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(
            null
        );

    /**
     * Keep the latest search value available
     * even if a request is currently loading.
     */
    const searchRef = useRef(search);

    /**
     * Keep latest filters available.
     */
    const columnFiltersRef =
        useRef(columnFilters);

    /**
     * Cleanup timers.
     */
    useEffect(() => {
        return () => {
            if (searchTimerRef.current) {
                clearTimeout(
                    searchTimerRef.current
                );
            }

            if (filterTimerRef.current) {
                clearTimeout(
                    filterTimerRef.current
                );
            }
        };
    }, []);

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

    /**
     * TanStack table.
     */
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
                      pagination:
                          clientPagination,
                  }),
        },

        /**
         * TanStack global filter.
         */
        onGlobalFilterChange: setSearch,

        /**
         * Column filters.
         */
        onColumnFiltersChange: (updater) => {
            setColumnFilters((previous) => {
                const next =
                    typeof updater === "function"
                        ? updater(previous)
                        : updater;

                columnFiltersRef.current = next;

                /**
                 * Server-side filtering.
                 *
                 * Debounce this as well so a filter
                 * doesn't make a request on every
                 * small change.
                 */
                if (serverPagination) {
                    if (
                        filterTimerRef.current
                    ) {
                        clearTimeout(
                            filterTimerRef.current
                        );
                    }

                    filterTimerRef.current =
                        setTimeout(() => {
                            onServerStateChange?.(
                                searchRef.current,
                                next,
                                1,
                                pageSize
                            );
                        }, 300);
                }

                return next;
            });
        },

        /**
         * Sorting.
         */
        onSortingChange: setSorting,

        /**
         * Server pagination.
         */
        manualPagination:
            serverPagination,

        pageCount: serverPagination
            ? pageCount
            : undefined,

        /**
         * Server filtering.
         */
        manualFiltering:
            serverPagination,

        /**
         * Client-side functionality.
         */
        ...(serverPagination
            ? {}
            : {
                  onPaginationChange:
                      setClientPagination,

                  getPaginationRowModel:
                      getPaginationRowModel(),

                  getFilteredRowModel:
                      getFilteredRowModel(),
              }),

        getCoreRowModel:
            getCoreRowModel(),

        getSortedRowModel:
            getSortedRowModel(),
    });

    /**
     * Search input.
     *
     * IMPORTANT:
     *
     * We DO NOT disable the input while loading.
     *
     * Search is debounced by 400ms.
     */
    function handleSearch(value: string) {
        /**
         * Update UI immediately.
         */
        setSearch(value);

        /**
         * Update ref immediately.
         */
        searchRef.current = value;

        /**
         * Cancel previous timer.
         */
        if (searchTimerRef.current) {
            clearTimeout(
                searchTimerRef.current
            );
        }

        /**
         * Client-side table.
         */
        if (!serverPagination) {
            table.setPageIndex(0);
            return;
        }

        /**
         * Wait until user stops typing.
         *
         * Example:
         *
         * "1080"
         *
         * Instead of:
         *
         * 1 -> request
         * 10 -> request
         * 108 -> request
         * 1080 -> request
         *
         * We only send:
         *
         * 1080 -> request
         */
        searchTimerRef.current =
            setTimeout(() => {
                onServerStateChange?.(
                    value,
                    columnFiltersRef.current,
                    1,
                    pageSize
                );
            }, 400);
    }

    /**
     * Clear search + filters.
     */
    function clearFilters() {
        /**
         * Cancel pending search request.
         */
        if (searchTimerRef.current) {
            clearTimeout(
                searchTimerRef.current
            );
        }

        /**
         * Cancel pending filter request.
         */
        if (filterTimerRef.current) {
            clearTimeout(
                filterTimerRef.current
            );
        }

        /**
         * Clear local state immediately.
         */
        setSearch("");
        setColumnFilters([]);

        /**
         * Update refs.
         */
        searchRef.current = "";
        columnFiltersRef.current = [];

        /**
         * Server-side.
         *
         * ONE request only.
         */
        if (serverPagination) {
            onServerStateChange?.(
                "",
                [],
                1,
                pageSize
            );

            return;
        }

        /**
         * Client-side.
         */
        table.setPageIndex(0);
    }

    /**
     * Server-side page navigation.
     */
    function goToPage(page: number) {
        if (
            page < 1 ||
            page > pageCount
        ) {
            return;
        }

        /**
         * Don't block navigation just because
         * another search request is loading.
         *
         * Parent can decide how to handle
         * concurrent requests.
         */
        if (serverPagination) {
            onServerStateChange?.(
                searchRef.current,
                columnFiltersRef.current,
                page,
                pageSize
            );
        } else {
            onPaginationChange?.(
                page,
                pageSize
            );
        }
    }

    /**
     * Change page size.
     */
    function changeServerPageSize(
        size: number
    ) {
        if (!Number.isFinite(size)) {
            return;
        }

        if (serverPagination) {
            onServerStateChange?.(
                searchRef.current,
                columnFiltersRef.current,
                1,
                size
            );
        } else {
            table.setPageSize(size);
            table.setPageIndex(0);
        }
    }

    /**
     * Client-side rows.
     */
    const clientRows =
        table.getFilteredRowModel().rows;

    /**
     * Client page index.
     */
    const clientPageIndex =
        table.getState().pagination
            ?.pageIndex ?? 0;

    /**
     * Client page size.
     */
    const clientPageSize =
        table.getState().pagination
            ?.pageSize ?? 10;

    /**
     * Client page count.
     */
    const clientPageCount =
        Math.max(
            1,
            Math.ceil(
                clientRows.length /
                    clientPageSize
            )
        );

    /**
     * Current page.
     */
    const currentPage =
        serverPagination
            ? pageIndex
            : clientPageIndex + 1;

    /**
     * Current page count.
     */
    const currentPageCount =
        serverPagination
            ? pageCount
            : clientPageCount;

    /**
     * Total.
     */
    const currentTotal =
        serverPagination
            ? total ?? 0
            : clientRows.length;

    /**
     * From.
     */
    const currentFrom =
        serverPagination
            ? from ?? 0
            : clientRows.length === 0
              ? 0
              : clientPageIndex *
                    clientPageSize +
                1;

    /**
     * To.
     */
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
                        placeholder={
                            placeholder
                        }
                        value={search}
                        onChange={(e) => {
                            handleSearch(
                                e.target.value
                            );
                        }}
                        className="max-w-sm bg-white"

                        /**
                         * IMPORTANT:
                         *
                         * Do NOT use:
                         *
                         * disabled={loading}
                         *
                         * Otherwise the user can only
                         * type one character at a time.
                         */
                    />
                )}

                {(columnFilters.length >
                    0 ||
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
                            currentPage <=
                                1
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
                            currentPage <=
                                1
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

                            changeServerPageSize(
                                size
                            );
                        }}
                    >
                        {[10, 20, 50, 100].map(
                            (size) => (
                                <option
                                    key={size}
                                    value={
                                        size
                                    }
                                >
                                    {size} /
                                    page
                                </option>
                            )
                        )}
                    </select>
                </div>
            </div>
        </div>
    );
}
