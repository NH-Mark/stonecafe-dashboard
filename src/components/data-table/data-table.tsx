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
import { useState } from "react";
import ColumnFilter from "./ColumnFilter";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey?: string;
    placeholder?: string;
    rowClassName?: (row: TData) => string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    placeholder = "Search...",
    rowClassName,
}: DataTableProps<TData, TValue>) {
    const [search, setSearch] = useState("");

    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>([]);

    const [sorting, setSorting] =
        useState<SortingState>([]);

    const [pagination, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });

    const table = useReactTable({
        data,
        columns,

        state: {
            globalFilter: search,
            columnFilters,
            sorting,
            pagination,
        },

        onGlobalFilterChange: setSearch,
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    function clearFilters() {
        setSearch("");
        setColumnFilters([]);
        table.setPageIndex(0);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                {searchKey && (
                    <Input
                        placeholder={placeholder}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            table.setPageIndex(0);
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

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        <div className="space-y-2">
                                            <div className="group flex items-center justify-between w-full">
                                                <div className="truncate">
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </div>

                                                {header.column.getCanFilter() && (
                                                    <div className="ml-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <ColumnFilter
                                                            column={header.column}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className={rowClassName?.(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
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
                                    className="text-center"
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
                    {table.getFilteredRowModel().rows.length === 0
                        ? 0
                        : pagination.pageIndex * pagination.pageSize + 1}
                    -
                    {Math.min(
                        (pagination.pageIndex + 1) * pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{" "}
                    of {table.getFilteredRowModel().rows.length} entries
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {"<<"}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>

                    <span className="text-sm px-2">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {">>"}
                    </Button>

                    <select
                        className="border rounded-md px-2 py-1 text-sm"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) =>
                            table.setPageSize(Number(e.target.value))
                        }
                    >
                        {[10, 20, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                {size} / page
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}