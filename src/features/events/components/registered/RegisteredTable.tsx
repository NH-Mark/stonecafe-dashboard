
"use client";

import { useEffect, useState } from "react";

import {
    ColumnFiltersState,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";


import { Registered } from "@/types/registered";
import { RegisteredColumns } from "./RegisteredColumns";
import { exportRegisteredList, getRegisteredList, sendRegistrationEmails } from "../../registered.service";
import SendRegistrationEmailsDialog from "./SendRegistrationEmailsDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface RegisteredTableProps {
    refreshKey: number;
}

interface RegisteredResponse {
    data: Registered[];

    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };

    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
}

export default function RegisteredTable({
    refreshKey,
}: RegisteredTableProps) {
    const [registered, setRegistered] =
        useState<Registered[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [exporting, setExporting] = useState(false);

    /**
     * Server-side search.
     */
    const [search, setSearch] =
        useState("");

    /**
     * Server-side column filters.
     */
    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>([]);

    const [pagination, setPagination] =
        useState({
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
            from: null as number | null,
            to: null as number | null,
        });

    /**
     * Load registered events.
     */
    async function loadRegistered(
        page: number,
        perPage: number,
        searchValue: string,
        filters: ColumnFiltersState
    ) {
        try {
            setLoading(true);

            const response =
                await getRegisteredList({
                    page,
                    per_page: perPage,

                    search:
                        searchValue ||
                        undefined,

                    filters:
                        filters.length
                            ? filters
                            : undefined,
                });

            const result: RegisteredResponse =
                response.data;

            setRegistered(result.data);

            setPagination({
                current_page:
                    result.meta.current_page,

                last_page:
                    result.meta.last_page,

                per_page:
                    result.meta.per_page,

                total:
                    result.meta.total,

                from:
                    result.meta.from,

                to:
                    result.meta.to,
            });
        } catch (error) {
            console.error(
                "Failed to load registered events:",
                error
            );
        } finally {
            setLoading(false);
        }
    }


    async function handleExport() {
        try {
            setExporting(true);

            const response = await exportRegisteredList({
                search,
                filters: columnFilters,
            });

            const blob = new Blob(
                [response.data],
                {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            );

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `event-registrations-${new Date()
                .toISOString()
                .slice(0, 10)}.xlsx`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

            toast.success("Registration export downloaded.");
        } catch (error) {
            console.error("Failed to export registrations:", error);
            toast.error("Failed to export registrations.");
        } finally {
            setExporting(false);
        }
    }

    /**
     * Initial load.
     */
    useEffect(() => {
        loadRegistered(
            1,
            10,
            "",
            []
        );
    }, []);

    /**
     * Refresh after create/update/delete.
     */
    useEffect(() => {
        if (refreshKey === 0) {
            return;
        }

        loadRegistered(
            pagination.current_page,
            pagination.per_page,
            search,
            columnFilters
        );
    }, [refreshKey]);

    /**
     * Handle everything from DataTable:
     *
     * - search
     * - column filters
     * - pagination
     * - page size
     */
    function handleServerStateChange(
        searchValue: string,
        filters: ColumnFiltersState,
        page: number,
        pageSize: number
    ) {
        if (!Number.isFinite(page)) {
            return;
        }

        if (!Number.isFinite(pageSize)) {
            return;
        }

        if (page < 1) {
            return;
        }

        setSearch(searchValue);

        setColumnFilters(filters);

        loadRegistered(
            page,
            pageSize,
            searchValue,
            filters
        );
    }

    /**
     * Refresh after create/update/delete.
     */
    async function handleSuccess() {
        await loadRegistered(
            pagination.current_page,
            pagination.per_page,
            search,
            columnFilters
        );
    }

    return (
        <div className="space-y-4">

            <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleExport}
                    disabled={exporting}
                >
                    <Download className="mr-2 h-4 w-4" />
                    {exporting ? "Exporting..." : "Export to Excel"}
                </Button>

                <SendRegistrationEmailsDialog
                    registrations={registered}
                    onSend={async (eventId, group) => {
                        await sendRegistrationEmails(eventId, group);
                    }}
                />
            </div>
            <DataTable
                serverPagination={true}

                columns={RegisteredColumns({
                    onSuccess:
                        handleSuccess,
                })}

                data={registered}

                searchKey="name"
                placeholder="Search Registration..."

                pageIndex={
                    pagination.current_page
                }

                pageSize={
                    pagination.per_page
                }

                pageCount={
                    pagination.last_page
                }

                total={
                    pagination.total
                }

                from={
                    pagination.from
                }

                to={
                    pagination.to
                }

                loading={loading}

                onServerStateChange={
                    handleServerStateChange
                }
            />

        </div>
    );

}

