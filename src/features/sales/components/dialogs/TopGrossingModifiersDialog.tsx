"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { ArrowRight } from "lucide-react";
import { TopModifier } from "../../sales.types";
import { DataTable } from "@/components/data-table/data-table";
import { TopGrossingModifiersColumns } from "./TopGrossingModifiersColumns";
import { getCategories } from "@/features/menu/category.service";
type Category = {
    id: number;
    name: string;
};

type Props = {
    data: TopModifier[];
};

export default function TopGrossingModifiersDialog({
    data,
}: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();

                const result = Array.isArray(response.data.data)
                    ? response.data.data
                    : Array.isArray(response.data)
                      ? response.data
                      : [];

                setCategories(result);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const filteredData = useMemo(() => {
        const validData = Array.isArray(data) ? data : [];

        if (selectedCategory === "all") {
            return validData;
        }

        return validData.filter(
            (item) =>
                String(item.category_id) === selectedCategory
        );
    }, [data, selectedCategory]);

    return (
        <Dialog>
            <DialogTrigger
                render={
                    <button
                        className="
                            flex h-9 w-9 items-center justify-center
                            rounded-full bg-[#f3f3f3]
                            transition hover:bg-[#ddcfbe]
                        "
                    >
                        <ArrowRight className="h-5 w-5 text-[#a5765a]" />
                    </button>
                }
            />

            <DialogContent
                className="
                    !w-[95vw] !max-w-[1400px] !h-[85vh]
                    overflow-hidden rounded-3xl
                    border-[#d9d9d8] bg-white p-0 shadow-2xl
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
                        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                        <div className="relative flex items-center justify-between gap-4">
                            <div>
                                <DialogTitle className="text-2xl font-bold text-white">
                                    Top Grossing Modifiers
                                </DialogTitle>

                                <p className="mt-1 text-sm text-white/70">
                                    Analyze add-ons ranked by revenue generated
                                </p>
                            </div>

                            <div className="rounded-xl bg-white/15 px-4 py-2 backdrop-blur">
                                <p className="text-xs text-white/70">
                                    Total Modifiers
                                </p>

                                <p className="text-xl font-bold text-white">
                                    {filteredData.length}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto bg-[#fafafa] p-6">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <label
                                htmlFor="modifier-category-filter"
                                className="text-sm font-medium text-[#40332a]"
                            >
                                Filter by category
                            </label>

                            <select
                                id="modifier-category-filter"
                                value={selectedCategory}
                                onChange={(event) =>
                                    setSelectedCategory(event.target.value)
                                }
                                className="
                                    h-10 min-w-[220px] rounded-xl
                                    border border-[#d9d9d8] bg-white
                                    px-4 text-sm text-[#40332a]
                                    outline-none transition
                                    focus:border-[#a5765a]
                                    focus:ring-2 focus:ring-[#a5765a]/20
                                "
                            >
                                <option value="all">All Categories</option>

                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={String(category.id)}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <DataTable
                            columns={TopGrossingModifiersColumns()}
                            data={filteredData}
                            searchKey="name"
                            placeholder="Search modifiers..."
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}