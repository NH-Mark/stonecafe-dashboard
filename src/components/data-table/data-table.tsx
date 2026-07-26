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
    TableRow
} from "@/components/ui/table";


import { Input } from "@/components/ui/input";

import {
    Button
} from "@/components/ui/button";


import {
    useState
} from "react";
import ColumnFilter from "./ColumnFilter";



interface DataTableProps<TData, TValue> {

    columns: ColumnDef<TData, TValue>[];

    data: TData[];

    searchKey?: string;

    placeholder?: string;

}



export function DataTable<TData, TValue>({

    columns,

    data,

    searchKey,

    placeholder = "Search..."

}: DataTableProps<TData, TValue>) {



    const [search, setSearch] = useState("");

    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>([]);


    const [sorting, setSorting] =
        useState<SortingState>([]);



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


        getCoreRowModel:
            getCoreRowModel(),


        getFilteredRowModel:
            getFilteredRowModel(),


        getSortedRowModel:
            getSortedRowModel(),



    });



    function clearFilters() {

        setSearch("");

        setColumnFilters([]);

    }



    return (

        <div className="space-y-4">


            <div className="flex items-center gap-3">


                {
                    searchKey &&

                    <Input

                        placeholder={placeholder}

                        value={search}

                        onChange={
                            e => setSearch(e.target.value)
                        }

                        className="max-w-sm"

                    />

                }



                {
                    (columnFilters.length > 0 || search) &&

                    <Button

                        variant="outline"

                        onClick={clearFilters}

                    >

                        Clear Filters

                    </Button>

                }


            </div>





            <div className="rounded-md border">


                <Table>


                    <TableHeader>


                        {
                            table.getHeaderGroups()
                                .map(headerGroup => (


                                    <TableRow
                                        key={headerGroup.id}
                                    >


                                        {
                                            headerGroup.headers.map(header => (


                                                <TableHead
                                                    key={header.id}
                                                >


                                                    <div className="space-y-2">


                                                        {
                                                            <div
                                                                className="
        group
        flex
        items-center
        justify-between
        w-full
    "
                                                            >
                                                                <div className="truncate">
                                                                    {flexRender(
                                                                        header.column.columnDef.header,
                                                                        header.getContext()
                                                                    )}
                                                                </div>

                                                                {header.column.getCanFilter() && (
                                                                    <div
                                                                        className="
                ml-1
                opacity-0
                transition-opacity
                group-hover:opacity-100
            "
                                                                    >
                                                                        <ColumnFilter column={header.column} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        }
                                                    </div>


                                                </TableHead>


                                            ))


                                        }


                                    </TableRow>


                                ))


                        }



                    </TableHeader>





                    <TableBody>


                        {

                            table.getRowModel().rows.length ?


                                table.getRowModel()
                                    .rows.map(row => (


                                        <TableRow
                                            key={row.id}
                                        >


                                            {
                                                row.getVisibleCells()
                                                    .map(cell => (


                                                        <TableCell
                                                            key={cell.id}
                                                        >


                                                            {
                                                                flexRender(

                                                                    cell.column.columnDef.cell,

                                                                    cell.getContext()

                                                                )
                                                            }


                                                        </TableCell>


                                                    ))

                                            }


                                        </TableRow>


                                    ))


                                :


                                <TableRow>

                                    <TableCell

                                        colSpan={
                                            columns.length
                                        }

                                        className="text-center"

                                    >

                                        No records found

                                    </TableCell>

                                </TableRow>


                        }


                    </TableBody>



                </Table>


            </div>


        </div>


    );


}