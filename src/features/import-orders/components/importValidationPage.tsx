"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { ImportStepper } from "./importStepper";

interface ImportValidationPageProps {
    importId: number;
}

interface ValidationError {
    type: string;
    value?: string;
    source_total?: number;
    calculated_total?: number;
    message: string;
}

interface ValidationWarning {
    type: string;
    value?: string;
    message: string;
}

interface ImportItem {
    menu_item_id: number | null;
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    tax: number;
    discount_id: number | null;
    discount_name: string | null;
    discount_amount: number;
    modifiers: ImportModifier[];
}

interface ImportModifier {
    modifier_id: number | null;
    name: string;
    quantity: number;
    price: number;
    tax: number;
    discount: string | null;
}

interface ImportOrderData {
    order: {
        order_no: string;
        external_id: string;
        ordered_at: string | null;
        order_type: string | null;
        order_type_id: number | null;
        cashier: string | null;
        cashier_id: number | null;
        payment_method: string | null;
        payment_method_id: number | null;
        customer_id: number | null;
        total_amount: number;
        status: string | null;
        notes: string | null;
    };
    items: ImportItem[];
}

interface ValidationRow {
    id: number;
    external_order_no: string;
    status: "valid" | "invalid";
    source_total: number;
    calculated_total: number;
    data: ImportOrderData;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}

interface ValidationResponse {
    success: boolean;
    data: {
        id: number;
        source: string;
        status: string;
        summary: {
            total_orders: number;
            valid_orders: number;
            invalid_orders: number;
            imported_orders: number;
        };
        rows: ValidationRow[];
    };
}

type Filter = "all" | "valid" | "invalid";

