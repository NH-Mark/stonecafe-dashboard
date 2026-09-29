"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { ImportStepper } from "./importStepper";

interface ImportExecutePageProps {
    importId: number;
}

interface ImportSummary {
    total_orders: number;
    valid_orders: number;
    invalid_orders: number;
    imported_orders: number;
}

interface ValidationResponse {
    success: boolean;
    data: {
        id: number;
        source: string;
        status: string;
        summary: ImportSummary;
    };
}

interface ExecuteResponse {
    success: boolean;
    message: string;
    data: {
        import_id: number;
        imported_orders: number;
        status: string;
    };
}

export default function ImportExecutePage({
    importId,
}: ImportExecutePageProps) {
    const router = useRouter();

    const [summary, setSummary] =
        useState<ImportSummary | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [importing, setImporting] =
        useState(false);

    const [completed, setCompleted] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        loadImport();
    }, [importId]);

    const loadImport = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get<ValidationResponse>(
                    `/api/imports/${importId}/validation`
                );

            setSummary(
                response.data.data.summary
            );
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                    "Unable to load import."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        if (!summary) {
            return;
        }

        if (summary.invalid_orders > 0) {
            return;
        }

        if (importing) {
            return;
        }

        try {
            setImporting(true);
            setError("");

            const response =
                await api.post<ExecuteResponse>(
                    `/api/imports/${importId}/execute`
                );

            if (response.data.success) {
                setCompleted(true);
            }
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                    "Unable to import orders."
            );
        } finally {
            setImporting(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl p-6">
                <ImportStepper currentStep={3} />

                <div className="flex min-h-[300px] items-center justify-center">
                    <p className="text-sm text-gray-500">
                        Loading import summary...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !summary) {
        return (
            <div className="mx-auto max-w-7xl p-6">
                <ImportStepper currentStep={3} />

                <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                    <h2 className="font-semibold text-red-800">
                        Unable to load import
                    </h2>

                    <p className="mt-2 text-sm text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadImport}
                        className="mt-4 rounded-md bg-[#40332a] px-4 py-2 text-sm font-medium text-white"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!summary) {
        return null;
    }

    if (completed) {
        return (
            <div className="mx-auto max-w-7xl p-6">
                <ImportStepper currentStep={3} />

                <div className="mt-12 rounded-lg border border-green-200 bg-green-50 p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl text-green-700">
                        ✓
                    </div>

                    <h1 className="mt-4 text-2xl font-semibold text-green-900">
                        Import completed
                    </h1>

                    <p className="mt-2 text-sm text-green-700">
                        {summary.total_orders} orders have been
                        imported successfully.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            router.push("/sales/orders")
                        }
                        className="mt-6 rounded-md bg-[#40332a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#332820]"
                    >
                        View Orders
                    </button>
                </div>
            </div>
        );
    }

    const canImport =
        summary.invalid_orders === 0;

    return (
        <div className="mx-auto max-w-7xl p-6">
            <ImportStepper currentStep={3} />

            <div className="mt-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Import Orders
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Review the final summary before importing
                    the historical Sapaad orders.
                </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <SummaryCard
                    label="Orders to Import"
                    value={summary.valid_orders}
                />

                <SummaryCard
                    label="Invalid Orders"
                    value={summary.invalid_orders}
                    danger={
                        summary.invalid_orders > 0
                    }
                />

                <SummaryCard
                    label="Already Imported"
                    value={summary.imported_orders}
                />
            </div>

            {summary.invalid_orders > 0 && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5">
                    <h2 className="font-medium text-red-900">
                        Import cannot continue
                    </h2>

                    <p className="mt-1 text-sm text-red-700">
                        There are invalid orders in this
                        import. Return to validation and
                        resolve them before importing.
                    </p>
                </div>
            )}

            {error && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="font-semibold text-gray-900">
                    Ready to import?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                    This will create the historical orders,
                    order items, modifiers, discounts and
                    payments in your POS.
                </p>

                <p className="mt-3 text-sm font-medium text-gray-700">
                    This action should only be performed once.
                </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
                <button
                    type="button"
                    disabled={importing}
                    onClick={() =>
                        router.push(
                            `/import-orders/${importId}/validate`
                        )
                    }
                    className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Back to Validation
                </button>

                <button
                    type="button"
                    disabled={
                        !canImport ||
                        importing
                    }
                    onClick={handleImport}
                    className={[
                        "rounded-md px-5 py-2.5 text-sm font-medium text-white transition",
                        !canImport || importing
                            ? "cursor-not-allowed bg-gray-300"
                            : "bg-[#40332a] hover:bg-[#332820]",
                    ].join(" ")}
                >
                    {importing
                        ? "Importing..."
                        : "Import Orders"}
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