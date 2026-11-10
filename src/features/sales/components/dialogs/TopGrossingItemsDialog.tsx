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
import { TopGrossingItemsColumns } from "./TopGrossingItemsColumns";
import { getCategories } from "@/features/menu/category.service";

type Category = {
    id: number;
    name: string;
};

type Props = {
    data: TopItem[];
};

function toNumber(value: unknown) {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeNumber(value: unknown) {
    return `${toNumber(value)}`;
}

function normalizeProfitability(value: unknown) {
    return `${toNumber(value)}`;
}

function getItemCode(item: TopItem) {
    return item.sku ?? "";
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

export default function TopGrossingItemsDialog({ data }: Props) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    useEffect(() => {
        let active = true;

        async function fetchCategories() {
            try {
                setLoadingCategories(true);

                const response = await getCategories();
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
        const filtered =
            selectedCategory === "all"
                ? safeData
                : safeData.filter(
                      (item) =>
                          String(item.category_id) === selectedCategory
                  );

        return [...filtered].sort(
            (a, b) => Number(b.sales ?? 0) - Number(a.sales ?? 0)
        );
    }, [safeData, selectedCategory]);

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
            "Top Grossing Items"
        );
        XLSX.writeFile(
            workbook,
            "top-grossing-items.xlsx"
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
                                    Top Grossing Items
                                </DialogTitle>

                                <p className="mt-1 text-sm text-white/70">
                                    Items ranked by revenue, with cost and profitability details
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
                                    aria-label="Filter grossing items by category"
                                    className="
                                    w-full rounded-lg border border-[#d9d9d8]
                                    bg-white px-3 py-2 text-sm outline-none
                                    focus:ring-2 focus:ring-[#a5765a]
                                    disabled:opacity-60 sm:w-64
                                "
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
                            columns={TopGrossingItemsColumns()}
                            data={filteredData}
                            searchKey="name"
                            placeholder="Search items..."
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}