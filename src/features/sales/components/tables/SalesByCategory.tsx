
"use client";

import { Tags } from "lucide-react";

export type SalesByCategoryItem = {
    category_id: number | null;
    category_name: string;
    qty: number;
    qty_percentage: number;
    value: number;
    value_percentage: number;
};

type Props = {
    data: SalesByCategoryItem[];
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-QA", {
        style: "currency",
        currency: "QAR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount ?? 0));

export default function SalesByCategory({ data }: Props) {
    const categories = Array.isArray(data) ? data : [];

    const totalQty = categories.reduce(
        (sum, item) => sum + Number(item.qty ?? 0),
        0
    );

    const totalValue = categories.reduce(
        (sum, item) => sum + Number(item.value ?? 0),
        0
    );

    return (
        <div className="overflow-hidden rounded-xl border border-[#e5ded7] bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#eee7e1] px-4 py-3">
                <div>
                    <h2 className="text-base font-bold text-[#40332a]">
                        Sales by Category
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                        Revenue and quantity by menu category
                    </p>
                </div>

                <div className="rounded-lg bg-[#f5eee8] p-2">
                    <Tags className="h-4 w-4 text-[#a5765a]" />
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 border-b border-[#eee7e1] bg-[#fcfaf8] px-4 py-3">
                <div>
                    <p className="text-xs text-gray-500">Total Quantity</p>
                    <p className="mt-1 text-lg font-bold text-[#40332a]">
                        {totalQty.toLocaleString()}
                    </p>
                </div>

                <div className="min-w-0">
                    <p className="text-xs text-gray-500">Total Sales</p>
                    <p className="mt-1 truncate text-lg font-bold text-[#40332a]">
                        {formatCurrency(totalValue)}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#faf7f4] text-[10px] uppercase tracking-wide text-gray-500">
                        <tr>
                            <th className="whitespace-nowrap px-3 py-2.5 font-semibold">
                                Category
                            </th>
                            <th className="px-3 py-2.5 text-right font-semibold">
                                Qty
                            </th>
                            <th className="min-w-[105px] px-3 py-2.5 font-semibold">
                                Qty %
                            </th>
                            <th className="whitespace-nowrap px-3 py-2.5 text-right font-semibold">
                                Value
                            </th>
                            <th className="min-w-[105px] px-3 py-2.5 font-semibold">
                                Value %
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[#f0ebe6]">
                        {categories.length > 0 ? (
                            [...categories]
                                .sort(
                                    (a, b) =>
                                        Number(b.value ?? 0) -
                                        Number(a.value ?? 0)
                                )
                                .map((item, index) => {
                                    const qty = Number(item.qty ?? 0);
                                    const value = Number(item.value ?? 0);

                                    const qtyPercentage =
                                        totalQty > 0
                                            ? (qty / totalQty) * 100
                                            : 0;

                                    const valuePercentage =
                                        totalValue > 0
                                            ? (value / totalValue) * 100
                                            : 0;

                                    return (
                                        <tr
                                            key={`${item.category_id ?? item.category_name}-${index}`}
                                            className="transition-colors hover:bg-[#fcfaf8]"
                                        >
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    {/* <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f5eee8]">
                                                        <Tags className="h-3.5 w-3.5 text-[#a5765a]" />
                                                    </div> */}

                                                    <span className="font-medium text-[#40332a]">
                                                        {item.category_name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5 text-right font-medium text-gray-600">
                                                {qty.toLocaleString()}
                                            </td>

                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#eee7e1]">
                                                        <div
                                                            className="h-full rounded-full bg-[#a5765a]"
                                                            style={{
                                                                width: `${Math.min(qtyPercentage, 100)}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <span className="w-10 shrink-0 text-right text-[10px] text-gray-500">
                                                        {qtyPercentage.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5 text-right font-semibold text-[#40332a]">
                                                {formatCurrency(value)}
                                            </td>

                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#eee7e1]">
                                                        <div
                                                            className="h-full rounded-full bg-[#a5765a]"
                                                            style={{
                                                                width: `${Math.min(valuePercentage, 100)}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <span className="w-10 shrink-0 text-right text-[10px] text-gray-500">
                                                        {valuePercentage.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-3 py-8 text-center text-xs text-gray-500"
                                >
                                    No category sales available for this period.
                                </td>
                            </tr>
                        )}
                    </tbody>

                    {categories.length > 0 && (
                        <tfoot className="border-t-2 border-[#e5ded7] bg-[#fcfaf8]">
                            <tr>
                                <td className="px-3 py-2.5 font-bold text-[#40332a]">
                                    Total
                                </td>

                                <td className="px-3 py-2.5 text-right font-bold text-[#40332a]">
                                    {totalQty.toLocaleString()}
                                </td>

                                <td className="px-3 py-2.5 text-right font-bold text-[#40332a]">
                                    {totalQty > 0 ? "100%" : "0%"}
                                </td>

                                <td className="whitespace-nowrap px-3 py-2.5 text-right font-bold text-[#40332a]">
                                    {formatCurrency(totalValue)}
                                </td>

                                <td className="px-3 py-2.5 text-right font-bold text-[#40332a]">
                                    {totalValue > 0 ? "100%" : "0%"}
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}