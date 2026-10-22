"use client";

import { DataTable } from "@/components/data-table/data-table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
    SalesByDiscountDetail,
    SalesByDiscountItem,
} from "../tables/SalesByDiscount";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-QA", {
        style: "currency",
        currency: "QAR",
        maximumFractionDigits: 2,
    }).format(value ?? 0);

const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-QA", {
        maximumFractionDigits: 0,
    }).format(value ?? 0);

const columns: ColumnDef<SalesByDiscountDetail>[] = [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) =>
            row.original.date
                ? new Date(row.original.date).toLocaleString()
                : "-",
    },
    {
        accessorKey: "order_no",
        header: "Order",
        cell: ({ row }) => row.original.order_no ?? "-",
    },
    {
        accessorKey: "order_type",
        header: "Order Type",
        cell: ({ row }) => row.original.order_type || "-",
    },
    {
        accessorKey: "by",
        header: "By",
        cell: ({ row }) => row.original.by || row.original.user_name || "-",
    },
    {
        accessorKey: "discount_name",
        header: "Discount Name",
        cell: ({ row }) => row.original.discount_name || "Unnamed discount",
    },
    {
        accessorKey: "scope",
        header: "Scope",
        cell: ({ row }) => row.original.scope || "-",
    },
    {
        accessorKey: "discount_type",
        header: "Discount Type",
        cell: ({ row }) => row.original.discount_type || "-",
    },
    {
        accessorKey: "discount_amount",
        header: "Discount Amount (QAR)",
        cell: ({ row }) =>
            formatCurrency(
                Number(
                    row.original.discount_amount ??
                        row.original.amount ??
                        row.original.value ??
                        0
                )
            ),
    },
];

type Props = {
    data: SalesByDiscountItem[];
};

export default function SalesByDiscountDialog({ data }: Props) {
    const detailRows = data.filter(
        (row): row is SalesByDiscountDetail =>
            "date" in row ||
            "order_no" in row ||
            "discount_amount" in row ||
            "discount_type" in row
    );

    const totalDiscountAmount = detailRows.reduce(
        (sum, row) =>
            sum +
            Number(
                row.discount_amount ??
                    row.amount ??
                    row.discount_name ??
                    0
            ),
        0
    );

    return (
        <Dialog>
            <DialogTrigger
                render={
                    <button
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f3f3] transition hover:bg-[#ddcfbe]"
                        aria-label="Open discount details"
                    >
                        <ArrowRight className="h-5 w-5 text-[#a5765a]" />
                    </button>
                }
            />

            <DialogContent className="!h-[85vh] !w-[95vw] !max-w-[1200px] overflow-hidden rounded-3xl border-[#d9d9d8] bg-white p-0 shadow-2xl">
                <div className="flex h-full min-h-0 flex-col">
                    <DialogHeader className="relative overflow-hidden border-b border-[#d9d9d8] bg-gradient-to-r from-[#40332a] to-[#8c6b52] px-8 py-6">
                        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                        <div className="relative flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-bold text-white">
                                    Discount Details
                                </DialogTitle>
                                <p className="mt-1 text-sm text-white/70">
                                    Detailed list of discount rows
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-white/15 px-4 py-2 text-right backdrop-blur">
                                    <p className="text-xs text-white/70">Total</p>
                                    <p className="text-xl font-bold text-white">
                                        {formatCurrency(totalDiscountAmount)}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-white/15 px-4 py-2 backdrop-blur">
                                    <p className="text-xs text-white/70">Rows</p>
                                    <p className="text-xl font-bold text-white">{detailRows.length}</p>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto bg-[#fafafa] p-6">
                        <DataTable
                            columns={columns}
                            data={detailRows}
                            searchKey="discount_name"
                            placeholder="Search discounts..."
                            footer={(rows) => {
                                const pageTotal = rows.reduce(
                                    (sum, row) =>
                                        sum +
                                        Number(
                                            row.discount_amount ??
                                                row.amount ??
                                                row.discount_name ??
                                                0
                                        ),
                                    0
                                );

                                return (
                                    <tr className="border-t border-[#d9d9d8] bg-[#f3f3f3] font-semibold text-[#40332a]">
                                        <td className="px-3 py-3 text-left">Total</td>
                                        <td className="px-3 py-3 text-left" />
                                        <td className="px-3 py-3 text-left" />
                                        <td className="px-3 py-3 text-left" />
                                        <td className="px-3 py-3 text-left" />
                                        <td className="px-3 py-3 text-left" />
                                        <td className="px-3 py-3 text-left" />
                                        <td className="px-3 py-3 text-right">
                                            {formatCurrency(pageTotal)}
                                        </td>
                                    </tr>
                                );
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
