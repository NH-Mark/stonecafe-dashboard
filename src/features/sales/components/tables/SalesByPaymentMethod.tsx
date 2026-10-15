"use client";

import { CreditCard, Banknote, Wallet } from "lucide-react";

export type PaymentMethodSale = {
    payment_method_id: number | null;
    name: string;
    value: number;
    payment_count: number;
};

type Props = {
    data: PaymentMethodSale[];
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-QA", {
        style: "currency",
        currency: "QAR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount ?? 0));

export default function SalesByPaymentMethod({ data }: Props) {
    const paymentMethods = Array.isArray(data) ? data : [];

    const totalSales = paymentMethods.reduce(
        (sum, item) => sum + Number(item.value ?? 0),
        0
    );

    const totalPayments = paymentMethods.reduce(
        (sum, item) => sum + Number(item.payment_count ?? 0),
        0
    );

    const getIcon = (name: string) => {
        const method = name.toLowerCase().trim();

        if (method === "cash") return Banknote;

        if (["keeta", "talabat", "sonoonu", "beanz"].includes(method)) {
            return Wallet;
        }

        return CreditCard;
    };

    return (
        <div className="overflow-hidden rounded-xl border border-[#e5ded7] bg-white shadow-sm">
            {/* Compact Header */}
            <div className="flex items-center justify-between border-b border-[#eee7e1] px-4 py-3">
                <div>
                    <h2 className="text-base font-bold text-[#40332a]">
                        Sales by Payment Method
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                        Revenue collected by payment type
                    </p>
                </div>

                <div className="rounded-lg bg-[#f5eee8] p-2">
                    <CreditCard className="h-4 w-4 text-[#a5765a]" />
                </div>
            </div>

            {/* Compact Summary */}
            <div className="grid grid-cols-2 gap-3 border-b border-[#eee7e1] bg-[#fcfaf8] px-4 py-3">
                <div className="min-w-0">
                    <p className="text-xs text-gray-500">Total Collected</p>
                    <p className="mt-1 truncate text-lg font-bold text-[#40332a]">
                        {formatCurrency(totalSales)}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-gray-500">Total Payments</p>
                    <p className="mt-1 text-lg font-bold text-[#40332a]">
                        {totalPayments.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Compact Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#faf7f4] text-[10px] uppercase tracking-wide text-gray-500">
                        <tr>
                            <th className="px-3 py-2.5 font-semibold">
                                Payment Method
                            </th>
                            <th className="whitespace-nowrap px-3 py-2.5 text-right font-semibold">
                                Payments
                            </th>
                            <th className="whitespace-nowrap px-3 py-2.5 text-right font-semibold">
                                Total Sales
                            </th>
                            <th className="min-w-[100px] px-3 py-2.5 font-semibold">
                                Share
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[#f0ebe6]">
                        {paymentMethods.length > 0 ? (
                            [...paymentMethods]
                                .sort(
                                    (a, b) =>
                                        Number(b.value ?? 0) -
                                        Number(a.value ?? 0)
                                )
                                .map((item, index) => {
                                    const Icon = getIcon(item.name);
                                    const value = Number(item.value ?? 0);
                                    const share =
                                        totalSales > 0
                                            ? (value / totalSales) * 100
                                            : 0;

                                    return (
                                        <tr
                                            key={`${item.payment_method_id ?? item.name}-${index}`}
                                            className="transition-colors hover:bg-[#fcfaf8]"
                                        >
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f5eee8]">
                                                        <Icon className="h-3.5 w-3.5 text-[#a5765a]" />
                                                    </div>

                                                    <span className="font-medium text-[#40332a]">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5 text-right text-gray-600">
                                                {Number(
                                                    item.payment_count ?? 0
                                                ).toLocaleString()}
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
                                                                width: `${Math.min(share, 100)}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <span className="w-10 shrink-0 text-right text-[10px] text-gray-500">
                                                        {share.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-3 py-6 text-center text-xs text-gray-500"
                                >
                                    No payment data available for this period.
                                </td>
                            </tr>
                        )}
                    </tbody>

                    {paymentMethods.length > 0 && (
                        <tfoot className="border-t-2 border-[#e5ded7] bg-[#fcfaf8]">
                            <tr>
                                <td className="px-3 py-2.5 font-bold text-[#40332a]">
                                    Total
                                </td>
                                <td className="px-3 py-2.5 text-right font-bold text-[#40332a]">
                                    {totalPayments.toLocaleString()}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2.5 text-right font-bold text-[#40332a]">
                                    {formatCurrency(totalSales)}
                                </td>
                                <td className="px-3 py-2.5 text-right font-bold text-[#40332a]">
                                    {totalSales > 0 ? "100%" : "0%"}
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}
``