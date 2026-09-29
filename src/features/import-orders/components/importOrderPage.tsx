"use client";

import { useState } from "react";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Package,
    ShoppingCart,
} from "lucide-react";

import { CsvUploadCard } from "./csvUploadCard";
import { ImportInfo } from "./importInfo";
import { ImportStepper } from "./importStepper";
import { useRouter } from "next/navigation";


import { isCsvFile } from "../utils/file.utils";
import { ImportFiles, ImportFileType } from "../import-order.types";
import { createSapaadImport } from "../import-order.service";

export function ImportOrderPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<ImportFiles>({
        orders: null,
        items: null,
    });

    const [dragging, setDragging] =
        useState<ImportFileType | null>(null);

    const [error, setError] = useState<string | null>(null);

    const handleFile = (
        file: File,
        type: ImportFileType
    ) => {
        setError(null);

        if (!isCsvFile(file)) {
            setError(
                `Please select a CSV file for ${type === "orders" ? "Orders" : "Items"
                }.`
            );

            return;
        }

        setFiles((previous) => ({
            ...previous,
            [type]: file,
        }));
    };

    const handleDrop = (
        event: React.DragEvent<HTMLDivElement>,
        type: ImportFileType
    ) => {
        event.preventDefault();

        setDragging(null);

        const file = event.dataTransfer.files?.[0];

        if (file) {
            handleFile(file, type);
        }
    };

    const removeFile = (type: ImportFileType) => {
        setFiles((previous) => ({
            ...previous,
            [type]: null,
        }));

        setError(null);
    };

    const canContinue =
        files.orders !== null &&
        files.items !== null;

    const handleContinue = async () => {
        if (!canContinue || loading) {
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await createSapaadImport(
                files.orders!,
                files.items!
            );

            const importId = response.data.import_id;

            router.push(`/import-orders/${importId}/validate`);
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Unable to upload the CSV files. Please try again.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-6 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Orders</span>

                    <span>/</span>

                    <span className="text-gray-900">
                        Import Data
                    </span>
                </div>

                {/* Header */}
                <div className="mt-4 mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Import Data
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Import your previous orders and item data from
                        Sapaad.
                    </p>
                </div>

                {/* Steps */}
                <ImportStepper currentStep={1} />

                {/* Main Card */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    {/* Card Header */}
                    <div className="border-b border-gray-200 px-6 py-5">
                        <h2 className="text-base font-semibold text-gray-900">
                            Upload Sapaad CSV Files
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Upload both the Orders report and Items report
                            exported from Sapaad.
                        </p>
                    </div>

                    {/* Upload Cards */}
                    <div className="grid gap-6 p-6 md:grid-cols-2">
                        <CsvUploadCard
                            type="orders"
                            title="Orders CSV"
                            description="Upload the Sapaad Orders report"
                            icon={
                                <ShoppingCart className="h-6 w-6" />
                            }
                            file={files.orders}
                            dragging={dragging === "orders"}
                            onDragEnter={() =>
                                setDragging("orders")
                            }
                            onDragLeave={() =>
                                setDragging(null)
                            }
                            onDrop={(event) =>
                                handleDrop(event, "orders")
                            }
                            onFile={(file) =>
                                handleFile(file, "orders")
                            }
                            onRemove={() =>
                                removeFile("orders")
                            }
                        />

                        <CsvUploadCard
                            type="items"
                            title="Items CSV"
                            description="Upload the Sapaad Items report"
                            icon={
                                <Package className="h-6 w-6" />
                            }
                            file={files.items}
                            dragging={dragging === "items"}
                            onDragEnter={() =>
                                setDragging("items")
                            }
                            onDragLeave={() =>
                                setDragging(null)
                            }
                            onDrop={(event) =>
                                handleDrop(event, "items")
                            }
                            onFile={(file) =>
                                handleFile(file, "items")
                            }
                            onRemove={() =>
                                removeFile("items")
                            }
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mx-6 mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />

                                <p className="text-sm text-red-700">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    <ImportInfo />

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                        <div className="text-sm text-gray-500">
                            {!canContinue ? (
                                <span>
                                    Select both CSV files to continue.
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />

                                    Both files are ready
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={!canContinue || loading}
                            className="flex items-center gap-2 rounded-lg bg-[#40332a] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#30251e] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                            {loading ? (
                                <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Uploading...
                                </>
                            ) : (
                                <>
                                Continue
                                <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                            </button>
                    </div>
                </div>
            </div>
        </div>
    );
}