export default function ImportValidationPage({
    importId,
}: ImportValidationPageProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [continuing, setContinuing] = useState(false);
    const [error, setError] = useState("");

    const [data, setData] = useState<ValidationResponse["data"] | null>(
        null
    );

    const [filter, setFilter] = useState<Filter>("all");
    const [search, setSearch] = useState("");

    const loadValidation = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get<ValidationResponse>(
                `/api/imports/${importId}/validation`
            );

            setData(response.data.data);
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                    "Unable to load import validation."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadValidation();
    }, [importId]);

    const filteredRows = useMemo(() => {
        if (!data?.rows) {
            return [];
        }

        const normalizedSearch = search.trim().toLowerCase();

        return data.rows.filter((row) => {
            const matchesFilter =
                filter === "all" ||
                row.status === filter;

            if (!matchesFilter) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const orderNo =
                row.external_order_no.toLowerCase();

            const orderType =
                row.data.order.order_type
                    ?.toLowerCase() || "";

            const cashier =
                row.data.order.cashier
                    ?.toLowerCase() || "";

            const itemNames = row.data.items
                .map((item) => item.name.toLowerCase())
                .join(" ");

            return (
                orderNo.includes(normalizedSearch) ||
                orderType.includes(normalizedSearch) ||
                cashier.includes(normalizedSearch) ||
                itemNames.includes(normalizedSearch)
            );
        });
    }, [data, filter, search]);

    const handleContinue = () => {
        if (!data) {
            return;
        }

        if (data.summary.invalid_orders > 0) {
            return;
        }

        setContinuing(true);

        router.push(
            `/import-orders/${importId}/import`
        );
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl p-6">
                <ImportStepper currentStep={2} />

                <div className="flex min-h-[300px] items-center justify-center">
                    <div className="text-sm text-gray-500">
                        Loading validation...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-7xl p-6">
                <ImportStepper currentStep={2} />

                <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                    <h2 className="font-semibold text-red-800">
                        Unable to load validation
                    </h2>

                    <p className="mt-2 text-sm text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadValidation}
                        className="mt-4 rounded-md bg-[#40332a] px-4 py-2 text-sm font-medium text-white"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const hasErrors =
        data.summary.invalid_orders > 0;

    return (
        <div className="mx-auto max-w-7xl p-6">
            <ImportStepper currentStep={2} />

            {/* Header */}
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Review & Validate
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Review the Sapaad orders before importing them.
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                        Import
                    </p>

                    <p className="font-medium text-gray-900">
                        #{importId}
                    </p>
                </div>
            </div>

            {/* Summary */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    label="Total Orders"
                    value={data.summary.total_orders}
                />

                <SummaryCard
                    label="Valid Orders"
                    value={data.summary.valid_orders}
                />

                <SummaryCard
                    label="Invalid Orders"
                    value={data.summary.invalid_orders}
                    danger={data.summary.invalid_orders > 0}
                />

                <SummaryCard
                    label="Already Imported"
                    value={data.summary.imported_orders}
                />
            </div>

            {/* Validation status */}
            {hasErrors ? (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-red-600">
                            !
                        </div>

                        <div>
                            <h2 className="font-medium text-red-900">
                                Some orders need attention
                            </h2>

                            <p className="mt-1 text-sm text-red-700">
                                Fix the mapping or data issues before
                                continuing with the import.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-green-600">
                            ✓
                        </div>

                        <div>
                            <h2 className="font-medium text-green-900">
                                All orders are valid
                            </h2>

                            <p className="mt-1 text-sm text-green-700">
                                You can continue to the import step.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                    <FilterButton
                        active={filter === "all"}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </FilterButton>

                    <FilterButton
                        active={filter === "valid"}
                        onClick={() => setFilter("valid")}
                    >
                        Valid
                    </FilterButton>

                    <FilterButton
                        active={filter === "invalid"}
                        onClick={() => setFilter("invalid")}
                    >
                        Invalid
                    </FilterButton>
                </div>

                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder="Search order or item..."
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#40332a] sm:w-64"
                />
            </div>

            {/* Orders */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Order
                                </th>

                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Date
                                </th>

                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Items
                                </th>

                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Discount
                                </th>

                                <th className="px-4 py-3 text-right font-medium text-gray-600">
                                    Sapaad Total
                                </th>

                                <th className="px-4 py-3 text-right font-medium text-gray-600">
                                    Calculated
                                </th>

                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {filteredRows.map((row) => (
                                <ValidationTableRow
                                    key={row.id}
                                    row={row}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredRows.length === 0 && (
                    <div className="p-12 text-center text-sm text-gray-500">
                        No orders found.
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
                <button
                    type="button"
                    onClick={() =>
                        router.push("/import-orders")
                    }
                    className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Back
                </button>

                <button
                    type="button"
                    disabled={
                        hasErrors ||
                        continuing
                    }
                    onClick={handleContinue}
                    className={[
                        "rounded-md px-5 py-2.5 text-sm font-medium text-white transition",
                        hasErrors || continuing
                            ? "cursor-not-allowed bg-gray-300"
                            : "bg-[#40332a] hover:bg-[#332820]",
                    ].join(" ")}
                >
                    {continuing
                        ? "Loading..."
                        : "Continue to Import"}
                </button>
            </div>
        </div>
    );
}

interface SummaryCardProps {
    label: string;
    value: number;
    danger?: boolean;
}

function SummaryCard({
    label,
    value,
    danger = false,
}: SummaryCardProps) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p
                className={[
                    "mt-2 text-2xl font-semibold",
                    danger
                        ? "text-red-600"
                        : "text-gray-900",
                ].join(" ")}
            >
                {value}
            </p>
        </div>
    );
}

interface FilterButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

function FilterButton({
    active,
    onClick,
    children,
}: FilterButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "rounded-md px-3 py-2 text-sm font-medium transition",
                active
                    ? "bg-[#40332a] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

interface ValidationTableRowProps {
    row: ValidationRow;
}

function ValidationTableRow({
    row,
}: ValidationTableRowProps) {
    const order = row.data.order;

    const discountTotal = row.data.items.reduce(
        (total, item) =>
            total + item.discount_amount,
        0
    );

    const itemCount = row.data.items.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

    return (
        <tr className="align-top hover:bg-gray-50">
            {/* Order */}
            <td className="px-4 py-4">
                <div className="font-medium text-gray-900">
                    #{row.external_order_no}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                    {order.order_type || "-"}
                </div>

                <div className="text-xs text-gray-500">
                    {order.cashier || "-"}
                </div>
            </td>

            {/* Date */}
            <td className="px-4 py-4 text-gray-600">
                {formatDate(order.ordered_at)}
            </td>

            {/* Items */}
            <td className="px-4 py-4">
                <div className="space-y-1">
                    {row.data.items.map(
                        (item, index) => (
                            <div
                                key={`${item.name}-${index}`}
                            >
                                <div className="text-gray-900">
                                    {item.quantity} ×{" "}
                                    {item.name}
                                </div>

                                {item.modifiers.length >
                                    0 && (
                                    <div className="ml-4 text-xs text-gray-500">
                                        {item.modifiers.map(
                                            (
                                                modifier,
                                                modifierIndex
                                            ) => (
                                                <div
                                                    key={`${modifier.name}-${modifierIndex}`}
                                                >
                                                    +{" "}
                                                    {
                                                        modifier.name
                                                    }
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                {item.discount_name && (
                                    <div className="ml-4 text-xs text-green-600">
                                        Discount:{" "}
                                        {
                                            item.discount_name
                                        }{" "}
                                        (
                                        {formatMoney(
                                            item.discount_amount
                                        )}
                                        )
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>

                <div className="mt-2 text-xs text-gray-400">
                    {itemCount} item
                    {itemCount === 1 ? "" : "s"}
                </div>
            </td>

            {/* Discount */}
            <td className="px-4 py-4">
                {discountTotal > 0 ? (
                    <div>
                        <div className="font-medium text-green-600">
                            -{formatMoney(discountTotal)}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                            {row.data.items
                                .filter(
                                    (item) =>
                                        item.discount_name
                                )
                                .map(
                                    (item, index) => (
                                        <div
                                            key={`${item.discount_name}-${index}`}
                                        >
                                            {
                                                item.discount_name
                                            }
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                ) : (
                    <span className="text-gray-400">
                        —
                    </span>
                )}
            </td>

            {/* Source total */}
            <td className="px-4 py-4 text-right font-medium text-gray-900">
                {formatMoney(row.source_total)}
            </td>

            {/* Calculated */}
            <td className="px-4 py-4 text-right">
                <div
                    className={
                        row.source_total ===
                        row.calculated_total
                            ? "font-medium text-gray-900"
                            : "font-medium text-red-600"
                    }
                >
                    {formatMoney(
                        row.calculated_total
                    )}
                </div>

                {row.source_total !==
                    row.calculated_total && (
                    <div className="mt-1 text-xs text-red-500">
                        Difference:{" "}
                        {formatMoney(
                            row.calculated_total -
                                row.source_total
                        )}
                    </div>
                )}
            </td>

            {/* Status */}
            <td className="px-4 py-4">
                {row.status === "valid" ? (
                    <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                        Valid
                    </span>
                ) : (
                    <div>
                        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                            Invalid
                        </span>

                        <div className="mt-2 space-y-1">
                            {row.errors.map(
                                (validationError, index) => (
                                    <div
                                        key={`${validationError.type}-${index}`}
                                        className="max-w-xs text-xs text-red-600"
                                    >
                                        {validationError.message}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {row.warnings.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {row.warnings.map(
                            (warning, index) => (
                                <div
                                    key={`${warning.type}-${index}`}
                                    className="max-w-xs text-xs text-amber-600"
                                >
                                    {warning.message}
                                </div>
                            )
                        )}
                    </div>
                )}
            </td>
        </tr>
    );
}

function formatMoney(value: number) {
    return Number(value || 0).toFixed(2);
}

function formatDate(value: string | null) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}