"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { ArrowRight, Download, Filter } from "lucide-react";

import { TopItem } from "../../sales.types";
import { DataTable } from "@/components/data-table/data-table";
import { TopSellingItemsColumns } from "./TopSellingItemsColumns";
import { getCategories } from "@/features/menu/category.service";

type Category = {
    id: number;
    name: string;
};

type Props = {
    data: TopItem[];
};

function formatWithoutRounding(
    value: number,
    decimals = 2
) {
    const factor = 10 ** decimals;
    const scaled =
        value >= 0
            ? Math.floor(value * factor)
            : Math.ceil(value * factor);

    return (scaled / factor).toFixed(decimals);
}

function toNumber(value: unknown) {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeNumber(value: unknown) {
    const parsed = toNumber(value);
    return `${parsed}`;
}

function normalizeProfitability(value: unknown) {
    const parsed = toNumber(value);
    return `${parsed}`;
}

function getItemCode(item: TopItem) {
    return (
        item.sku ??
        ""
    );
}

function buildExportRows(items: TopItem[]) {
    return items.map((item) => ({
        Category: item.category_name ?? "",
        "Item Name": item.name ?? "",
        "Item Code": getItemCode(item),
        "Total Sold": normalizeNumber(item.qty),
        "Total Amount": normalizeNumber(item.sales),
        "Total COGS": normalizeNumber(item.cogs),
        "profit%": normalizeProfitability(
            item.profitability?.percentage
        ),
    }));
}

export default function TopSellingItemsDialog({ data }: Props) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    useEffect(() => {
        let active = true;

        async function fetchCategories() {
            try {
                setLoadingCategories(true);

                const response = await getCategories();

                // Supports either a plain array or Laravel's { data: [...] } response.
                const result = response.data.data??response.data;
                const categoryList = Array.isArray(result)
                    ? result
                    : Array.isArray(result?.data)
                      ? result.data
                      : [];

                if (active) {
                    setCategories(categoryList);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);

                if (active) {
                    setCategories([]);
                }
            } finally {
                if (active) {
                    setLoadingCategories(false);
                }
            }
        }

        fetchCategories();

        return () => {
            active = false;
        };
    }, []);

    const safeData = Array.isArray(data) ? data : [];

    const filteredData = useMemo(() => {
        if (selectedCategory === "all") {
            return safeData;
        }

        return safeData.filter(
            (item) => String(item.category_id) === selectedCategory
        );
    }, [safeData, selectedCategory]);

    const totals = useMemo(() => {
        return filteredData.reduce(
            (acc, item) => {
                acc.totalAmount += Number(item.sales ?? 0);
                acc.totalCogs += Number(item.cogs ?? 0);
                acc.totalProfitability += Number(
                    item.profitability?.percentage ?? 0
                );

                return acc;
            },
            {
                totalAmount: 0,
                totalCogs: 0,
                totalProfitability: 0,
            }
        );
    }, [filteredData]);

    function handleExportExcel() {
        const rows = buildExportRows(filteredData);

        const worksheet = XLSX.utils.json_to_sheet(
            rows,
            {
                header: [
                    "Category",
                    "Item Name",
                    "Item Code",
                    "Total Sold",
                    "Total Amount",
                    "Total COGS",
                    "profit%",
                ],
            }
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Top Selling Items"
        );
        XLSX.writeFile(
            workbook,
            "top-selling-items.xlsx"
        );
    }

    return (
        <Dialog>
            <DialogTrigger
                render={
                    <button
                        className="
                            flex h-9 w-9 items-center justify-center
                            rounded-full bg-[#f3f3f3] transition
                            hover:bg-[#ddcfbe]
                        "
                    >
                        <ArrowRight className="h-5 w-5 text-[#a5765a]" />
                    </button>
                }
            />

            <DialogContent
                className="
                    !h-[85vh] !w-[95vw] !max-w-[1400px]
                    overflow-hidden rounded-3xl border-[#d9d9d8]
                    bg-white p-0 shadow-2xl
                "
            >
                <div className="flex h-full min-h-0 flex-col">
                    <DialogHeader
                        className="
                            relative overflow-hidden border-b
                            border-[#d9d9d8]
                            bg-gradient-to-r from-[#40332a] to-[#8c6b52]
                            px-8 py-6
                        "
                    >
                        <div
                            className="
                                absolute right-0 top-0 h-32 w-32
                                rounded-full bg-white/10 blur-2xl
                            "
                        />

                        <div className="relative flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-bold text-white">
                                    Top Selling Items
                                </DialogTitle>

                                <p className="mt-1 text-sm text-white/70">
                                    Analyze item performance, revenue and profitability
                                </p>
                            </div>

                            <div className="rounded-xl bg-white/15 px-4 py-2 backdrop-blur">
                                <p className="text-xs text-white/70">
                                    Filtered Items
                                </p>
                                <p className="text-xl font-bold text-white">
                                    {filteredData.length}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto bg-[#fafafa] p-6">
                        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium text-[#40332a]">
                                <Filter className="h-4 w-4" />
                                Filter by category
                            </div>

                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                                <select
                                    value={selectedCategory}
                                    onChange={(event) =>
                                        setSelectedCategory(event.target.value)
                                    }
                                    disabled={loadingCategories}
                                    className="
                                    w-full rounded-lg border border-[#d9d9d8]
                                    bg-white px-3 py-2 text-sm outline-none
                                    focus:ring-2 focus:ring-[#a5765a]
                                    disabled:opacity-60 sm:w-64
                                "
                                    aria-label="Filter items by category"
                                >
                                    <option value="all">
                                        {loadingCategories
                                            ? "Loading categories..."
                                            : "All categories"}
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleExportExcel}
                                    className="gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Export Excel
                                </Button>
                            </div>
                        </div>

                        <DataTable
                            columns={TopSellingItemsColumns()}
                            data={filteredData}
                            searchKey="name"
                            placeholder="Search items..."
                        />

                        <div className="mt-4 rounded-xl border border-[#d9d9d8] bg-white p-4">
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-lg bg-[#f8f8f7] p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Total Amount
                                    </p>
                                    <p className="text-base font-semibold text-[#40332a]">
                                        QAR {formatWithoutRounding(totals.totalAmount, 2)}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-[#f8f8f7] p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Total COGS
                                    </p>
                                    <p className="text-base font-semibold text-[#40332a]">
                                        QAR {formatWithoutRounding(totals.totalCogs, 2)}
                                    </p>
                                </div>

                                {/* <div className="rounded-lg bg-[#f8f8f7] p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Total Profitability
                                    </p>
                                    <p className="text-base font-semibold text-[#40332a]">
                                        {formatWithoutRounding(totals.totalProfitability, 2)}%
                                    </p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}